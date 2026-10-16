import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getCharacterById, getEpisodeByUrl } from '../api/rickAndMortyApi'
import { logAnalyticsEvent, addToFavorites, getFavorites } from '../api/dbApi'
import { useAuth } from '../context/AuthContext'

export default function CharacterDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [character, setCharacter] = useState(null)
  const [episodes, setEpisodes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isFavorite, setIsFavorite] = useState(false)

  // Загрузка персонажа
  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError('')
      try {
        const data = await getCharacterById(id)
        if (cancelled) return
        setCharacter(data)

        // Логируем просмотр
        if (user) {
          logAnalyticsEvent(user.id, 'view', 'character', data.id, {
            name: data.name
          })

          // Проверяем, в избранном ли
          const favs = await getFavorites(user.id)
          setIsFavorite(
            favs.some((f) => f.character_api_id === data.id)
          )
        }

        // Загружаем первые 6 эпизодов
        if (data.episode && data.episode.length > 0) {
          const previews = data.episode.slice(0, 6)
          const loadedEpisodes = []
          for (const url of previews) {
            try {
              const ep = await getEpisodeByUrl(url)
              loadedEpisodes.push(ep)
            } catch (e) {
              // пропускаем
            }
          }
          if (!cancelled) setEpisodes(loadedEpisodes)
        }
      } catch (e) {
        if (!cancelled) setError(e.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [id, user])

  const handleFavorite = async () => {
    if (!user) {
      alert('Войдите в аккаунт, чтобы добавить в избранное')
      return
    }
    if (isFavorite) return
    try {
      await addToFavorites(user.id, character)
      setIsFavorite(true)
      await logAnalyticsEvent(user.id, 'add', 'character', character.id, {
        name: character.name
      })
    } catch (e) {
      alert('Не удалось добавить: ' + e.message)
    }
  }

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center py-20">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-600">Загрузка персонажа...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded mb-6">
          ❌ {error}
        </div>
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
        >
          ← Назад
        </button>
      </div>
    )
  }

  if (!character) return null

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-blue-600 hover:underline"
      >
        ← Назад
      </button>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          <div>
            <img
              src={character.image}
              alt={character.name}
              className="w-full rounded-lg"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-4">{character.name}</h1>

            <div className="space-y-2 text-gray-700">
              <p>
                <strong>Статус:</strong>{' '}
                <span className={`px-2 py-1 rounded text-white text-xs ${
                  character.status === 'Alive' ? 'bg-green-500' :
                  character.status === 'Dead' ? 'bg-red-500' : 'bg-gray-500'
                }`}>
                  {character.status}
                </span>
              </p>
              <p><strong>Вид:</strong> {character.species}</p>
              {character.type && (
                <p><strong>Тип:</strong> {character.type}</p>
              )}
              <p><strong>Пол:</strong> {character.gender}</p>
              <p><strong>Происхождение:</strong> {character.origin?.name || 'Неизвестно'}</p>
              <p><strong>Локация:</strong> {character.location?.name || 'Неизвестно'}</p>
              <p><strong>Эпизодов:</strong> {character.episode?.length || 0}</p>
            </div>

            <div className="mt-6 flex gap-2 flex-wrap">
              {user && (
                <button
                  onClick={handleFavorite}
                  disabled={isFavorite}
                  className={`px-4 py-2 rounded ${
                    isFavorite
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-yellow-500 text-white hover:bg-yellow-600'
                  }`}
                >
                  {isFavorite ? '★ В избранном' : '☆ В избранное'}
                </button>
              )}
              <Link
                to="/characters"
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                К списку персонажей
              </Link>
            </div>
          </div>
        </div>

        {episodes.length > 0 && (
          <div className="border-t border-gray-200 p-6">
            <h2 className="text-xl font-bold mb-4">
              Первые эпизоды ({character.episode.length} всего)
            </h2>
            <ul className="space-y-2">
              {episodes.map((ep) => (
                <li key={ep.id} className="bg-gray-50 p-3 rounded">
                  <span className="font-semibold">{ep.episode}</span> — {ep.name}
                  <span className="text-gray-500 ml-2">({ep.air_date})</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
