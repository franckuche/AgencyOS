'use client';

import { useState } from 'react';
import AgentAvatar from '@/components/AgentAvatar';
import SkillsTab from './tabs/SkillsTab';
import PersonalityTab from './tabs/PersonalityTab';
import McpServicesTab from './tabs/McpServicesTab';
import { agentsApi } from '@/lib/api';
import type { AgentConfig } from '@/lib/types';

interface AgentConfigPageProps {
  agents: AgentConfig[];
  onAgentsChanged?: () => void;
  onOpenSidebar?: () => void;
}

type ConfigTab = 'skills' | 'personality' | 'services';

const NAV_ITEMS: { key: ConfigTab; label: string; icon: React.ReactNode }[] = [
  {
    key: 'skills',
    label: 'Skills',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    key: 'personality',
    label: 'Personnalité',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    key: 'services',
    label: 'Services MCP',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
      </svg>
    ),
  },
];

export default function AgentConfigPage({ agents, onAgentsChanged, onOpenSidebar }: AgentConfigPageProps) {
  const [selectedAgent, setSelectedAgent] = useState<string>(agents[0]?.id || '');
  const [activeTab, setActiveTab] = useState<ConfigTab>('skills');
  const [deleteAgentConfirm, setDeleteAgentConfirm] = useState(false);

  const agent = agents.find((a) => a.id === selectedAgent);

  const deleteAgent = async () => {
    if (!selectedAgent) return;
    try {
      await agentsApi.delete(selectedAgent);
      setDeleteAgentConfirm(false);
      onAgentsChanged?.();
      const remaining = agents.filter((a) => a.id !== selectedAgent);
      if (remaining.length > 0) {
        setSelectedAgent(remaining[0].id);
      }
    } catch {
      // silently fail
    }
  };

  if (!agent) return null;

  return (
    <div className="h-screen flex flex-col">
      {/* Accent bar */}
      <div className="h-1 w-full flex-shrink-0" style={{ backgroundColor: agent.color }} />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar navigation */}
        <aside className="w-56 flex-shrink-0 flex flex-col bg-bg-primary border-r border-border">
          {/* Agent header */}
          <div className="px-4 py-5 border-b border-border">
            <div className="flex items-center gap-3">
              {onOpenSidebar && (
                <button
                  onClick={onOpenSidebar}
                  className="md:hidden p-1.5 rounded-lg hover:bg-bg-hover text-text-muted"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                </button>
              )}
              <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                <AgentAvatar avatar={agent.avatar} emoji={agent.emoji} name={agent.name} color={agent.color} size={48} />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-text-primary truncate">{agent.name}</div>
                <div className="text-xs text-text-muted truncate">{agent.role}</div>
              </div>
            </div>
            {/* Agent pills */}
            <div className="flex flex-wrap gap-1 mt-3">
              {agents.map((a) => (
                <button
                  key={a.id}
                  onClick={() => { setSelectedAgent(a.id); setDeleteAgentConfirm(false); }}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs transition-all ${
                    selectedAgent === a.id
                      ? 'bg-bg-hover text-text-primary'
                      : 'text-text-muted hover:text-text-secondary hover:bg-bg-hover/50'
                  }`}
                >
                  <div className="w-4 h-4 rounded overflow-hidden flex-shrink-0">
                    <AgentAvatar avatar={a.avatar} emoji={a.emoji} name={a.name} color={a.color} size={16} />
                  </div>
                  <span className="truncate">{a.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Nav items */}
          <nav className="flex-1 py-2 px-2">
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setActiveTab(item.key)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all mb-0.5 relative ${
                    isActive
                      ? 'bg-bg-hover text-text-primary font-medium'
                      : 'text-text-muted hover:text-text-secondary hover:bg-bg-hover/50'
                  }`}
                >
                  {isActive && (
                    <div
                      className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full"
                      style={{ backgroundColor: agent.color }}
                    />
                  )}
                  <span className={isActive ? '' : 'opacity-60'}>{item.icon}</span>
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Danger zone */}
          <div className="px-3 py-3 border-t border-border">
            {deleteAgentConfirm ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={deleteAgent}
                  className="flex-1 px-2 py-1.5 rounded-lg text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                >
                  Confirmer
                </button>
                <button
                  onClick={() => setDeleteAgentConfirm(false)}
                  className="px-2 py-1.5 rounded-lg text-xs text-text-muted hover:text-text-secondary transition-colors"
                >
                  Annuler
                </button>
              </div>
            ) : (
              <button
                onClick={() => setDeleteAgentConfirm(true)}
                className="w-full text-left px-3 py-2 rounded-lg text-xs text-text-muted hover:text-red-400 transition-colors"
              >
                Supprimer l&apos;agent...
              </button>
            )}
          </div>
        </aside>

        {/* Tab content — tabs now occupy full main area */}
        <main className="flex-1 flex overflow-hidden bg-[#F9FAFB]">
          {activeTab === 'skills' && <SkillsTab agent={agent} />}
          {activeTab === 'personality' && <PersonalityTab agent={agent} />}
          {activeTab === 'services' && <McpServicesTab agent={agent} />}
        </main>
      </div>
    </div>
  );
}
