import { useEffect, useState } from 'react'
import { getCharacters } from '../api/rickAndMortyApi'
import {
  getUserCharacters,
  addToFavorites,
  getFavorites,
  logAnalyticsEvent
} from '../api/dbApi'
import { useAuth } from '../context/AuthContext'
import CharacterCard from '../components/CharacterCard'

export default function CharactersPage() {
  const { user } = useAuth()
  const [characters, setCharacters] = useState([])
  const [dbCharacters, setDbCharacters] = useState([])
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notFound, setNotFound] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')

  // Загрузка персонажей из Rick and Morty API
  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError('')
      setNotFound(false)

      try {
        const data = await getCharacters(page, search)

        if (!cancelled) {
          setCharacters(data.results || [])
          setTotalPages(data.info?.pages || 1)

          if (data.notFound && search) {
            setNotFound(true)
          }

          if (user && search) {
            logAnalyticsEvent(user.id, 'search', 'character', null, {
              query: search,
              results: data.results?.length || 0
            })
          }
        }
      } catch (e) {
        if (!cancelled) {
          setCharacters([])
          setError(e.message)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [page, search, user])

  // Загрузка ТОЛЬКО СВОИХ созданных персонажей
  useEffect(() => {
    async function loadDb() {
      if (!user) {
        setDbCharacters([])
        return
      }
      try {
        const data = await getUserCharacters(user.id)
        setDbCharacters(data || [])
      } catch (e) {
        console.error('Ошибка загрузки БД персонажей:', e)
      }
    }
    loadDb()
  }, [user])

  // Загрузка избранного
  useEffect(() => {
    if (!user) {
      setFavorites([])
      return
    }
    async function loadFav() {
      try {
        const data = await getFavorites(user.id)
        setFavorites(data || [])
      } catch (e) {
        console.error('Ошибка загрузки избранного:', e)
      }
    }
    loadFav()
  }, [user])

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    setSearch(searchInput.trim())
  }

  const handleReset = () => {
    setSearch('')
    setSearchInput('')
    setPage(1)
  }

  const handleFavorite = async (character) => {
    if (!user) {
      alert('Войдите в аккаунт, чтобы добавить в избранное')
      return
    }
    try {
      await addToFavorites(user.id, character)
      const data = await getFavorites(user.id)
      setFavorites(data || [])
      await logAnalyticsEvent(user.id, 'add', 'character', character.id, {
        name: character.name
      })
    } catch (e) {
      console.error(e)
      alert('Не удалось добавить в избранное: ' + e.message)
    }
  }

  const isFavorite = (character) =>
    favorites.some((f) => f.character_api_id === character.id)

  // Фильтрация своих созданных персонажей по поиску
  const filteredDbCharacters = search
    ? dbCharacters.filter((char) =>
        char.name.toLowerCase().includes(search.toLowerCase())
      )
    : dbCharacters

  const totalFound = characters.length + filteredDbCharacters.length
  const showEmptyMessage = !loading && !error && search && totalFound === 0

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Персонажи</h1>

      <form onSubmit={handleSearch} className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="Поиск персонажа по имени..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="flex-1 p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600"
        >
          Найти
        </button>
        {search && (
          <button
            type="button"
            onClick={handleReset}
            className="bg-gray-300 px-4 rounded hover:bg-gray-400"
          >
            Сбросить
          </button>
        )}
      </form>

      {loading && (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Загрузка персонажей...</p>
        </div>
      )}

      {error && !loading && (
        <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded mb-6">
          <p>❌ {error}</p>
        </div>
      )}

      {showEmptyMessage && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 p-4 rounded mb-6">
          <p>🔍 По запросу «{search}» ничего не найдено</p>
          <p className="text-sm mt-2">Попробуйте изменить поисковый запрос</p>
        </div>
      )}

      {notFound && !showEmptyMessage && !loading && !error && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 p-4 rounded mb-6">
          <p>🔍 По запросу «{search}» ничего не найдено в Rick and Morty API</p>
        </div>
      )}

      {!loading && !error && characters.length > 0 && (
        <>
          <h2 className="text-xl font-bold mb-4">
            Персонажи из Rick and Morty API
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {characters.map((char) => (
              <CharacterCard
                key={char.id}
                character={char}
                onFavorite={handleFavorite}
                isFavorite={isFavorite(char)}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
              >
                ← Назад
              </button>
              <span className="text-gray-700">
                Страница {page} из {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
              >
                Вперёд →
              </button>
            </div>
          )}
        </>
      )}

      {user && filteredDbCharacters.length > 0 && !loading && (
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-4">
            Ваши созданные персонажи ({filteredDbCharacters.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDbCharacters.map((char) => (
              <div
                key={char.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                {char.image_url && (
                  <img
                    src={char.image_url}
                    alt={char.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{char.name} ✨</h3>
                  <p className="text-sm text-gray-600 mb-1">
                    <span
                      className={`px-2 py-1 rounded text-white text-xs mr-2 ${
                        char.status === 'Alive'
                          ? 'bg-green-500'
                          : char.status === 'Dead'
                          ? 'bg-red-500'
                          : 'bg-gray-500'
                      }`}
                    >
                      {char.status}
                    </span>
                    {char.species}
                  </p>
                  <p className="text-sm text-gray-600">🌍 {char.origin}</p>
                  <p className="text-sm text-gray-600">📍 {char.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
