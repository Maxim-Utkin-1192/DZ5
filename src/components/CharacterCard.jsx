import { Link } from 'react-router-dom'

export default function CharacterCard({ character, onFavorite, isFavorite, onDelete }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
      <Link to={`/character/${character.id}`} className="block">
        <img
          src={character.image}
          alt={character.name}
          className="w-full h-48 object-cover hover:opacity-90 transition-opacity"
        />
      </Link>
      <div className="p-4 flex flex-col flex-1">
        <Link to={`/character/${character.id}`}>
          <h3 className="font-bold text-lg mb-2 hover:text-blue-600 transition-colors">
            {character.name}
          </h3>
        </Link>
        <p className="text-sm text-gray-600 mb-1">
          <span className={`px-2 py-1 rounded text-white text-xs mr-2 ${
            character.status === 'Alive' ? 'bg-green-500' :
            character.status === 'Dead' ? 'bg-red-500' : 'bg-gray-500'
          }`}>
            {character.status}
          </span>
          {character.species}
        </p>
        <p className="text-sm text-gray-600 mb-1">
          🌍 {character.origin?.name || 'Unknown'}
        </p>
        <p className="text-sm text-gray-600 mb-3">
          📍 {character.location?.name || 'Unknown'}
        </p>
        <div className="mt-auto flex gap-2">
          <Link
            to={`/character/${character.id}`}
            className="flex-1 p-2 bg-blue-500 text-white rounded text-sm text-center hover:bg-blue-600"
          >
            Подробнее →
          </Link>
          {onFavorite && (
            <button
              onClick={() => onFavorite(character)}
              disabled={isFavorite}
              className={`p-2 rounded text-sm ${
                isFavorite
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-yellow-500 text-white hover:bg-yellow-600'
              }`}
              title={isFavorite ? 'Уже в избранном' : 'В избранное'}
            >
              {isFavorite ? '★' : '☆'}
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(character.id)}
              className="p-2 bg-red-500 text-white rounded text-sm hover:bg-red-600"
              title="Удалить"
            >
              🗑
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
