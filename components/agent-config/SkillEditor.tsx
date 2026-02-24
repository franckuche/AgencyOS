'use client';

import { useState, useCallback, useRef } from 'react';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';
import { skillsApi } from '@/lib/api';
import type { AgentConfig, SkillInfo, SkillDetail } from '@/lib/types';

interface SkillEditorProps {
  agent: AgentConfig;
  selectedSkill: string;
  skillDetail: SkillDetail;
  skillContent: string;
  onContentChange: (content: string) => void;
  onSaved: () => void;
  onPrepareSplit: () => void;
  skills: SkillInfo[];
}

export default function SkillEditor({
  agent,
  selectedSkill,
  skillDetail,
  skillContent,
  onContentChange,
  onSaved,
  onPrepareSplit,
  skills,
}: SkillEditorProps) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const originalContent = useRef(skillContent);

  const saveSkill = useCallback(async () => {
    if (saving) return;
    setSaving(true);
    try {
      const res = await skillsApi.update(agent.id, selectedSkill, skillContent);
      if (res.ok) {
        setSaved(true);
        setHasChanges(false);
        originalContent.current = skillContent;
        setTimeout(() => setSaved(false), 2000);
        onSaved();
      }
    } catch {
      // silently fail
    } finally {
      setSaving(false);
    }
  }, [agent.id, selectedSkill, skillContent, saving, onSaved]);

  useKeyboardShortcut('s', () => saveSkill(), { meta: true });

  const handleContentChange = (content: string) => {
    onContentChange(content);
    setHasChanges(content !== originalContent.current);
  };

  const skillName = skills.find((s) => s.slug === selectedSkill)?.name || selectedSkill;

  return (
    <>
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-bg-primary">
        <div className="flex items-center gap-3">
          <svg className="text-text-muted flex-shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <span className="text-sm font-medium text-text-primary">{skillName}</span>
          {hasChanges && (
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" title="Modifications non sauvegardees" />
          )}
          <span className="text-xs font-mono text-text-muted">{selectedSkill}.md</span>
          {skillDetail.isSymlink && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              symlink
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onPrepareSplit}
            className="px-3 py-1.5 rounded-lg text-xs text-text-muted hover:text-text-secondary hover:bg-bg-hover transition-colors"
            title="Subdiviser ce skill par sections ##"
          >
            Subdiviser
          </button>
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
                onClick={saveSkill}
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
        value={skillContent}
        onChange={(e) => handleContentChange(e.target.value)}
        className="flex-1 w-full bg-transparent text-text-secondary text-sm font-mono p-6 resize-none focus:outline-none leading-relaxed"
        placeholder="Contenu du skill..."
        spellCheck={false}
      />
    </>
  );
}
