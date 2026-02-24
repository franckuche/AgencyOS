import { useState, useCallback } from 'react';
import { conversationsApi } from '@/lib/api';
import type { AgentConfig, Conversation, ConversationMeta } from '@/lib/types';

export function useConversations(agents: AgentConfig[]) {
  const [conversations, setConversations] = useState<ConversationMeta[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);

  const refreshList = useCallback(async () => {
    try {
      const data = await conversationsApi.list();
      setConversations(data);
    } catch {
      // silently fail
    }
  }, []);

  const selectConversation = useCallback(async (id: string) => {
    try {
      const data = await conversationsApi.get(id);
      setActiveConversation(data);
      setActiveConversationId(data.id);
      setSelectedClient(data.clientId);
    } catch {
      // silently fail
    }
  }, []);

  const newConversation = useCallback(async (agentId?: string) => {
    const resolvedAgentId = agentId || agents[0]?.id || 'seo';
    try {
      const conv = await conversationsApi.create({ agentId: resolvedAgentId, clientId: selectedClient });
      setActiveConversation(conv);
      setActiveConversationId(conv.id);
      refreshList();
    } catch {
      // silently fail
    }
  }, [selectedClient, refreshList, agents]);

  const deleteConversation = useCallback(async (id: string) => {
    try {
      await conversationsApi.delete(id);
      if (activeConversationId === id) {
        setActiveConversation(null);
        setActiveConversationId(null);
      }
      refreshList();
    } catch {
      // silently fail
    }
  }, [activeConversationId, refreshList]);

  const saveConversation = useCallback(async (conv: Conversation) => {
    try {
      await conversationsApi.update(conv.id, {
        messages: conv.messages,
        agentId: conv.agentId,
        clientId: conv.clientId,
        title: conv.title,
      });
    } catch {
      // silently fail
    }
  }, []);

  const updateConversation = useCallback(async (agentId: string) => {
    if (!activeConversation) return;
    const updated = { ...activeConversation, agentId };
    setActiveConversation(updated);
    saveConversation(updated);
    refreshList();
  }, [activeConversation, saveConversation, refreshList]);

  return {
    conversations,
    activeConversation,
    activeConversationId,
    selectedClient,
    setSelectedClient,
    selectConversation,
    newConversation,
    deleteConversation,
    updateConversation,
    saveConversation,
    setActiveConversation,
    setActiveConversationId,
    refreshList,
  };
}
