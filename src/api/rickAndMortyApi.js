const BASE_URL = 'https://rickandmortyapi.com/api'

export async function getCharacters(page = 1, name = '') {
  const params = new URLSearchParams()
  params.append('page', page)
  if (name) params.append('name', name)

  const response = await fetch(`${BASE_URL}/character/?${params.toString()}`)

  if (response.status === 404) {
    return {
      results: [],
      info: { pages: 0, count: 0 },
      notFound: true
    }
  }

  if (!response.ok) {
    throw new Error(`Ошибка загрузки (HTTP ${response.status})`)
  }

  return await response.json()
}

export async function getCharacterById(id) {
  const response = await fetch(`${BASE_URL}/character/${id}`)
  if (!response.ok) throw new Error('Персонаж не найден')
  return await response.json()
}

export async function getEpisodeByUrl(url) {
  const response = await fetch(url)
  if (!response.ok) throw new Error('Эпизод не найден')
  return await response.json()
}

export async function getEpisodes() {
  const response = await fetch(`${BASE_URL}/episode`)
  if (!response.ok) throw new Error('Ошибка загрузки эпизодов')
  return await response.json()
}
