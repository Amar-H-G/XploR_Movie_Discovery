// CineVerse — useFavorites hook
// Syncs favorite state with AsyncStorage across components.
import {useState, useEffect, useCallback} from 'react';
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  isFavorite,
} from '../storage/storageService';

export default function useFavorites(item) {
  const [favorited, setFavorited] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!item) {
      return;
    }
    let cancelled = false;
    isFavorite(item).then(val => {
      if (!cancelled) {
        setFavorited(val);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [item]);

  const toggleFavorite = useCallback(async () => {
    if (!item) {
      return;
    }
    if (favorited) {
      await removeFavorite(item);
      setFavorited(false);
    } else {
      await addFavorite(item);
      setFavorited(true);
    }
  }, [item, favorited]);

  return {favorited, toggleFavorite, loading};
}

// Hook to load the full favorites list
export function useFavoritesList() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const list = await getFavorites();
    setFavorites(list);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return {favorites, loading, refresh: load, setFavorites};
}
