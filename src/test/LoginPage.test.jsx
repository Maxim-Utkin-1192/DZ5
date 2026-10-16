import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import LoginPage from '../pages/LoginPage'

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    signIn: vi.fn(() => Promise.resolve({ error: null }))
  })
}))

function renderWithRouter(component) {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('LoginPage', () => {
  it('отображает поля email и пароля', () => {
    renderWithRouter(<LoginPage />)
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Пароль')).toBeInTheDocument()
  })

  it('отображает кнопку "Войти"', () => {
    renderWithRouter(<LoginPage />)
    expect(screen.getByText('Войти')).toBeInTheDocument()
  })

  it('позволяет ввести email и пароль', () => {
    renderWithRouter(<LoginPage />)
    const emailInput = screen.getByPlaceholderText('Email')
    const passwordInput = screen.getByPlaceholderText('Пароль')

    fireEvent.change(emailInput, { target: { value: 'test@test.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })

    expect(emailInput.value).toBe('test@test.com')
    expect(passwordInput.value).toBe('password123')
  })

  it('форма имеет кнопку типа submit', () => {
    renderWithRouter(<LoginPage />)
    const button = screen.getByText('Войти')
    expect(button.type).toBe('submit')
  })
})
