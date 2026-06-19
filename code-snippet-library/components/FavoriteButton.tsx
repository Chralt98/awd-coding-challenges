"use client";

import useFavoritesStore from "@/store/favoritesStore";

export default function FavoriteButton({ id }: { id: string }) {
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const isFavorite = favoriteIds.includes(id);

  return (
    <button
      onClick={() => toggleFavorite(id)}
      className="rounded-md border px-3 py-1 text-sm transition-colors hover:bg-muted"
    >
      {isFavorite ? "Unfavorite" : "Favorite"}
    </button>
  );
}
