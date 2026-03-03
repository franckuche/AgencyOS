'use client';

import { useState, useEffect } from 'react';
import { skillsApi } from '@/lib/api';
import type { AgentConfig, SkillInfo } from '@/lib/types';

interface SkillEnrichModalProps {
  agent: AgentConfig;
  content: string;
  onClose: () => void;
}

export default function SkillEnrichModal({ agent, content, onClose }: SkillEnrichModalProps) {
  const [skills, setSkills] = useState<SkillInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [isNewSkill, setIsNewSkill] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState(content);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    skillsApi.list(agent.id).then((list) => {
      setSkills(list);
      if (list.length > 0) setSelectedSlug(list[0].slug);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, [agent.id]);

  const handleSubmit = async () => {
    if (!title.trim() || !body.trim()) {
      setError('Titre et contenu requis');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      if (isNewSkill) {
        if (!newSkillName.trim()) {
          setError('Nom du skill requis');
          setSubmitting(false);
          return;
        }
        const date = new Date().toISOString().split('T')[0];
        const initialContent = `# ${newSkillName.trim()}\n\n## ${title.trim()} — ${date}\n\n${body.trim()}\n`;
        await skillsApi.create(agent.id, newSkillName.trim(), initialContent);
      } else {
        if (!selectedSlug) {
          setError('Selectionne un skill');
          setSubmitting(false);
          return;
        }
        await skillsApi.append(agent.id, selectedSlug, title.trim(), body.trim());
      }

      setSuccess(true);
      setTimeout(() => onClose(), 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-bg-primary border border-border rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
              style={{ backgroundColor: `${agent.color}20` }}
            >
              {agent.emoji}
            </div>
            <h2 className="text-base font-semibold text-text-primary">Enrichir un skill</h2>
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-text-secondary transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {/* Section title */}
          <div>
            <label className="text-xs font-medium text-text-secondary block mb-1.5">Titre de section</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Strategie maillage e-commerce"
              className="w-full bg-bg-hover border border-border rounded-lg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-active"
              autoFocus
            />
          </div>

          {/* Skill selection */}
          <div>
            <label className="text-xs font-medium text-text-secondary block mb-1.5">Skill cible</label>
            {loading ? (
              <div className="text-xs text-text-muted py-3">Chargement...</div>
            ) : (
              <div className="space-y-1.5 max-h-40 overflow-y-auto border border-border rounded-lg p-2">
                {skills.map((skill) => (
                  <button
                    key={skill.slug}
                    onClick={() => { setSelectedSlug(skill.slug); setIsNewSkill(false); }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                      !isNewSkill && selectedSlug === skill.slug
                        ? 'text-text-primary'
                        : 'text-text-secondary hover:bg-bg-hover'
                    }`}
                    style={
                      !isNewSkill && selectedSlug === skill.slug
                        ? { backgroundColor: `${agent.color}15`, color: agent.color }
                        : {}
                    }
                  >
                    <span className={`w-3 h-3 rounded-full border-2 flex-shrink-0 ${
                      !isNewSkill && selectedSlug === skill.slug ? '' : 'border-border'
                    }`}
                      style={
                        !isNewSkill && selectedSlug === skill.slug
                          ? { borderColor: agent.color, backgroundColor: agent.color }
                          : {}
                      }
                    />
                    <span className="truncate">{skill.name}</span>
                    <span className="text-[10px] text-text-muted ml-auto flex-shrink-0">{skill.slug}.md</span>
                  </button>
                ))}

                {/* New skill option */}
                <button
                  onClick={() => setIsNewSkill(true)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                    isNewSkill ? 'text-text-primary' : 'text-text-secondary hover:bg-bg-hover'
                  }`}
                  style={isNewSkill ? { backgroundColor: `${agent.color}15`, color: agent.color } : {}}
                >
                  <span className={`w-3 h-3 rounded-full border-2 flex-shrink-0 ${isNewSkill ? '' : 'border-border'}`}
                    style={isNewSkill ? { borderColor: agent.color, backgroundColor: agent.color } : {}}
                  />
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  <span>Nouveau skill</span>
                </button>
              </div>
            )}

            {isNewSkill && (
              <input
                type="text"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                placeholder="Nom du nouveau skill"
                className="w-full mt-2 bg-bg-hover border border-border rounded-lg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-active"
              />
            )}
          </div>

          {/* Content */}
          <div>
            <label className="text-xs font-medium text-text-secondary block mb-1.5">Contenu</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full bg-bg-hover border border-border rounded-lg px-3 py-2.5 text-sm text-text-secondary font-mono focus:outline-none focus:border-border-active resize-none leading-relaxed"
              rows={8}
              spellCheck={false}
            />
          </div>

          {error && (
            <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-2">
          {success ? (
            <span className="text-sm font-medium text-green-400 flex items-center gap-1.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Enrichi !
            </span>
          ) : (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-sm text-text-muted hover:text-text-secondary transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting || !title.trim() || !body.trim()}
                className="px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-30 transition-colors"
                style={{ backgroundColor: `${agent.color}20`, color: agent.color }}
              >
                {submitting ? 'Enrichissement...' : 'Enrichir'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
