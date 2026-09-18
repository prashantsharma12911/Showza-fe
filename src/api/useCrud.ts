import { useCallback, useEffect, useState } from 'react';
import { apiClient, extractErrorMessage } from './client';

export function useCrud<T extends { id?: number }>(endpoint: string) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get<T[]>(endpoint);
      setItems(res.data);
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const create = async (payload: T) => {
    await apiClient.post(endpoint, payload);
    await refresh();
  };

  const update = async (id: number, payload: T) => {
    await apiClient.put(`${endpoint}/${id}`, payload);
    await refresh();
  };

  const remove = async (id: number) => {
    await apiClient.delete(`${endpoint}/${id}`);
    await refresh();
  };

  return { items, loading, error, refresh, create, update, remove };
}
