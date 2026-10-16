import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import CharactersPage from './pages/CharactersPage'
import CharacterDetailPage from './pages/CharacterDetailPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AnalyticsPage from './pages/AnalyticsPage'
import AddCharacterPage from './pages/AddCharacterPage'

function Navigation() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/characters')
  }

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center flex-wrap gap-2">
        <h1 className="text-xl font-bold">Rick & Morty Portal</h1>
        <div className="space-x-4 flex items-center flex-wrap gap-2">
          <Link to="/characters" className="hover:underline">Персонажи</Link>
          {user && (
            <>
              <Link to="/add" className="hover:underline">➕ Создать</Link>
              <Link to="/analytics" className="hover:underline">Аналитика</Link>
              <span className="text-sm text-gray-300">{user.email}</span>
              <button
                onClick={handleSignOut}
                className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
              >
                Выйти
              </button>
            </>
          )}
          {!user && (
            <>
              <Link to="/login" className="hover:underline">Вход</Link>
              <Link to="/register" className="hover:underline">Регистрация</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<CharactersPage />} />
          <Route path="/characters" element={<CharactersPage />} />
          <Route path="/character/:id" element={<CharacterDetailPage />} />
          <Route path="/add" element={<AddCharacterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
