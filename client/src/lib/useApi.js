import { useEffect, useState } from 'react';

// Small shared hook so every page doesn't repeat the same fetch/loading/error
// boilerplate. Usage: const { data, loading, error } = useApi('/treatments')
export function useApi(path) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    setError(null);

    fetch(`/api${path}`, { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error('Request failed'))))
      .then(setData)
      .catch((err) => {
        if (err.name !== 'AbortError') setError(err);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [path]);

  return { data, loading, error };
}
