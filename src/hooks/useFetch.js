// CineVerse — useFetch hook
// Generic data-fetching hook with loading/error/data states and cancellation support.
import {useState, useEffect, useCallback, useRef} from 'react';

/**
 * @param {Function} fetcher — async function that accepts an AbortSignal and returns an Axios response
 * @param {Array} deps — dependencies that trigger a re-fetch
 * @param {Object} options
 * @param {boolean} options.immediate — if false, do not fetch on mount (default true)
 */
export default function useFetch(fetcher, deps = [], options = {}) {
  const {immediate = true, transform} = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  const execute = useCallback(async () => {
    // Cancel any previous in-flight request
    if (abortRef.current) {
      abortRef.current.abort();
    }
    abortRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const response = await fetcher(abortRef.current.signal);
      const result = transform ? transform(response) : response?.data;
      setData(result);
    } catch (err) {
      if (err.name === 'CanceledError' || err.name === 'AbortError') {
        // Request was cancelled — do not update state
        return;
      }
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    if (immediate) {
      execute();
    }
    return () => {
      if (abortRef.current) {
        abortRef.current.abort();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [execute]);

  return {data, loading, error, refetch: execute};
}
