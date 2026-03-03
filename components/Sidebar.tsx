'use client';

import { useState, useRef } from 'react';
import AgentAvatar from './AgentAvatar';
import CreateAgentModal from './CreateAgentModal';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';
import { timeAgo } from '@/lib/utils';
import type { AgentConfig, ConversationMeta, AppView, SettingsTab } from '@/lib/types';

interface SidebarProps {
  agents: AgentConfig[];
  conversations: ConversationMeta[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  activeAgentId: string | null;
  onSelectAgent: (agentId: string) => void;
  activeView: AppView;
  onNavigate: (view: AppView) => void;
  settingsTab: SettingsTab;
  onSettingsTabChange: (tab: SettingsTab) => void;
  onAgentCreated?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({
  agents,
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  activeAgentId,
  onSelectAgent,
  activeView,
  onNavigate,
  settingsTab,
  onSettingsTabChange,
  onAgentCreated,
}: SidebarProps) {
  const getAgent = (id: string) => agents.find((a) => a.id === id);
  const [search, setSearch] = useState('');
  const [showCreateAgent, setShowCreateAgent] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Cmd+K to focus search
  useKeyboardShortcut('k', () => searchRef.current?.focus(), { meta: true });

  // Escape to clear search when focused
  useKeyboardShortcut('Escape', () => {
    if (document.activeElement === searchRef.current) {
      setSearch('');
      searchRef.current?.blur();
    }
  });

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

  const showSettings = activeView === 'settings';

  return (
    <>
      <aside className="w-56 border-r border-border bg-bg-primary flex flex-col h-screen fixed left-0 top-0">
        {/* Logo */}
        <div className="px-4 py-3.5 border-b border-border">
          <div
            className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => onNavigate('chat')}
          >
            <div className="text-xl font-bold font-mono tracking-wider text-text-primary">
              <span className="text-accent-cyan">A</span>O
            </div>
            <div className="text-[10px] text-text-muted uppercase tracking-widest">
              Agency OS
            </div>
          </div>
        </div>

        {showSettings ? (
          <>
            {/* Settings mode: sub-navigation */}
            <div className="px-4 py-3 border-b border-border">
              <p className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">
                Settings
              </p>
            </div>
            <nav className="flex-1 overflow-y-auto py-2">
              {/* Agents tab */}
              <button
                onClick={() => onSettingsTabChange('agents')}
                className={`relative w-full flex items-center gap-2.5 px-4 py-2.5 transition-all text-left ${
                  settingsTab === 'agents' ? 'bg-bg-hover text-text-primary' : 'hover:bg-bg-hover/50 text-text-secondary'
                }`}
              >
                {settingsTab === 'agents' && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-5 bg-accent-cyan rounded-r" />
                )}
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className={settingsTab === 'agents' ? 'text-accent-cyan' : 'text-text-muted'}>
                  <rect x="3" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="3" width="7" height="7" rx="1.5" />
                  <rect x="3" y="14" width="7" height="7" rx="1.5" />
                  <rect x="14" y="14" width="7" height="7" rx="1.5" />
                </svg>
                <span className="text-xs font-medium flex-1">Agents</span>
                <span className="text-[10px] text-text-muted bg-bg-hover px-1.5 py-0.5 rounded-full font-mono">
                  {agents.length}
                </span>
              </button>

              {/* Agents list when agents tab active */}
              {settingsTab === 'agents' && (
                <div className="py-1 px-2">
                  {agents.map((agent) => (
                    <button
                      key={agent.id}
                      onClick={() => onSelectAgent(agent.id)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg mb-0.5 transition-all text-left ${
                        activeAgentId === agent.id ? 'bg-bg-hover' : 'hover:bg-bg-hover/50'
                      }`}
                    >
                      <div className="w-6 h-6 rounded-md overflow-hidden flex-shrink-0 ring-1 ring-border">
                        <AgentAvatar
                          avatar={agent.avatar}
                          emoji={agent.emoji}
                          name={agent.name}
                          color={agent.color}
                          size={24}
                          className="w-full h-full"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className={`text-[11px] font-medium truncate block ${
                          activeAgentId === agent.id ? 'text-text-primary' : 'text-text-secondary'
                        }`}>
                          {agent.name}
                        </span>
                        <span className="text-[10px] text-text-muted truncate block">
                          {agent.role}
                        </span>
                      </div>
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: agent.statusColor }}
                      />
                    </button>
                  ))}

                  {/* Nouvel agent */}
                  <button
                    onClick={() => setShowCreateAgent(true)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg mt-1 transition-all text-left hover:bg-bg-hover/50 border border-dashed border-border"
                  >
                    <div className="w-6 h-6 rounded-md flex items-center justify-center bg-bg-hover flex-shrink-0">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-muted" strokeLinecap="round">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </div>
                    <span className="text-[11px] text-text-muted font-medium">
                      Nouvel agent
                    </span>
                  </button>
                </div>
              )}

              {/* Separator */}
              <div className="mx-4 my-1.5 border-t border-border/50" />

              {/* Clients tab */}
              <button
                onClick={() => onSettingsTabChange('clients')}
                className={`relative w-full flex items-center gap-2.5 px-4 py-2.5 transition-all text-left ${
                  settingsTab === 'clients' ? 'bg-bg-hover text-text-primary' : 'hover:bg-bg-hover/50 text-text-secondary'
                }`}
              >
                {settingsTab === 'clients' && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-5 bg-accent-cyan rounded-r" />
                )}
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className={settingsTab === 'clients' ? 'text-accent-cyan' : 'text-text-muted'}>
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span className="text-xs font-medium flex-1">Clients</span>
              </button>

              {/* Config tab */}
              <button
                onClick={() => onSettingsTabChange('config')}
                className={`relative w-full flex items-center gap-2.5 px-4 py-2.5 transition-all text-left ${
                  settingsTab === 'config' ? 'bg-bg-hover text-text-primary' : 'hover:bg-bg-hover/50 text-text-secondary'
                }`}
              >
                {settingsTab === 'config' && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-5 bg-accent-cyan rounded-r" />
                )}
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={settingsTab === 'config' ? 'text-accent-cyan' : 'text-text-muted'}>
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <span className="text-xs font-medium flex-1">Configuration</span>
              </button>
            </nav>
          </>
        ) : (
          <>
            {/* Chat mode: New conversation + Search + Conversations list */}
            <div className="px-4 py-3 border-b border-border">
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
                  const isActive = activeConversationId === conv.id;

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
                          <AgentAvatar
                            avatar={agent.avatar}
                            emoji={agent.emoji}
                            name={agent.name}
                            color={agent.color}
                            size={24}
                            className="w-full h-full"
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
                      {deleteConfirm === conv.id ? (
                        <div className="absolute right-1 top-1/2 -translate-y-1/2 flex gap-1 bg-bg-primary border border-border rounded-lg p-1 shadow-lg z-10">
                          <button
                            onClick={(e) => { e.stopPropagation(); onDeleteConversation(conv.id); setDeleteConfirm(null); }}
                            className="px-2 py-0.5 rounded text-[10px] bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                          >
                            Supprimer
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setDeleteConfirm(null); }}
                            className="px-2 py-0.5 rounded text-[10px] text-text-muted hover:text-text-secondary transition-colors"
                          >
                            Non
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => { e.stopPropagation(); setDeleteConfirm(conv.id); }}
                          className="opacity-0 group-hover:opacity-100 absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-bg-hover text-text-muted hover:text-red-400 transition-all"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </nav>
          </>
        )}

        {/* Bottom nav */}
        <div className="border-t border-border px-2 py-2">
          <button
            onClick={() => onNavigate('settings')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg mb-0.5 transition-all text-left ${
              showSettings ? 'bg-bg-hover' : 'hover:bg-bg-hover/50'
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-muted" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span className={`text-xs font-medium ${
              showSettings ? 'text-text-primary' : 'text-text-secondary'
            }`}>
              Settings
            </span>
          </button>

          <div className="px-3 py-2 text-[10px] text-text-muted flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-green" />
            Powered by Claude Code
          </div>
        </div>
      </aside>

      {/* Create Agent Modal */}
      {showCreateAgent && (
        <CreateAgentModal
          onClose={() => setShowCreateAgent(false)}
          onCreated={() => {
            setShowCreateAgent(false);
            onAgentCreated?.();
          }}
        />
      )}
    </>
  );
}
