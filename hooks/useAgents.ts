import { useState, useCallback, useEffect } from 'react';
import { agentsApi } from '@/lib/api';
import type { AgentConfig } from '@/lib/types';

export function useAgents() {
  const [agents, setAgents] = useState<AgentConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const data = await agentsApi.list();
      setAgents(data);
    } catch {
      // silently fail
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { agents, isLoading, refresh };
}
