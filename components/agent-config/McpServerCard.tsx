'use client';

import { useState } from 'react';
import type { McpServer } from '@/lib/types';

interface McpServerCardProps {
  name: string;
  server: McpServer;
  isEditing: boolean;
  isTesting: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onTest: () => void;
}

export default function McpServerCard({
  name,
  server,
  isEditing,
  isTesting,
  onToggle,
  onEdit,
  onDelete,
  onTest,
}: McpServerCardProps) {
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const isEnabled = server.enabled !== false;

  return (
    <div
      className={`group relative rounded-lg px-3 py-3 cursor-pointer transition-all animate-fade-in ${
        isEditing ? 'bg-bg-hover ring-1 ring-border-active' : 'bg-bg-hover/30 hover:bg-bg-hover/60'
      }`}
      onClick={onEdit}
    >
      <div className="flex items-center gap-2.5">
        {/* Status indicator */}
        <div className="flex-shrink-0">
          {isEnabled ? (
            <div className="relative">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <div className="absolute inset-0 w-2 h-2 rounded-full bg-green-400 animate-ping opacity-30" />
            </div>
          ) : (
            <div className="w-2 h-2 rounded-full bg-text-muted" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-text-primary">{name}</div>
          <div className="text-[10px] text-text-muted truncate">
            {server.type === 'stdio' ? `${server.command} ${(server.args || []).join(' ')}` : server.url}
          </div>
        </div>

        {/* Type badge with icon */}
        <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-bg-hover text-text-muted">
          {server.type === 'stdio' ? (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="4 17 10 11 4 5" />
              <line x1="12" y1="19" x2="20" y2="19" />
            </svg>
          ) : (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          )}
          {server.type}
        </span>

        {/* Toggle */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggle(); }}
          className={`w-7 h-3.5 rounded-full transition-colors flex-shrink-0 relative ${
            isEnabled ? 'bg-accent-green' : 'bg-bg-hover'
          }`}
        >
          <div className={`absolute top-0.5 w-2.5 h-2.5 rounded-full bg-white transition-all ${
            isEnabled ? 'left-[14px]' : 'left-0.5'
          }`} />
        </button>

        <button
          onClick={(e) => { e.stopPropagation(); onTest(); }}
          disabled={isTesting}
          className="opacity-0 group-hover:opacity-100 px-2 py-1 rounded text-[10px] font-medium text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 disabled:opacity-30 transition-all"
        >
          {isTesting ? '...' : 'Tester'}
        </button>
        {deleteConfirm ? (
          <div className="flex gap-1 animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => { onDelete(); setDeleteConfirm(false); }}
              className="px-1.5 py-0.5 rounded text-[10px] bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
            >
              Oui
            </button>
            <button
              onClick={() => setDeleteConfirm(false)}
              className="px-1.5 py-0.5 rounded text-[10px] text-text-muted hover:text-text-secondary transition-colors"
            >
              Non
            </button>
          </div>
        ) : (
          <button
            onClick={(e) => { e.stopPropagation(); setDeleteConfirm(true); }}
            className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center rounded text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-all text-xs"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
