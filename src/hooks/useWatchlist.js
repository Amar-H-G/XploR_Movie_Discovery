// CineVerse — useWatchlist hook
import {useState, useEffect, useCallback} from 'react';
import {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  isInWatchlist,
} from '../storage/storageService';

export default function useWatchlist(item) {
  const [inWatchlist, setInWatchlist] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!item) {
      return;
    }
    let cancelled = false;
    isInWatchlist(item).then(val => {
      if (!cancelled) {
        setInWatchlist(val);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [item]);

  const toggleWatchlist = useCallback(async () => {
    if (!item) {
      return;
    }
    if (inWatchlist) {
      await removeFromWatchlist(item);
      setInWatchlist(false);
    } else {
      await addToWatchlist(item);
      setInWatchlist(true);
    }
  }, [item, inWatchlist]);

  return {inWatchlist, toggleWatchlist, loading};
}

export function useWatchlistItems() {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const list = await getWatchlist();
    setWatchlist(list);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return {watchlist, loading, refresh: load, setWatchlist};
}
