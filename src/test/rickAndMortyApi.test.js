import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getCharacters } from '../api/rickAndMortyApi'

describe('rickAndMortyApi', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('возвращает список персонажей при успешном запросе', async () => {
    const mockData = {
      results: [{ id: 1, name: 'Rick' }],
      info: { pages: 1, count: 1 }
    }

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockData)
      })
    )

    const result = await getCharacters(1, '')
    expect(result.results).toHaveLength(1)
    expect(result.results[0].name).toBe('Rick')
  })

  it('возвращает notFound при 404', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 404,
        json: () => Promise.resolve({})
      })
    )

    const result = await getCharacters(1, 'xyznotexist')
    expect(result.notFound).toBe(true)
    expect(result.results).toEqual([])
  })

  it('выбрасывает ошибку при 500', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.resolve({})
      })
    )

    await expect(getCharacters(1, '')).rejects.toThrow()
  })
})
