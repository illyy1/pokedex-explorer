import { useFavorites } from '../favorites'

// ★ when the Pokémon is a favorite, ☆ when it is not. Clicking switches it.
function FavoriteButton({ id, name }: { id: number; name: string }) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const favorite = isFavorite(id)
  return (
    <button
      type="button"
      className={favorite ? 'favorite-button on' : 'favorite-button'}
      aria-pressed={favorite}
      aria-label={favorite ? `Remove ${name} from favorites` : `Add ${name} to favorites`}
      title={favorite ? 'Remove from favorites' : 'Add to favorites'}
      onClick={() => toggleFavorite(id)}
    >
      {favorite ? '★' : '☆'}
    </button>
  )
}

export default FavoriteButton
