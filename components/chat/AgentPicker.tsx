'use client';

import { useState, useRef } from 'react';
import { useClickOutside } from '@/hooks/useClickOutside';
import AgentAvatar from '@/components/AgentAvatar';
import type { AgentConfig } from '@/lib/types';

interface AgentPickerProps {
  agent: AgentConfig;
  agents: AgentConfig[];
  onChangeAgent: (agentId: string) => void;
}

export default function AgentPicker({ agent, agents, onChangeAgent }: AgentPickerProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, () => setOpen(false), open);

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 pl-3 pr-1 py-3 text-text-secondary hover:text-text-primary transition-colors"
        title={`Agent : ${agent.name}`}
      >
        <div className="w-5 h-5 rounded-md overflow-hidden ring-1 ring-border">
          <AgentAvatar avatar={agent.avatar} emoji={agent.emoji} name={agent.name} color={agent.color} size={20} className="w-full h-full" />
        </div>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-text-muted">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="absolute bottom-full left-0 mb-2 w-48 bg-bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50">
          {agents.map((a) => (
            <button
              key={a.id}
              onClick={() => {
                onChangeAgent(a.id);
                setOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left hover:bg-bg-hover transition-colors ${
                a.id === agent.id ? 'bg-bg-hover' : ''
              }`}
            >
              <div className="w-6 h-6 rounded-md overflow-hidden flex-shrink-0">
                <AgentAvatar avatar={a.avatar} emoji={a.emoji} name={a.name} color={a.color} size={24} className="w-full h-full" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-medium text-text-primary block">{a.name}</span>
                <span className="text-[10px] text-text-muted block truncate">{a.role}</span>
              </div>
              {a.id === agent.id && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-accent-cyan flex-shrink-0">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
