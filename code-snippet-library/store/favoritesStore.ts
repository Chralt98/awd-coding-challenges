import { useEffect } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FavoritesState {
  favoriteIds: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

const favoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteIds: [],

      toggleFavorite: (id) =>
        set((state) => ({
          favoriteIds: state.favoriteIds.includes(id)
            ? state.favoriteIds.filter((favId) => favId !== id)
            : [...state.favoriteIds, id],
        })),

      isFavorite: (id) => get().favoriteIds.includes(id),
    }),
    {
      name: "favorites-storage",
      skipHydration: true,
    },
  ),
);

let rehydrated = false;

export default function useFavoritesStore<T>(
  selector: (state: FavoritesState) => T,
): T {
  useEffect(() => {
    if (!rehydrated) {
      rehydrated = true;
      favoritesStore.persist.rehydrate();
    }
  }, []);

  return favoritesStore(selector);
}
