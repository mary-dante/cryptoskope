import { useEffect, useState } from 'react';

export function useAutoRefresh<T>(
  fetchData: () => Promise<T>,
  interval: number = 30000 // Default to 30 seconds
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    let timeoutId: NodeJS.Timeout;

    const fetchAndUpdate = async () => {
      try {
        setLoading(true);
        const result = await fetchData();
        if (mounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('An error occurred'));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Initial fetch
    fetchAndUpdate();

    // Set up interval
    const scheduleNextFetch = () => {
      timeoutId = setTimeout(async () => {
        await fetchAndUpdate();
        scheduleNextFetch();
      }, interval);
    };

    scheduleNextFetch();

    // Cleanup
    return () => {
      mounted = false;
      clearTimeout(timeoutId);
    };
  }, [fetchData, interval]);

  return { data, loading, error };
} 