'use client';

import AgentAvatar from '@/components/AgentAvatar';
import type { AgentConfig } from '@/lib/types';

interface AgentSelectorProps {
  agents: AgentConfig[];
  selectedAgent: string;
  onSelect: (id: string) => void;
}

export default function AgentSelector({ agents, selectedAgent, onSelect }: AgentSelectorProps) {
  return (
    <div className="flex gap-1 bg-bg-hover rounded-lg p-0.5">
      {agents.map((a) => (
        <button
          key={a.id}
          onClick={() => onSelect(a.id)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-all ${
            selectedAgent === a.id
              ? 'bg-bg-primary text-text-primary shadow-sm'
              : 'text-text-muted hover:text-text-secondary'
          }`}
        >
          <div className="w-5 h-5 rounded overflow-hidden">
            <AgentAvatar avatar={a.avatar} emoji={a.emoji} name={a.name} color={a.color} size={20} />
          </div>
          {a.name}
        </button>
      ))}
    </div>
  );
}
