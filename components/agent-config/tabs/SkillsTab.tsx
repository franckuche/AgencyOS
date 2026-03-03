'use client';

import { useState, useEffect, useCallback } from 'react';
import { skillsApi } from '@/lib/api';
import SkillListItem from '../SkillListItem';
import SkillEditor from '../SkillEditor';
import SkillSplitOverlay from '../SkillSplitOverlay';
import type { AgentConfig, SkillInfo, SkillDetail } from '@/lib/types';

interface SkillsTabProps {
  agent: AgentConfig;
}

export default function SkillsTab({ agent }: SkillsTabProps) {
  const [skills, setSkills] = useState<SkillInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [skillContent, setSkillContent] = useState('');
  const [skillDetail, setSkillDetail] = useState<SkillDetail | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Split state
  const [showSplit, setShowSplit] = useState(false);
  const [splitSections, setSplitSections] = useState<{ heading: string; content: string; selected: boolean }[]>([]);

  const fetchSkills = useCallback(async () => {
    setLoading(true);
    try {
      const data = await skillsApi.list(agent.id);
      setSkills(data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [agent.id]);

  const fetchSkillDetail = useCallback(async (slug: string) => {
    try {
      const data = await skillsApi.get(agent.id, slug);
      setSkillDetail(data);
      setSkillContent(data.content);
    } catch {
      // silently fail
    }
  }, [agent.id]);

  useEffect(() => {
    fetchSkills();
    setSelectedSkill(null);
    setSkillDetail(null);
    setShowCreateForm(false);
    setShowSplit(false);
    setSearchQuery('');
  }, [agent.id, fetchSkills]);

  const handleSelectSkill = (slug: string) => {
    setSelectedSkill(slug);
    fetchSkillDetail(slug);
    setShowSplit(false);
  };

  const createSkill = async () => {
    if (!newSkillName.trim()) return;
    try {
      const data = await skillsApi.create(agent.id, newSkillName.trim());
      setNewSkillName('');
      setShowCreateForm(false);
      await fetchSkills();
      setSelectedSkill(data.slug);
      fetchSkillDetail(data.slug);
    } catch {
      // silently fail
    }
  };

  const deleteSkill = async (slug: string) => {
    try {
      await skillsApi.delete(agent.id, slug);
      if (selectedSkill === slug) {
        setSelectedSkill(null);
        setSkillDetail(null);
      }
      fetchSkills();
    } catch {
      // silently fail
    }
  };

  const prepareSplit = () => {
    if (!skillContent) return;
    const lines = skillContent.split('\n');
    const sections: { heading: string; content: string; selected: boolean }[] = [];
    let currentHeading = '';
    let currentContent: string[] = [];

    for (const line of lines) {
      if (line.match(/^## /)) {
        if (currentHeading) {
          sections.push({ heading: currentHeading, content: currentContent.join('\n').trim(), selected: false });
        }
        currentHeading = line.replace(/^## /, '');
        currentContent = [];
      } else {
        currentContent.push(line);
      }
    }
    if (currentHeading) {
      sections.push({ heading: currentHeading, content: currentContent.join('\n').trim(), selected: false });
    }

    if (sections.length > 0) {
      setSplitSections(sections);
      setShowSplit(true);
    }
  };

  const executeSplit = async () => {
    const selected = splitSections.filter((s) => s.selected);
    if (selected.length === 0 || !selectedSkill) return;

    try {
      await skillsApi.split(agent.id, selectedSkill, selected.map((s) => ({
        heading: s.heading,
        content: `# ${s.heading}\n\n${s.content}`,
        newSlug: s.heading
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '_')
          .replace(/(^_|_$)/g, ''),
      })));
      setShowSplit(false);
      setSplitSections([]);
      await fetchSkills();
    } catch {
      // silently fail
    }
  };

  // Group skills by category
  const groupedSkills = skills.reduce<Record<string, SkillInfo[]>>((acc, skill) => {
    const cat = skill.category || '';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  const categoryOrder = Object.keys(groupedSkills).sort((a, b) => {
    if (!a) return 1;
    if (!b) return -1;
    return a.localeCompare(b);
  });

  // Filter skills by search
  const filteredCategoryOrder = categoryOrder.filter((cat) =>
    groupedSkills[cat].some((s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.preview || '').toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const filterSkillsInCategory = (catSkills: SkillInfo[]) =>
    searchQuery
      ? catSkills.filter((s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (s.preview || '').toLowerCase().includes(searchQuery.toLowerCase())
        )
      : catSkills;

  return (
    <>
      {/* Left panel: skill list */}
      <div className="w-72 border-r border-border bg-bg-primary flex flex-col flex-shrink-0">
        {/* Search bar */}
        <div className="p-3 space-y-2">
          <div className="relative">
            <svg
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted"
              width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher..."
              className="w-full bg-bg-hover border-none rounded-lg pl-8 pr-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-border-active"
            />
          </div>

          {/* Create button */}
          {showCreateForm ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && createSkill()}
                placeholder="Nom du skill..."
                className="flex-1 bg-bg-hover border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-active"
                autoFocus
              />
              <button
                onClick={createSkill}
                disabled={!newSkillName.trim()}
                className="px-3 py-2 rounded-lg text-sm font-medium disabled:opacity-30 transition-colors"
                style={{ backgroundColor: `${agent.color}15`, color: agent.color }}
              >
                OK
              </button>
              <button
                onClick={() => { setShowCreateForm(false); setNewSkillName(''); }}
                className="px-2 py-2 rounded-lg text-sm text-text-muted hover:text-text-secondary transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowCreateForm(true)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-dashed text-sm transition-colors"
              style={{ borderColor: `${agent.color}30`, color: agent.color }}
            >
              <span className="text-lg leading-none">+</span> Nouveau skill
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            /* Skeleton loaders */
            <div className="px-3 space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-lg p-3 bg-bg-hover/30 animate-pulse">
                  <div className="h-3.5 w-2/3 rounded bg-bg-hover mb-2" style={{ backgroundImage: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.04), transparent)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
                  <div className="h-2.5 w-full rounded bg-bg-hover/60" style={{ backgroundImage: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.04), transparent)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite', animationDelay: `${i * 0.2}s` }} />
                </div>
              ))}
            </div>
          ) : skills.length === 0 ? (
            <div className="px-4 py-8 text-center text-text-muted text-sm">
              Aucun skill pour {agent.name}
            </div>
          ) : (
            <div className="px-2 pb-3">
              {filteredCategoryOrder.map((cat) => (
                <div key={cat || '__none'}>
                  {cat && (
                    <div className="px-3 pt-3 pb-1">
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-text-muted">
                        {cat}
                      </span>
                    </div>
                  )}
                  {filterSkillsInCategory(groupedSkills[cat]).map((skill) => (
                    <SkillListItem
                      key={skill.slug}
                      skill={skill}
                      isSelected={selectedSkill === skill.slug}
                      agentColor={agent.color}
                      onSelect={handleSelectSkill}
                      onDelete={deleteSkill}
                    />
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right panel: editor */}
      <div className="flex-1 flex flex-col bg-[#F9FAFB] animate-slide-in-right">
        {selectedSkill && skillDetail ? (
          showSplit && splitSections.length > 0 ? (
            <SkillSplitOverlay
              sections={splitSections}
              onToggle={(i) => {
                const updated = [...splitSections];
                updated[i] = { ...updated[i], selected: !updated[i].selected };
                setSplitSections(updated);
              }}
              onExecute={executeSplit}
              onCancel={() => { setShowSplit(false); setSplitSections([]); }}
            />
          ) : (
            <SkillEditor
              agent={agent}
              selectedSkill={selectedSkill}
              skillDetail={skillDetail}
              skillContent={skillContent}
              onContentChange={setSkillContent}
              onSaved={fetchSkills}
              onPrepareSplit={prepareSplit}
              skills={skills}
            />
          )
        ) : (
          <div className="flex-1 flex items-center justify-center text-text-muted">
            <div className="text-center">
              <svg className="mx-auto mb-4 opacity-20" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <div className="text-sm">Selectionne un skill</div>
              <div className="text-xs mt-1 text-text-muted">ou cree-en un nouveau</div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
