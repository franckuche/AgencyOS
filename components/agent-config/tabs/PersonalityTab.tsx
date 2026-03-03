'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';
import { personalityApi } from '@/lib/api';
import type { AgentConfig } from '@/lib/types';

interface PersonalityTabProps {
  agent: AgentConfig;
}

export default function PersonalityTab({ agent }: PersonalityTabProps) {
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const originalContent = useRef('');

  const fetchPersonality = useCallback(async () => {
    try {
      const data = await personalityApi.get(agent.id);
      const c = data.content || '';
      setContent(c);
      originalContent.current = c;
      setHasChanges(false);
    } catch {
      // silently fail
    }
  }, [agent.id]);

  useEffect(() => {
    fetchPersonality();
  }, [fetchPersonality]);

  const save = useCallback(async () => {
    if (saving) return;
    setSaving(true);
    try {
      const res = await personalityApi.update(agent.id, content);
      if (res.ok) {
        setSaved(true);
        setHasChanges(false);
        originalContent.current = content;
        setTimeout(() => setSaved(false), 2000);
      }
    } catch {
      // silently fail
    } finally {
      setSaving(false);
    }
  }, [agent.id, content, saving]);

  useKeyboardShortcut('s', () => save(), { meta: true });

  const handleContentChange = (value: string) => {
    setContent(value);
    setHasChanges(value !== originalContent.current);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F9FAFB]">
      {/* Header compact */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-bg-primary">
        <div className="flex items-center gap-3">
          <svg className="text-text-muted flex-shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
          <span className="text-sm font-medium text-text-primary">CLAUDE.md</span>
          {hasChanges && (
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" title="Modifications non sauvegardees" />
          )}
          <span className="text-xs text-text-muted font-mono">agents/{agent.id}/CLAUDE.md</span>
        </div>
        <div className="flex items-center gap-2">
          {saved ? (
            <span className="flex items-center gap-1.5 text-xs text-green-400">
              <svg className="animate-check-in" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Sauvegarde
            </span>
          ) : (
            <>
              <span className="bg-bg-hover text-text-muted text-[10px] px-1.5 py-0.5 rounded font-mono">
                &#8984;S
              </span>
              <button
                onClick={save}
                disabled={saving}
                className="px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
                style={{
                  backgroundColor: `${agent.color}20`,
                  color: agent.color,
                }}
              >
                {saving ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
            </>
          )}
        </div>
      </div>
      <textarea
        value={content}
        onChange={(e) => handleContentChange(e.target.value)}
        className="flex-1 w-full bg-transparent text-text-secondary text-sm font-mono p-6 resize-none focus:outline-none leading-relaxed"
        placeholder="Contenu du CLAUDE.md..."
        spellCheck={false}
      />
    </div>
  );
}
