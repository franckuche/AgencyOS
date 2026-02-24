'use client';

import { useState } from 'react';
import { formatDate, formatFileSize } from '@/lib/utils';
import type { SkillInfo } from '@/lib/types';

interface SkillListItemProps {
  skill: SkillInfo;
  isSelected: boolean;
  agentColor: string;
  onSelect: (slug: string) => void;
  onDelete: (slug: string) => void;
}

export default function SkillListItem({ skill, isSelected, agentColor, onSelect, onDelete }: SkillListItemProps) {
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  return (
    <div className="relative group animate-fade-in">
      <button
        onClick={() => onSelect(skill.slug)}
        className={`w-full text-left px-3 py-3 rounded-lg mb-0.5 transition-all flex items-stretch gap-0 ${
          isSelected ? 'bg-bg-hover' : 'hover:bg-bg-hover/50'
        }`}
      >
        {/* Accent bar */}
        {isSelected && (
          <div
            className="w-[3px] rounded-full flex-shrink-0 -ml-1 mr-2.5"
            style={{ backgroundColor: agentColor }}
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className={`text-sm font-medium truncate ${
                isSelected ? 'text-text-primary' : 'text-text-secondary'
              }`}>
                {skill.name}
              </div>
              <div className="text-xs text-text-muted mt-0.5 truncate">
                {skill.preview || 'Pas de contenu'}
              </div>
            </div>
            <div className="text-[10px] text-text-muted whitespace-nowrap mt-0.5">
              {formatFileSize(skill.size)}
            </div>
          </div>
          <div className="text-[10px] text-text-muted mt-1">
            {formatDate(skill.modified)}
          </div>
        </div>
      </button>

      {/* Delete button */}
      {deleteConfirm ? (
        <div className="absolute right-2 top-2 flex gap-1 bg-bg-primary border border-border rounded-lg p-1.5 shadow-xl z-10 animate-scale-in">
          <button
            onClick={() => { onDelete(skill.slug); setDeleteConfirm(false); }}
            className="px-2 py-1 rounded text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
          >
            Supprimer
          </button>
          <button
            onClick={() => setDeleteConfirm(false)}
            className="px-2 py-1 rounded text-xs text-text-muted hover:text-text-secondary transition-colors"
          >
            Non
          </button>
        </div>
      ) : (
        <button
          onClick={(e) => { e.stopPropagation(); setDeleteConfirm(true); }}
          className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center rounded text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-all text-xs"
          title="Supprimer"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
}
