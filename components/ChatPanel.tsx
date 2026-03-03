'use client';

import { useState, useRef, useCallback } from 'react';
import AgentAvatar from './AgentAvatar';
import ClientSelector from './ClientSelector';
import MessageList from './chat/MessageList';
import ChatInput from './chat/ChatInput';
import type { AgentConfig, Message, ToolCall, ClientInfo } from '@/lib/types';

interface ChatPanelProps {
  agent: AgentConfig;
  agents: AgentConfig[];
  onChangeAgent: (agentId: string) => void;
  messages: Message[];
  onSendMessage: (agentId: string, message: string, clientId: string | null) => void;
  onStop: () => void;
  isLoading: boolean;
  streamingText: string;
  streamingThinking: string;
  streamingTools: ToolCall[];
  clients: ClientInfo[];
  selectedClient: string | null;
  onSelectClient: (id: string | null) => void;
  onOpenSidebar?: () => void;
}

export default function ChatPanel({
  agent,
  agents,
  onChangeAgent,
  messages,
  onSendMessage,
  onStop,
  isLoading,
  streamingText,
  streamingThinking,
  streamingTools,
  clients,
  selectedClient,
  onSelectClient,
  onOpenSidebar,
}: ChatPanelProps) {
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);

  const currentClient = clients.find((c) => c.id === selectedClient);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.types.includes('Files')) setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;
    // Drop is handled by ChatInput via its own file input
    // For drag-and-drop we dispatch to the hidden file input
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      // Trigger upload via dispatched event
      const event = new CustomEvent('chat-file-drop', { detail: files });
      window.dispatchEvent(event);
    }
  }, []);

  return (
    <div
      className="flex flex-col h-screen relative bg-bg-primary"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Drag overlay */}
      {isDragging && (
        <div className="absolute inset-0 z-50 bg-bg-primary/90 backdrop-blur-sm flex items-center justify-center pointer-events-none">
          <div className="border-2 border-dashed border-accent-cyan/40 rounded-2xl p-12 text-center">
            <div className="w-12 h-12 rounded-xl bg-accent-cyan/10 flex items-center justify-center mx-auto mb-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent-cyan">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <p className="text-text-primary font-medium text-sm">Dépose ton fichier ici</p>
            <p className="text-text-muted text-xs mt-1">CSV, PDF, Excel, Word — max 50 Mo</p>
          </div>
        </div>
      )}

      {/* Top bar */}
      <div className="border-b border-border px-5 py-3.5 flex items-center gap-3.5 bg-bg-primary/80 backdrop-blur-md sticky top-0 z-10">
        {onOpenSidebar && (
          <button
            onClick={onOpenSidebar}
            className="md:hidden p-1.5 rounded-lg hover:bg-bg-hover text-text-muted"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        )}
        <div className="rounded-lg overflow-hidden flex-shrink-0 ring-1 ring-border" style={{ width: 36, height: 36 }}>
          <AgentAvatar avatar={agent.avatar} emoji={agent.emoji} name={agent.name} color={agent.color} size={36} className="w-full h-full" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-[15px] font-semibold text-text-primary">{agent.name}</h2>
            <span className="text-xs text-text-muted">{agent.role}</span>
          </div>
        </div>

        {currentClient && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-accent-cyan/8 border border-accent-cyan/15">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan" />
            <span className="text-[11px] text-accent-cyan font-medium">{currentClient.name}</span>
          </div>
        )}

        <ClientSelector
          clients={clients}
          selectedClient={selectedClient}
          onSelectClient={onSelectClient}
          agentColor={agent.color}
        />

        <div className="flex items-center gap-1.5 ml-1">
          <span
            className="w-2 h-2 rounded-full transition-colors"
            style={{
              backgroundColor: isLoading ? '#FFB800' : agent.color,
              animation: isLoading ? 'pulse-dot 1.5s infinite' : 'none',
            }}
          />
          <span
            className="text-[10px] uppercase tracking-wider font-semibold"
            style={{ color: isLoading ? '#FFB800' : agent.color }}
          >
            {isLoading ? 'Réfléchit...' : 'Dispo'}
          </span>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 && !isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 rounded-2xl overflow-hidden mx-auto mb-5 ring-2 ring-border">
                <AgentAvatar avatar={agent.avatar} emoji={agent.emoji} name={agent.name} color={agent.color} size={64} className="w-full h-full" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-1">
                Salut, c&apos;est{' '}
                <span style={{ color: agent.color }}>{agent.name}</span>
              </h3>
              <p className="text-sm text-text-secondary mb-4">{agent.role}</p>
              {currentClient ? (
                <p className="text-xs text-accent-cyan bg-accent-cyan/8 inline-block px-3 py-1.5 rounded-full">
                  Client actif : {currentClient.name}
                </p>
              ) : (
                <p className="text-xs text-text-muted">
                  Envoie un message ou sélectionne un client pour contextualiser
                </p>
              )}
            </div>
          </div>
        ) : (
          <MessageList
            agent={agent}
            messages={messages}
            isLoading={isLoading}
            streamingText={streamingText}
            streamingThinking={streamingThinking}
            streamingTools={streamingTools}
            clients={clients}
          />
        )}
      </div>

      {/* Input area */}
      <ChatInput
        agent={agent}
        agents={agents}
        onChangeAgent={onChangeAgent}
        onSendMessage={onSendMessage}
        onStop={onStop}
        isLoading={isLoading}
        selectedClient={selectedClient}
        clients={clients}
      />
    </div>
  );
}
