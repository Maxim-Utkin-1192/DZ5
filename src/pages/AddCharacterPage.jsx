import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addDbCharacter, logAnalyticsEvent } from '../api/dbApi'
import { useAuth } from '../context/AuthContext'

export default function AddCharacterPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    status: 'Alive',
    species: 'Human',
    gender: 'Male',
    image_url: '',
    origin: '',
    location: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  if (!user) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Создать персонажа</h1>
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 p-4 rounded">
          ⚠️ Войдите в аккаунт, чтобы создавать персонажей
        </div>
      </div>
    )
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!form.name.trim()) {
      setError('Введите имя персонажа')
      return
    }

    setLoading(true)
    try {
      await addDbCharacter({
        ...form,
        user_id: user.id,
        is_public: true
      })

      await logAnalyticsEvent(user.id, 'add', 'character', null, {
        name: form.name
      })

      setSuccess(`Персонаж «${form.name}» успешно создан!`)
      setForm({
        name: '',
        status: 'Alive',
        species: 'Human',
        gender: 'Male',
        image_url: '',
        origin: '',
        location: ''
      })

      setTimeout(() => navigate('/characters'), 1500)
    } catch (e) {
      console.error(e)
      setError('Ошибка создания персонажа: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Создать персонажа</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded mb-4">
          ❌ {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 p-3 rounded mb-4">
          ✅ {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        <div>
          <label className="block font-semibold mb-1">Имя *</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Например: Мой Рик"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">Статус</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="Alive">Жив</option>
              <option value="Dead">Мёртв</option>
              <option value="unknown">Неизвестно</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Пол</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="Male">Мужской</option>
              <option value="Female">Женский</option>
              <option value="unknown">Неизвестно</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block font-semibold mb-1">Вид (species)</label>
          <input
            type="text"
            name="species"
            value={form.species}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Human, Alien, Robot..."
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">URL изображения</label>
          <input
            type="url"
            name="image_url"
            value={form.image_url}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Происхождение</label>
          <input
            type="text"
            name="origin"
            value={form.origin}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Например: Земля"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Локация</label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Например: Цитадель Риков"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 text-white p-3 rounded hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? 'Сохранение...' : 'Создать персонажа'}
        </button>
      </form>
    </div>
  )
}
