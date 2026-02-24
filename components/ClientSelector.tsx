'use client';

import { useState, useRef } from 'react';
import { useClickOutside } from '@/hooks/useClickOutside';
import type { ClientSummary } from '@/lib/types';

interface ClientSelectorProps {
  clients: ClientSummary[];
  selectedClient: string | null;
  onSelectClient: (id: string | null) => void;
  agentColor: string;
}

export default function ClientSelector({
  clients,
  selectedClient,
  onSelectClient,
  agentColor,
}: ClientSelectorProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, () => setOpen(false), open);

  const current = clients.find((c) => c.id === selectedClient);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border hover:border-border-active transition-colors text-sm"
      >
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: current ? agentColor : '#6B7B8D' }} />
        <span className={current ? 'text-text-primary' : 'text-text-muted'}>
          {current ? current.name : 'Aucun client'}
        </span>
        <svg
          className={`w-3 h-3 text-text-muted transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full mt-1 right-0 w-64 bg-bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden">
          <button
            onClick={() => { onSelectClient(null); setOpen(false); }}
            className={`w-full text-left px-4 py-2.5 text-sm hover:bg-bg-hover transition-colors flex items-center gap-2 ${
              !selectedClient ? 'text-text-primary bg-bg-hover/50' : 'text-text-secondary'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-text-muted" />
            Mode libre (pas de client)
          </button>

          <div className="border-t border-border" />

          {clients.map((client) => (
            <button
              key={client.id}
              onClick={() => { onSelectClient(client.id); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 hover:bg-bg-hover transition-colors ${
                selectedClient === client.id ? 'bg-bg-hover/50' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: selectedClient === client.id ? agentColor : '#6B7B8D' }}
                />
                <span className="text-sm text-text-primary font-medium">{client.name}</span>
              </div>
              {client.sector && (
                <p className="text-[10px] text-text-muted ml-3.5 mt-0.5">{client.sector}</p>
              )}
            </button>
          ))}

          {clients.length === 0 && (
            <div className="px-4 py-3 text-xs text-text-muted text-center">
              Aucun client
            </div>
          )}
        </div>
      )}
    </div>
  );
}
