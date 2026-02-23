'use client';

import { useState, useCallback, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import ChatPanel from '@/components/ChatPanel';
import ClientsPage, { type ClientInfo } from '@/components/ClientsPage';
import SkillsPage from '@/components/SkillsPage';

interface ToolCall {
  name: string;
  input: Record<string, unknown>;
  result?: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  clientId?: string | null;
  thinking?: string;
  toolCalls?: ToolCall[];
}

interface ConversationMeta {
  id: string;
  title: string;
  agentId: string;
  clientId: string | null;
  updatedAt: string;
  messageCount: number;
}

interface Conversation extends ConversationMeta {
  messages: Message[];
  createdAt: string;
}

const agentsConfig = [
  {
    id: 'seo',
    name: 'Omar',
    role: 'Analyste SEO Senior',
    quote: "Les données ne mentent pas, les gens si.",
    avatar: '/avatars/omar.svg',
    color: '#00D4AA',
    statusColor: '#00D4AA',
    bio: 'Ancien lead SEO en agence, passé consultant. Obsédé par la data crawl, le maillage interne et le E-E-A-T.',
    skills: [
      { name: 'Audits', value: 95, color: '#00D4AA' },
      { name: 'Maillage', value: 90, color: '#00D4AA' },
      { name: 'Technique', value: 85, color: '#00D4AA' },
      { name: 'Contenu', value: 75, color: '#00D4AA' },
      { name: 'Data Viz', value: 80, color: '#00D4AA' },
    ],
  },
  {
    id: 'coach',
    name: 'Marco',
    role: 'Préparateur Physique',
    quote: "Le corps oublie pas. Le cerveau triche.",
    avatar: '/avatars/marco.svg',
    color: '#FF8C42',
    statusColor: '#FF8C42',
    bio: 'Ex-sportif de haut niveau reconverti coach. Approche science-based, pas de bullshit motivationnel.',
    skills: [
      { name: 'Musculation', value: 92, color: '#FF8C42' },
      { name: 'Nutrition', value: 78, color: '#FF8C42' },
      { name: 'Récupération', value: 85, color: '#FF8C42' },
      { name: 'Cardio', value: 72, color: '#FF8C42' },
      { name: 'Mobilité', value: 80, color: '#FF8C42' },
    ],
  },
  {
    id: 'chef',
    name: 'Ravi',
    role: 'Cuisinier Personnel',
    quote: "Bien manger c'est pas un régime, c'est un mode de vie.",
    avatar: '/avatars/ravi.svg',
    color: '#4ECB71',
    statusColor: '#4ECB71',
    bio: 'Formé à la cuisine française et indienne. Passionné par les épices et le fait maison.',
    skills: [
      { name: 'Recettes', value: 95, color: '#4ECB71' },
      { name: 'Meal Prep', value: 88, color: '#4ECB71' },
      { name: 'Nutrition', value: 78, color: '#4ECB71' },
      { name: 'Budget', value: 82, color: '#4ECB71' },
      { name: 'Temps', value: 85, color: '#4ECB71' },
    ],
  },
  {
    id: 'alfred',
    name: 'Alfred',
    role: 'Assistant Personnel',
    quote: "Avant que vous ne demandiez, c'est déjà fait.",
    avatar: '/avatars/alfred.svg',
    color: '#5B8DEF',
    statusColor: '#5B8DEF',
    bio: 'Le majordome ultime. Gère tout ce qui ne rentre pas dans les autres : orga, admin, veille, recherche.',
    skills: [
      { name: 'Organisation', value: 90, color: '#5B8DEF' },
      { name: 'Recherche', value: 92, color: '#5B8DEF' },
      { name: 'Productivité', value: 85, color: '#5B8DEF' },
      { name: 'Admin', value: 78, color: '#5B8DEF' },
      { name: 'Veille', value: 82, color: '#5B8DEF' },
    ],
  },
  {
    id: 'bullshito',
    name: 'Bullshito',
    role: 'Expert LinkedIn',
    quote: "Ton post mérite mieux que 200 impressions.",
    avatar: '/avatars/bullshito.svg',
    color: '#E040FB',
    statusColor: '#E040FB',
    bio: "Décrypte l'algorithme LinkedIn (LiRank), score les posts, rédige du contenu optimisé et analyse les performances. Basé sur 1,8M de posts analysés.",
    skills: [
      { name: 'Scoring', value: 92, color: '#E040FB' },
      { name: 'Rédaction', value: 88, color: '#E040FB' },
      { name: 'Analytics', value: 85, color: '#E040FB' },
      { name: 'Algorithme', value: 95, color: '#E040FB' },
      { name: 'Optimisation', value: 90, color: '#E040FB' },
    ],
  },
];

export default function Home() {
  const [activeView, setActiveView] = useState<'chat' | 'clients' | 'skills'>('chat');
  const [conversations, setConversations] = useState<ConversationMeta[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [streamingText, setStreamingText] = useState('');
  const [streamingThinking, setStreamingThinking] = useState('');
  const [streamingTools, setStreamingTools] = useState<ToolCall[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [clients, setClients] = useState<ClientInfo[]>([]);

  const currentAgent = agentsConfig.find(
    (a) => a.id === (activeConversation?.agentId || 'seo')
  ) || agentsConfig[0];

  // Fetch conversations list
  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch('/api/conversations');
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
      }
    } catch {
      // silently fail
    }
  }, []);

  // Fetch clients
  const fetchClients = useCallback(async () => {
    try {
      const res = await fetch('/api/clients');
      if (res.ok) {
        const data = await res.json();
        setClients(data);
      }
    } catch {
      // silently fail
    }
  }, []);

  // Load a specific conversation
  const loadConversation = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/conversations/${id}`);
      if (res.ok) {
        const data: Conversation = await res.json();
        setActiveConversation(data);
        setActiveConversationId(data.id);
        setSelectedClient(data.clientId);
        setActiveView('chat');
      }
    } catch {
      // silently fail
    }
  }, []);

  // Save conversation to backend
  const saveConversation = useCallback(async (conv: Conversation) => {
    try {
      await fetch(`/api/conversations/${conv.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: conv.messages,
          agentId: conv.agentId,
          clientId: conv.clientId,
          title: conv.title,
        }),
      });
    } catch {
      // silently fail
    }
  }, []);

  useEffect(() => {
    fetchConversations();
    fetchClients();
  }, [fetchConversations, fetchClients]);

  // Create new conversation
  const handleNewConversation = useCallback(async () => {
    try {
      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId: 'seo', clientId: selectedClient }),
      });
      if (res.ok) {
        const conv: Conversation = await res.json();
        setActiveConversation(conv);
        setActiveConversationId(conv.id);
        setActiveView('chat');
        fetchConversations();
      }
    } catch {
      // silently fail
    }
  }, [selectedClient, fetchConversations]);

  // Select conversation from sidebar
  const handleSelectConversation = useCallback((id: string) => {
    loadConversation(id);
  }, [loadConversation]);

  // Delete conversation
  const handleDeleteConversation = useCallback(async (id: string) => {
    try {
      await fetch(`/api/conversations/${id}`, { method: 'DELETE' });
      if (activeConversationId === id) {
        setActiveConversation(null);
        setActiveConversationId(null);
      }
      fetchConversations();
    } catch {
      // silently fail
    }
  }, [activeConversationId, fetchConversations]);

  // Change agent for current conversation
  const handleChangeAgent = useCallback(async (agentId: string) => {
    if (!activeConversation) return;
    const updated = { ...activeConversation, agentId };
    setActiveConversation(updated);
    saveConversation(updated);
    fetchConversations();
  }, [activeConversation, saveConversation, fetchConversations]);

  const handleNavigate = (view: 'chat' | 'clients' | 'skills') => {
    setActiveView(view);
  };

  const handleSelectClientForChat = (clientId: string) => {
    setSelectedClient(clientId);
    setActiveView('chat');
  };

  // Send message
  const sendMessage = useCallback(async (agentId: string, message: string, clientId: string | null) => {
    // Create conversation on-the-fly if none active
    let conv = activeConversation;
    if (!conv) {
      try {
        const res = await fetch('/api/conversations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ agentId, clientId }),
        });
        if (!res.ok) return;
        conv = await res.json();
        setActiveConversation(conv!);
        setActiveConversationId(conv!.id);
      } catch {
        return;
      }
    }

    const timestamp = new Date().toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const userMsg: Message = { role: 'user', content: message, timestamp, clientId };
    const withUser: Conversation = {
      ...conv!,
      agentId,
      clientId,
      messages: [...conv!.messages, userMsg],
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

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId, message: contextMessage, clientId }),
      });

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
        timestamp: new Date().toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        thinking: thinking || undefined,
        toolCalls: tools.length > 0 ? tools : undefined,
      };

      const withAssistant: Conversation = {
        ...withUser,
        messages: [...withUser.messages, assistantMsg],
      };
      setActiveConversation(withAssistant);
      saveConversation(withAssistant);
      fetchConversations();
    } catch (error) {
      const errorMsg: Message = {
        role: 'assistant',
        content: `Erreur de communication avec l'agent. Vérifie que Claude Code est lancé.\n\n\`${error}\``,
        timestamp: new Date().toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
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
  }, [activeConversation, saveConversation, fetchConversations]);

  return (
    <div className="flex min-h-screen">
      <Sidebar
        agents={agentsConfig}
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
        onNewConversation={handleNewConversation}
        onDeleteConversation={handleDeleteConversation}
        activeView={activeView}
        onNavigate={handleNavigate}
      />

      <main className="ml-56 flex-1">
        {activeView === 'skills' ? (
          <SkillsPage agents={agentsConfig} />
        ) : activeView === 'clients' ? (
          <ClientsPage
            clients={clients}
            onRefresh={fetchClients}
            onSelectClientForChat={handleSelectClientForChat}
          />
        ) : (
          <ChatPanel
            agent={currentAgent}
            agents={agentsConfig}
            onChangeAgent={handleChangeAgent}
            messages={activeConversation?.messages || []}
            onSendMessage={sendMessage}
            isLoading={isLoading}
            streamingText={streamingText}
            streamingThinking={streamingThinking}
            streamingTools={streamingTools}
            clients={clients}
            selectedClient={selectedClient}
            onSelectClient={setSelectedClient}
          />
        )}
      </main>
    </div>
  );
}
