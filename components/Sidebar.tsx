'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface ConversationMeta {
  id: string;
  title: string;
  agentId: string;
  updatedAt: string;
  messageCount: number;
}

interface Agent {
  id: string;
  name: string;
  avatar: string;
  color: string;
  role: string;
}

interface SidebarProps {
  agents: Agent[];
  conversations: ConversationMeta[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  activeView: 'chat' | 'clients' | 'skills';
  onNavigate: (view: 'chat' | 'clients' | 'skills') => void;
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffH = Math.floor(diffMs / 3600000);
  const diffD = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return "à l'instant";
  if (diffMin < 60) return `${diffMin}min`;
  if (diffH < 24) return `${diffH}h`;
  if (diffD < 7) return `${diffD}j`;
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

export default function Sidebar({
  agents,
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  activeView,
  onNavigate,
}: SidebarProps) {
  const getAgent = (id: string) => agents.find((a) => a.id === id);
  const [search, setSearch] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  // Cmd+K to focus search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === 'Escape' && document.activeElement === searchRef.current) {
        setSearch('');
        searchRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const filtered = search.trim()
    ? conversations.filter((c) => {
        const q = search.toLowerCase();
        const agent = getAgent(c.agentId);
        return (
          c.title.toLowerCase().includes(q) ||
          (agent?.name.toLowerCase().includes(q) ?? false)
        );
      })
    : conversations;

  return (
    <aside className="w-56 border-r border-border bg-bg-primary flex flex-col h-screen fixed left-0 top-0">
      {/* Logo + New chat */}
      <div className="px-4 py-4 border-b border-border">
        <div
          className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity mb-3"
          onClick={() => onNavigate('chat')}
        >
          <div className="text-xl font-bold font-mono tracking-wider text-text-primary">
            <span className="text-accent-cyan">Q</span>G
          </div>
          <div className="text-[10px] text-text-muted uppercase tracking-widest">
            Quartier Général
          </div>
        </div>

        <button
          onClick={onNewConversation}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:bg-bg-hover transition-colors text-text-secondary hover:text-text-primary text-xs mb-2"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Nouvelle conversation
        </button>

        {/* Search */}
        <div className="relative">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={searchRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher..."
            className="w-full bg-bg-hover/50 border border-transparent focus:border-border text-xs text-text-primary placeholder-text-muted rounded-lg pl-8 pr-8 py-1.5 focus:outline-none transition-colors"
          />
          {search ? (
            <button
              onClick={() => { setSearch(''); searchRef.current?.focus(); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          ) : (
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-text-muted font-mono bg-bg-hover px-1 py-0.5 rounded">
              ⌘K
            </span>
          )}
        </div>
      </div>

      {/* Conversations list */}
      <nav className="flex-1 overflow-y-auto px-2 py-2">
        {filtered.length === 0 ? (
          <div className="px-3 py-6 text-center">
            <p className="text-xs text-text-muted">
              {search ? 'Aucun résultat' : 'Aucune conversation'}
            </p>
          </div>
        ) : (
          filtered.map((conv) => {
            const agent = getAgent(conv.agentId);
            const isActive = activeConversationId === conv.id && activeView === 'chat';

            return (
              <div
                key={conv.id}
                className={`group relative flex items-center gap-2.5 px-3 py-2.5 rounded-lg mb-0.5 cursor-pointer transition-all ${
                  isActive ? 'bg-bg-hover' : 'hover:bg-bg-hover/50'
                }`}
                onClick={() => onSelectConversation(conv.id)}
              >
                {agent && (
                  <div className="w-6 h-6 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={agent.avatar}
                      alt={agent.name}
                      width={24}
                      height={24}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium truncate ${
                    isActive ? 'text-text-primary' : 'text-text-secondary'
                  }`}>
                    {conv.title}
                  </p>
                  <p className="text-[10px] text-text-muted truncate">
                    {agent?.name || conv.agentId} · {timeAgo(conv.updatedAt)}
                  </p>
                </div>

                {/* Delete button on hover */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteConversation(conv.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-bg-hover text-text-muted hover:text-red-400 transition-all"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>
            );
          })
        )}
      </nav>

      {/* Bottom nav */}
      <div className="border-t border-border px-2 py-2">
        <button
          onClick={() => onNavigate('clients')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg mb-0.5 transition-all text-left ${
            activeView === 'clients' ? 'bg-bg-hover' : 'hover:bg-bg-hover/50'
          }`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-muted" strokeLinecap="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <span className={`text-xs font-medium ${
            activeView === 'clients' ? 'text-text-primary' : 'text-text-secondary'
          }`}>
            Clients
          </span>
        </button>

        <button
          onClick={() => onNavigate('skills')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg mb-0.5 transition-all text-left ${
            activeView === 'skills' ? 'bg-bg-hover' : 'hover:bg-bg-hover/50'
          }`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-muted" strokeLinecap="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
          <span className={`text-xs font-medium ${
            activeView === 'skills' ? 'text-text-primary' : 'text-text-secondary'
          }`}>
            Skills
          </span>
        </button>

        <div className="px-3 py-2 text-[10px] text-text-muted flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-green" />
          Powered by Claude Code
        </div>
      </div>
    </aside>
  );
}
