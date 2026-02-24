'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import ChatPanel from '@/components/ChatPanel';
import ClientsPage from '@/components/ClientsPage';
import AgentConfigPage from '@/components/agent-config/AgentConfigPage';
import { useAgents } from '@/hooks/useAgents';
import { useClients } from '@/hooks/useClients';
import { useConversations } from '@/hooks/useConversations';
import { useStreamingChat } from '@/hooks/useStreamingChat';
import type { AppView } from '@/lib/types';

export default function Home() {
  const [activeView, setActiveView] = useState<AppView>('chat');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { agents, refresh: refreshAgents } = useAgents();
  const { clients, refresh: refreshClients } = useClients();
  const conv = useConversations(agents);
  const chat = useStreamingChat(conv);

  useEffect(() => {
    conv.refreshList();
  }, [conv.refreshList]);

  const currentAgent = agents.find(
    (a) => a.id === (conv.activeConversation?.agentId || agents[0]?.id)
  ) || agents[0];

  const handleSelectConversation = (id: string) => {
    conv.selectConversation(id);
    setActiveView('chat');
  };

  const handleNewConversation = () => {
    conv.newConversation();
    setActiveView('chat');
  };

  const handleSelectAgent = (agentId: string) => {
    conv.newConversation(agentId);
    setActiveView('chat');
  };

  const handleSelectClientForChat = (clientId: string) => {
    conv.setSelectedClient(clientId);
    setActiveView('chat');
  };

  if (agents.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-primary">
        <div className="text-text-muted text-sm">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar
        agents={agents}
        conversations={conv.conversations}
        activeConversationId={conv.activeConversationId}
        onSelectConversation={handleSelectConversation}
        onNewConversation={handleNewConversation}
        onDeleteConversation={conv.deleteConversation}
        activeAgentId={conv.activeConversation?.agentId || null}
        onSelectAgent={handleSelectAgent}
        activeView={activeView}
        onNavigate={setActiveView}
        onAgentCreated={refreshAgents}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="md:ml-56 flex-1 w-full min-w-0">
        {activeView === 'config' ? (
          <AgentConfigPage agents={agents} onAgentsChanged={refreshAgents} onOpenSidebar={() => setIsSidebarOpen(true)} />
        ) : activeView === 'clients' ? (
          <ClientsPage
            clients={clients}
            onRefresh={refreshClients}
            onSelectClientForChat={handleSelectClientForChat}
            onOpenSidebar={() => setIsSidebarOpen(true)}
          />
        ) : (
          <ChatPanel
            agent={currentAgent}
            agents={agents}
            onChangeAgent={conv.updateConversation}
            messages={conv.activeConversation?.messages || []}
            onSendMessage={chat.sendMessage}
            isLoading={chat.isLoading}
            streamingText={chat.streamingText}
            streamingThinking={chat.streamingThinking}
            streamingTools={chat.streamingTools}
            clients={clients}
            selectedClient={conv.selectedClient}
            onSelectClient={conv.setSelectedClient}
            onOpenSidebar={() => setIsSidebarOpen(true)}
          />
        )}
      </main>
    </div>
  );
}
