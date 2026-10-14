// CineVerse — usePagination hook
// Handles paginated TMDB list responses with load-more support and deduplication.
import {useState, useCallback, useRef} from 'react';
import {deduplicateById} from '../utils/helpers';

/**
 * @param {Function} fetcher — (page, signal) => Promise<AxiosResponse>
 */
export default function usePagination(fetcher) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const abortRef = useRef(null);

  const load = useCallback(
    async (pageNum = 1, append = false) => {
      if (abortRef.current) {
        abortRef.current.abort();
      }
      abortRef.current = new AbortController();

      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setError(null);
      }

      try {
        const response = await fetcher(pageNum, abortRef.current.signal);
        const results = response?.data?.results || [];
        const total = response?.data?.total_pages || 1;

        setTotalPages(total);
        setHasMore(pageNum < total);
        setPage(pageNum);

        if (append) {
          setData(prev => deduplicateById([...prev, ...results]));
        } else {
          setData(results);
        }
      } catch (err) {
        if (err.name === 'CanceledError' || err.name === 'AbortError') {
          return;
        }
        setError(err.message || 'Failed to load content');
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },

    [fetcher],
  );

  const refresh = useCallback(() => load(1, false), [load]);

  const loadMore = useCallback(() => {
    if (!loadingMore && !loading && hasMore) {
      load(page + 1, true);
    }
  }, [loadingMore, loading, hasMore, load, page]);

  return {
    data,
    loading,
    loadingMore,
    error,
    page,
    totalPages,
    hasMore,
    refresh,
    loadMore,
  };
}
