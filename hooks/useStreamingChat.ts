import { useState, useCallback } from 'react';
import { conversationsApi, chatApi } from '@/lib/api';
import { formatTimestamp } from '@/lib/utils';
import type { ToolCall, Message, Conversation } from '@/lib/types';

interface UseStreamingChatOpts {
  activeConversation: Conversation | null;
  setActiveConversation: (conv: Conversation) => void;
  setActiveConversationId: (id: string) => void;
  saveConversation: (conv: Conversation) => Promise<void>;
  refreshList: () => Promise<void>;
  selectedClient: string | null;
}

export function useStreamingChat(opts: UseStreamingChatOpts) {
  const {
    activeConversation,
    setActiveConversation,
    setActiveConversationId,
    saveConversation,
    refreshList,
    selectedClient,
  } = opts;

  const [isLoading, setIsLoading] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [streamingThinking, setStreamingThinking] = useState('');
  const [streamingTools, setStreamingTools] = useState<ToolCall[]>([]);

  const sendMessage = useCallback(async (agentId: string, message: string, clientId: string | null) => {
    // Create conversation on-the-fly if none active
    let conv = activeConversation;
    if (!conv) {
      try {
        conv = await conversationsApi.create({ agentId, clientId });
        setActiveConversation(conv);
        setActiveConversationId(conv.id);
      } catch {
        return;
      }
    }

    const timestamp = formatTimestamp();
    const userMsg: Message = { role: 'user', content: message, timestamp, clientId };
    const withUser: Conversation = {
      ...conv,
      agentId,
      clientId,
      messages: [...conv.messages, userMsg],
    };
    setActiveConversation(withUser);
    saveConversation(withUser);

    setIsLoading(true);
    setStreamingText('');
    setStreamingThinking('');
    setStreamingTools([]);

    try {
      const recentHistory = withUser.messages.slice(-6);
      let contextMessage = message;
      if (recentHistory.length > 1) {
        const historyText = recentHistory.slice(0, -1)
          .map((m) => `${m.role === 'user' ? 'Utilisateur' : 'Toi'}: ${m.content}`)
          .join('\n\n');
        contextMessage = `Contexte de la conversation récente:\n${historyText}\n\nNouveau message de l'utilisateur: ${message}`;
      }

      const res = await chatApi.send({ agentId, message: contextMessage, clientId });
      if (!res.ok) throw new Error('Chat request failed');

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let lineBuffer = '';
      let thinking = '';
      let tools: ToolCall[] = [];
      let responseText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        lineBuffer += decoder.decode(value, { stream: true });

        const lines = lineBuffer.split('\n');
        lineBuffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const event = JSON.parse(line);
            switch (event.type) {
              case 'thinking':
                thinking += event.text;
                setStreamingThinking(thinking);
                break;
              case 'tool_use':
                tools = [...tools, { name: event.name, input: event.input }];
                setStreamingTools([...tools]);
                break;
              case 'tool_result':
                if (tools.length > 0) {
                  tools[tools.length - 1].result = event.snippet;
                  setStreamingTools([...tools]);
                }
                break;
              case 'text':
                responseText += event.text;
                setStreamingText(responseText);
                break;
              case 'error':
                responseText += `\n\nErreur: ${event.text}`;
                setStreamingText(responseText);
                break;
            }
          } catch {
            // Not JSON, ignore
          }
        }
      }

      const assistantMsg: Message = {
        role: 'assistant',
        content: responseText || '(pas de réponse)',
        timestamp: formatTimestamp(),
        thinking: thinking || undefined,
        toolCalls: tools.length > 0 ? tools : undefined,
      };

      const withAssistant: Conversation = {
        ...withUser,
        messages: [...withUser.messages, assistantMsg],
      };
      setActiveConversation(withAssistant);
      saveConversation(withAssistant);
      refreshList();
    } catch (error) {
      const errorMsg: Message = {
        role: 'assistant',
        content: `Erreur de communication avec l'agent. Vérifie que Claude Code est lancé.\n\n\`${error}\``,
        timestamp: formatTimestamp(),
      };
      const withError: Conversation = {
        ...withUser,
        messages: [...withUser.messages, errorMsg],
      };
      setActiveConversation(withError);
      saveConversation(withError);
    } finally {
      setIsLoading(false);
      setStreamingText('');
      setStreamingThinking('');
      setStreamingTools([]);
    }
  }, [activeConversation, saveConversation, refreshList, selectedClient, setActiveConversation, setActiveConversationId]);

  return { sendMessage, isLoading, streamingText, streamingThinking, streamingTools };
}
