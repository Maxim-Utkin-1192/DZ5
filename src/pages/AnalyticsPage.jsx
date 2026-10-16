import { useEffect, useState } from 'react'
import { supabase } from '../api/supabaseClient'
import { useAuth } from '../context/AuthContext'
import {
  clearAnalytics,
  clearAnalyticsByType,
  clearUserFavorites,
  clearUserCharacters,
  getUserCharacters,
  getFavorites
} from '../api/dbApi'

export default function AnalyticsPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ views: 0, searches: 0, adds: 0, total: 0 })
  const [recentEvents, setRecentEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [clearing, setClearing] = useState(false)
  const [message, setMessage] = useState('')

  const [favoritesCount, setFavoritesCount] = useState(0)
  const [charactersCount, setCharactersCount] = useState(0)

  async function loadStats() {
    if (!user) {
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      // Загружаем события аналитики
      const { data, error } = await supabase
        .from('analytics_events')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      const events = data || []

      const counts = events.reduce(
        (acc, e) => {
          acc.total++
          if (e.event_type === 'view') acc.views++
          if (e.event_type === 'search') acc.searches++
          if (e.event_type === 'add') acc.adds++
          return acc
        },
        { views: 0, searches: 0, adds: 0, total: 0 }
      )

      setStats(counts)
      setRecentEvents(events.slice(0, 20))

      // Загружаем количество избранного и созданных персонажей
      const favs = await getFavorites(user.id)
      setFavoritesCount(favs?.length || 0)

      const chars = await getUserCharacters(user.id)
      setCharactersCount(chars?.length || 0)
    } catch (e) {
      console.error('Ошибка загрузки аналитики:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStats()
  }, [user])

  const showMessage = (text) => {
    setMessage(text)
    setTimeout(() => setMessage(''), 3000)
  }

  const handleClearAll = async () => {
    const confirmed = window.confirm(
      'Вы уверены? Вся история аналитики будет удалена безвозвратно.'
    )
    if (!confirmed) return
    setClearing(true)
    try {
      await clearAnalytics(user.id)
      showMessage('История аналитики полностью очищена')
      await loadStats()
    } catch (e) {
      console.error(e)
      showMessage('Ошибка: ' + e.message)
    } finally {
      setClearing(false)
    }
  }

  const handleClearByType = async (type, label) => {
    const confirmed = window.confirm(`Удалить все события типа «${label}»?`)
    if (!confirmed) return
    setClearing(true)
    try {
      await clearAnalyticsByType(user.id, type)
      showMessage(`История «${label}» очищена`)
      await loadStats()
    } catch (e) {
      console.error(e)
      showMessage('Ошибка: ' + e.message)
    } finally {
      setClearing(false)
    }
  }

  const handleClearFavorites = async () => {
    const confirmed = window.confirm(
      `Удалить ВСЁ из избранного? (${favoritesCount} шт.)`
    )
    if (!confirmed) return
    setClearing(true)
    try {
      await clearUserFavorites(user.id)
      showMessage('Избранное очищено')
      await loadStats()
    } catch (e) {
      console.error(e)
      showMessage('Ошибка: ' + e.message)
    } finally {
      setClearing(false)
    }
  }

  const handleClearCharacters = async () => {
    const confirmed = window.confirm(
      `Удалить ВСЕХ созданных вами персонажей? (${charactersCount} шт.)`
    )
    if (!confirmed) return
    setClearing(true)
    try {
      await clearUserCharacters(user.id)
      showMessage('Созданные персонажи удалены')
      await loadStats()
    } catch (e) {
      console.error(e)
      showMessage('Ошибка: ' + e.message)
    } finally {
      setClearing(false)
    }
  }

  if (!user) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Аналитика</h1>
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 p-4 rounded">
          ⚠️ Войдите в аккаунт, чтобы просмотреть аналитику
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Аналитика</h1>
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Загрузка статистики...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <h1 className="text-3xl font-bold">Аналитика</h1>
        <button
          onClick={handleClearAll}
          disabled={clearing || stats.total === 0}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50 text-sm"
        >
          🗑 Очистить всю историю
        </button>
      </div>

      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 p-3 rounded mb-4">
          ✅ {message}
        </div>
      )}

      {/* Карточки со статистикой */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-500 text-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-3xl mb-2">👁</div>
              <h3 className="text-lg font-semibold">Просмотры</h3>
              <p className="text-3xl font-bold">{stats.views}</p>
            </div>
            {stats.views > 0 && (
              <button
                onClick={() => handleClearByType('view', 'Просмотры')}
                disabled={clearing}
                className="text-white hover:text-red-200 text-xl"
                title="Очистить просмотры"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="bg-green-500 text-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-3xl mb-2">🔍</div>
              <h3 className="text-lg font-semibold">Поиски</h3>
              <p className="text-3xl font-bold">{stats.searches}</p>
            </div>
            {stats.searches > 0 && (
              <button
                onClick={() => handleClearByType('search', 'Поиски')}
                disabled={clearing}
                className="text-white hover:text-red-200 text-xl"
                title="Очистить поиски"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="bg-purple-500 text-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-3xl mb-2">⭐</div>
              <h3 className="text-lg font-semibold">Добавления</h3>
              <p className="text-3xl font-bold">{stats.adds}</p>
            </div>
            {stats.adds > 0 && (
              <button
                onClick={() => handleClearByType('add', 'Добавления')}
                disabled={clearing}
                className="text-white hover:text-red-200 text-xl"
                title="Очистить добавления"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg mb-8">
        <p className="text-gray-700">
          <strong>Всего событий:</strong> {stats.total}
        </p>
      </div>

      {/* Блок управления данными */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-8">
        <h2 className="text-xl font-bold mb-3">Управление данными</h2>
        <p className="text-gray-600 text-sm mb-4">
          Здесь можно удалить ваши сохранённые данные. Это действие необратимо.
        </p>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={handleClearFavorites}
            disabled={clearing || favoritesCount === 0}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 disabled:opacity-50 text-sm"
          >
            ⭐ Очистить избранное ({favoritesCount})
          </button>
          <button
            onClick={handleClearCharacters}
            disabled={clearing || charactersCount === 0}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 disabled:opacity-50 text-sm"
          >
            👤 Удалить созданных персонажей ({charactersCount})
          </button>
        </div>
      </div>

      {/* Последние события */}
      <h2 className="text-2xl font-bold mb-4">Последние события</h2>
      {recentEvents.length === 0 ? (
        <p className="text-gray-500">
          Пока нет событий. Попробуйте поиск или добавьте персонажа в избранное.
        </p>
      ) : (
        <div className="space-y-2">
          {recentEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white p-3 rounded shadow flex justify-between items-center"
            >
              <div>
                <span className="font-semibold">{event.event_type}</span>
                {event.entity_type && (
                  <span className="text-gray-500 ml-2">
                    ({event.entity_type})
                  </span>
                )}
                {event.metadata?.query && (
                  <span className="text-gray-500 ml-2">
                    — «{event.metadata.query}»
                  </span>
                )}
                {event.metadata?.name && (
                  <span className="text-gray-500 ml-2">
                    — {event.metadata.name}
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-500">
                {new Date(event.created_at).toLocaleString('ru-RU')}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
