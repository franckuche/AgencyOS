'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface AgentConfig {
  id: string;
  name: string;
  role: string;
  avatar: string;
  color: string;
}

interface SkillInfo {
  name: string;
  slug: string;
  size: number;
  modified: string;
  preview: string;
}

interface SkillDetail {
  slug: string;
  content: string;
  isSymlink: boolean;
}

interface SkillsPageProps {
  agents: AgentConfig[];
}

export default function SkillsPage({ agents }: SkillsPageProps) {
  const [selectedAgent, setSelectedAgent] = useState<string>(agents[0]?.id || '');
  const [skills, setSkills] = useState<SkillInfo[]>([]);
  const [activeTab, setActiveTab] = useState<'skills' | 'personality'>('skills');
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [skillContent, setSkillContent] = useState('');
  const [skillDetail, setSkillDetail] = useState<SkillDetail | null>(null);
  const [personalityContent, setPersonalityContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const agent = agents.find((a) => a.id === selectedAgent);

  // Cmd+S to save
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        if (activeTab === 'personality') {
          savePersonality();
        } else if (selectedSkill) {
          saveSkill();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, selectedSkill, skillContent, personalityContent, selectedAgent, saving]);

  // Fetch skills list
  const fetchSkills = useCallback(async () => {
    if (!selectedAgent) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/agents/${selectedAgent}/skills`);
      if (res.ok) {
        const data = await res.json();
        setSkills(data);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [selectedAgent]);

  // Fetch personality
  const fetchPersonality = useCallback(async () => {
    if (!selectedAgent) return;
    try {
      const res = await fetch(`/api/agents/${selectedAgent}/personality`);
      if (res.ok) {
        const data = await res.json();
        setPersonalityContent(data.content || '');
      }
    } catch {
      // silently fail
    }
  }, [selectedAgent]);

  // Fetch skill detail
  const fetchSkillDetail = useCallback(async (slug: string) => {
    if (!selectedAgent) return;
    try {
      const res = await fetch(`/api/agents/${selectedAgent}/skills/${slug}`);
      if (res.ok) {
        const data: SkillDetail = await res.json();
        setSkillDetail(data);
        setSkillContent(data.content);
      }
    } catch {
      // silently fail
    }
  }, [selectedAgent]);

  useEffect(() => {
    fetchSkills();
    fetchPersonality();
    setSelectedSkill(null);
    setSkillDetail(null);
    setShowCreateForm(false);
  }, [selectedAgent, fetchSkills, fetchPersonality]);

  // Save skill content
  const saveSkill = async () => {
    if (!selectedSkill || !selectedAgent) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/agents/${selectedAgent}/skills/${selectedSkill}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: skillContent }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        fetchSkills();
      }
    } catch {
      // silently fail
    } finally {
      setSaving(false);
    }
  };

  // Save personality
  const savePersonality = async () => {
    if (!selectedAgent) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/agents/${selectedAgent}/personality`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: personalityContent }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch {
      // silently fail
    } finally {
      setSaving(false);
    }
  };

  // Create new skill
  const createSkill = async () => {
    if (!newSkillName.trim() || !selectedAgent) return;
    try {
      const res = await fetch(`/api/agents/${selectedAgent}/skills`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newSkillName.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        setNewSkillName('');
        setShowCreateForm(false);
        await fetchSkills();
        setSelectedSkill(data.slug);
        fetchSkillDetail(data.slug);
      }
    } catch {
      // silently fail
    }
  };

  // Delete skill
  const deleteSkill = async (slug: string) => {
    if (!selectedAgent) return;
    try {
      const res = await fetch(`/api/agents/${selectedAgent}/skills/${slug}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        if (selectedSkill === slug) {
          setSelectedSkill(null);
          setSkillDetail(null);
        }
        setDeleteConfirm(null);
        fetchSkills();
      }
    } catch {
      // silently fail
    }
  };

  const handleSelectSkill = (slug: string) => {
    setSelectedSkill(slug);
    fetchSkillDetail(slug);
    setActiveTab('skills');
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-bg-primary px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-text-primary">Skills & Personnalité</h1>
            <div className="flex gap-1 bg-bg-hover rounded-lg p-0.5">
              {agents.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setSelectedAgent(a.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-all ${
                    selectedAgent === a.id
                      ? 'bg-bg-primary text-text-primary shadow-sm'
                      : 'text-text-muted hover:text-text-secondary'
                  }`}
                >
                  <Image src={a.avatar} alt={a.name} width={20} height={20} className="rounded" />
                  {a.name}
                </button>
              ))}
            </div>
          </div>
          {agent && (
            <div className="text-xs text-text-muted">
              {skills.length} skill{skills.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Skills list */}
        <div className="w-80 border-r border-border bg-bg-primary flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-border">
            <button
              onClick={() => setActiveTab('skills')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'skills'
                  ? 'text-text-primary border-b-2'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
              style={activeTab === 'skills' ? { borderColor: agent?.color } : {}}
            >
              Skills
            </button>
            <button
              onClick={() => setActiveTab('personality')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'personality'
                  ? 'text-text-primary border-b-2'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
              style={activeTab === 'personality' ? { borderColor: agent?.color } : {}}
            >
              Personnalité
            </button>
          </div>

          {activeTab === 'skills' ? (
            <div className="flex-1 overflow-y-auto">
              {/* Create button */}
              <div className="p-3">
                {showCreateForm ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSkillName}
                      onChange={(e) => setNewSkillName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && createSkill()}
                      placeholder="Nom du skill..."
                      className="flex-1 bg-bg-hover border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-cyan"
                      autoFocus
                    />
                    <button
                      onClick={createSkill}
                      disabled={!newSkillName.trim()}
                      className="px-3 py-2 rounded-lg text-sm font-medium bg-accent-cyan/20 text-accent-cyan hover:bg-accent-cyan/30 disabled:opacity-30 transition-colors"
                    >
                      OK
                    </button>
                    <button
                      onClick={() => { setShowCreateForm(false); setNewSkillName(''); }}
                      className="px-3 py-2 rounded-lg text-sm text-text-muted hover:text-text-secondary transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-dashed border-border text-sm text-text-muted hover:text-text-secondary hover:border-text-muted transition-colors"
                  >
                    <span className="text-lg leading-none">+</span> Nouveau skill
                  </button>
                )}
              </div>

              {/* Skills list */}
              {loading ? (
                <div className="px-4 py-8 text-center text-text-muted text-sm">Chargement...</div>
              ) : skills.length === 0 ? (
                <div className="px-4 py-8 text-center text-text-muted text-sm">
                  Aucun skill pour {agent?.name}
                </div>
              ) : (
                <div className="px-2 pb-3">
                  {skills.map((skill) => (
                    <div
                      key={skill.slug}
                      className="relative group"
                    >
                      <button
                        onClick={() => handleSelectSkill(skill.slug)}
                        className={`w-full text-left px-3 py-3 rounded-lg mb-0.5 transition-all ${
                          selectedSkill === skill.slug
                            ? 'bg-bg-hover'
                            : 'hover:bg-bg-hover/50'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className={`text-sm font-medium truncate ${
                              selectedSkill === skill.slug ? 'text-text-primary' : 'text-text-secondary'
                            }`}>
                              {skill.name}
                            </div>
                            <div className="text-xs text-text-muted mt-0.5 truncate">
                              {skill.preview || 'Pas de contenu'}
                            </div>
                          </div>
                          <div className="text-[10px] text-text-muted whitespace-nowrap mt-0.5">
                            {formatSize(skill.size)}
                          </div>
                        </div>
                        <div className="text-[10px] text-text-muted mt-1">
                          {formatDate(skill.modified)}
                        </div>
                      </button>

                      {/* Delete button */}
                      {deleteConfirm === skill.slug ? (
                        <div className="absolute right-2 top-2 flex gap-1 bg-bg-primary border border-border rounded-lg p-1 shadow-lg z-10">
                          <button
                            onClick={() => deleteSkill(skill.slug)}
                            className="px-2 py-1 rounded text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                          >
                            Supprimer
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="px-2 py-1 rounded text-xs text-text-muted hover:text-text-secondary transition-colors"
                          >
                            Non
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => { e.stopPropagation(); setDeleteConfirm(skill.slug); }}
                          className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center rounded text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-all text-xs"
                          title="Supprimer"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Personality tab - just a label */
            <div className="flex-1 flex items-center justify-center text-text-muted text-sm px-4 text-center">
              <div>
                <div className="text-3xl mb-3">
                  {agent && <Image src={agent.avatar} alt={agent.name} width={64} height={64} className="rounded-xl mx-auto" />}
                </div>
                <div className="font-medium text-text-secondary">{agent?.name}</div>
                <div className="text-xs mt-1">{agent?.role}</div>
                <div className="text-xs mt-3">
                  CLAUDE.md — le fichier qui définit la personnalité et les instructions de {agent?.name}.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Editor */}
        <div className="flex-1 flex flex-col bg-[#0D1117]">
          {activeTab === 'personality' ? (
            <>
              {/* Personality editor header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-bg-primary">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-text-primary">CLAUDE.md</span>
                  <span className="text-xs text-text-muted">Personnalité de {agent?.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  {saved && (
                    <span className="text-xs text-green-400 animate-slide-up">Sauvegardé</span>
                  )}
                  <button
                    onClick={savePersonality}
                    disabled={saving}
                    className="px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
                    style={{
                      backgroundColor: agent ? `${agent.color}20` : undefined,
                      color: agent?.color,
                    }}
                  >
                    {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                  </button>
                </div>
              </div>
              <textarea
                value={personalityContent}
                onChange={(e) => setPersonalityContent(e.target.value)}
                className="flex-1 w-full bg-transparent text-text-secondary text-sm font-mono p-6 resize-none focus:outline-none leading-relaxed"
                placeholder="Contenu du CLAUDE.md..."
                spellCheck={false}
              />
            </>
          ) : selectedSkill && skillDetail ? (
            <>
              {/* Skill editor header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-bg-primary">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-text-primary">
                    {skills.find((s) => s.slug === selectedSkill)?.name || selectedSkill}
                  </span>
                  <span className="text-xs text-text-muted">{selectedSkill}.md</span>
                  {skillDetail.isSymlink && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      symlink
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {saved && (
                    <span className="text-xs text-green-400 animate-slide-up">Sauvegardé</span>
                  )}
                  <button
                    onClick={saveSkill}
                    disabled={saving}
                    className="px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
                    style={{
                      backgroundColor: agent ? `${agent.color}20` : undefined,
                      color: agent?.color,
                    }}
                  >
                    {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                  </button>
                </div>
              </div>
              <textarea
                value={skillContent}
                onChange={(e) => setSkillContent(e.target.value)}
                className="flex-1 w-full bg-transparent text-text-secondary text-sm font-mono p-6 resize-none focus:outline-none leading-relaxed"
                placeholder="Contenu du skill..."
                spellCheck={false}
              />
            </>
          ) : (
            /* Empty state */
            <div className="flex-1 flex items-center justify-center text-text-muted">
              <div className="text-center">
                <div className="text-4xl mb-4 opacity-30">
                  {agent && <Image src={agent.avatar} alt={agent.name} width={80} height={80} className="rounded-2xl mx-auto opacity-30" />}
                </div>
                <div className="text-sm">
                  Sélectionne un skill à éditer
                </div>
                <div className="text-xs mt-1">
                  ou crée-en un nouveau
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
