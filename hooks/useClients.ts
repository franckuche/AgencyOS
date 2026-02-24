import { useState, useCallback, useEffect } from 'react';
import { clientsApi } from '@/lib/api';
import type { ClientInfo } from '@/lib/types';

export function useClients() {
  const [clients, setClients] = useState<ClientInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const data = await clientsApi.list();
      setClients(data);
    } catch {
      // silently fail
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { clients, isLoading, refresh };
}
