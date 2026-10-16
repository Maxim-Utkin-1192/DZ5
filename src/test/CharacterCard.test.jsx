import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import CharacterCard from '../components/CharacterCard'

const mockCharacter = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  image: 'https://example.com/rick.jpg',
  origin: { name: 'Earth (C-137)' },
  location: { name: 'Citadel of Ricks' }
}

function renderWithRouter(component) {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('CharacterCard', () => {
  it('отображает имя персонажа', () => {
    renderWithRouter(<CharacterCard character={mockCharacter} />)
    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument()
  })

  it('отображает статус и вид', () => {
    renderWithRouter(<CharacterCard character={mockCharacter} />)
    expect(screen.getByText('Alive')).toBeInTheDocument()
    expect(screen.getByText('Human')).toBeInTheDocument()
  })

  it('отображает происхождение и локацию', () => {
    renderWithRouter(<CharacterCard character={mockCharacter} />)
    expect(screen.getByText(/Earth \(C-137\)/)).toBeInTheDocument()
    expect(screen.getByText(/Citadel of Ricks/)).toBeInTheDocument()
  })

  it('отображает ссылку "Подробнее" с правильным href', () => {
    renderWithRouter(<CharacterCard character={mockCharacter} />)
    const link = screen.getByText(/Подробнее/)
    expect(link).toBeInTheDocument()
    expect(link.closest('a')).toHaveAttribute('href', '/character/1')
  })

  it('вызывает onFavorite при клике на кнопку избранного', () => {
    const onFavorite = vi.fn()
    renderWithRouter(
      <CharacterCard character={mockCharacter} onFavorite={onFavorite} />
    )
    const favBtn = screen.getByTitle('В избранное')
    fireEvent.click(favBtn)
    expect(onFavorite).toHaveBeenCalledWith(mockCharacter)
  })
})
