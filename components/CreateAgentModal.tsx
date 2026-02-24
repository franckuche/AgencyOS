'use client';

import { useState } from 'react';
import { agentsApi } from '@/lib/api';

interface CreateAgentModalProps {
  onClose: () => void;
  onCreated: () => void;
}

const EMOJI_PICKS = ['🤖', '🎯', '🔍', '💪', '👨‍🍳', '🎩', '📊', '✍️', '🧠', '⚡', '🎨', '📈', '🛠️', '🌐', '💡', '🔬'];
const COLOR_PICKS = ['#00D4AA', '#FF8C42', '#4ECB71', '#5B8DEF', '#E040FB', '#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#FF6B9D'];

const STEP_LABELS = ['Identite', 'Personnalite', 'Apercu'];

const DEFAULT_PERSONALITY = (name: string, role: string) =>
  `# ${name}\n\nTu es ${name}, ${role || 'un assistant specialise'}.\n\n## Personnalite\n\n- Direct et professionnel\n- Reponds en francais\n- Sois concis et actionnable\n\n## Regles\n\n- Toujours justifier tes recommandations\n- Donner des exemples concrets\n`;

export default function CreateAgentModal({ onClose, onCreated }: CreateAgentModalProps) {
  const [mode, setMode] = useState<'wizard' | 'advanced'>('wizard');
  const [step, setStep] = useState(1);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [emoji, setEmoji] = useState('🤖');
  const [color, setColor] = useState('#5B8DEF');
  const [bio, setBio] = useState('');
  const [personality, setPersonality] = useState('');
  const [skillsJson, setSkillsJson] = useState('[]');

  const handleCreate = async () => {
    if (!name.trim()) {
      setError('Le nom est requis');
      return;
    }
    setCreating(true);
    setError('');

    let skills: { name: string; value: number }[] = [];
    try {
      skills = JSON.parse(skillsJson || '[]');
    } catch {
      skills = [];
    }

    try {
      await agentsApi.create({
        name: name.trim(),
        role: role.trim(),
        emoji,
        color,
        bio: bio.trim(),
        skills,
        personality: personality.trim() || DEFAULT_PERSONALITY(name.trim(), role.trim()),
      });
      onCreated();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erreur reseau';
      setError(msg);
      setCreating(false);
    }
  };

  const canProceed = () => {
    if (step === 1) return name.trim().length > 0;
    return true;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-bg-primary border border-border rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            {/* Live preview */}
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
              style={{ backgroundColor: `${color}20` }}
            >
              {emoji}
            </div>
            <h2 className="text-base font-semibold text-text-primary">Nouvel agent</h2>
            <div className="flex gap-1 bg-bg-hover rounded-lg p-0.5">
              <button
                onClick={() => setMode('wizard')}
                className={`px-2 py-1 rounded text-xs transition-colors ${
                  mode === 'wizard' ? 'bg-bg-primary text-text-primary shadow-sm' : 'text-text-muted'
                }`}
              >
                Wizard
              </button>
              <button
                onClick={() => setMode('advanced')}
                className={`px-2 py-1 rounded text-xs transition-colors ${
                  mode === 'advanced' ? 'bg-bg-primary text-text-primary shadow-sm' : 'text-text-muted'
                }`}
              >
                Avance
              </button>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-secondary transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {mode === 'wizard' ? (
            <>
              {step === 1 && (
                <div className="space-y-5 animate-slide-in-right">
                  <div>
                    <label className="text-xs font-medium text-text-secondary block mb-1.5">Nom de l&apos;agent</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: DataBot"
                      className="w-full bg-bg-hover border border-border rounded-lg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-active"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-text-secondary block mb-1.5">Role</label>
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="Ex: Analyste de donnees"
                      className="w-full bg-bg-hover border border-border rounded-lg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-active"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-text-secondary block mb-1.5">Emoji</label>
                    <div className="grid grid-cols-8 gap-2">
                      {EMOJI_PICKS.map((e) => (
                        <button
                          key={e}
                          onClick={() => setEmoji(e)}
                          className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all ${
                            emoji === e
                              ? 'scale-110 ring-2'
                              : 'bg-bg-hover/50 hover:bg-bg-hover hover:scale-105'
                          }`}
                          style={emoji === e ? { backgroundColor: `${color}20`, outlineColor: color, outlineStyle: 'solid', outlineWidth: '2px', outlineOffset: '-2px' } : {}}
                        >
                          {e}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-text-secondary block mb-1.5">Couleur</label>
                    <div className="flex flex-wrap gap-2">
                      {COLOR_PICKS.map((c) => (
                        <button
                          key={c}
                          onClick={() => setColor(c)}
                          className={`w-9 h-9 rounded-full transition-all ${
                            color === c ? 'ring-2 ring-white scale-110 shadow-lg' : 'hover:scale-105'
                          }`}
                          style={{
                            backgroundColor: c,
                            boxShadow: color === c ? `inset 0 2px 4px rgba(0,0,0,0.3)` : undefined,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-text-secondary block mb-1.5">Bio (optionnel)</label>
                    <input
                      type="text"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Description courte de l'agent..."
                      className="w-full bg-bg-hover border border-border rounded-lg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-active"
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4 animate-slide-in-right">
                  <div>
                    <label className="text-xs font-medium text-text-secondary block mb-1.5">
                      Personnalite (CLAUDE.md)
                    </label>
                    <p className="text-[11px] text-text-muted mb-2">
                      Ce texte sera le CLAUDE.md de ton agent. Il definit sa personnalite et ses regles.
                    </p>
                    <textarea
                      value={personality || DEFAULT_PERSONALITY(name, role)}
                      onChange={(e) => setPersonality(e.target.value)}
                      className="w-full bg-bg-hover border border-border rounded-lg px-3 py-2.5 text-sm text-text-secondary font-mono focus:outline-none focus:border-border-active resize-none leading-relaxed"
                      rows={12}
                      spellCheck={false}
                    />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-5 animate-slide-in-right">
                  <h3 className="text-sm font-medium text-text-primary">Apercu</h3>
                  <div className="border border-border rounded-xl overflow-hidden bg-bg-hover/30">
                    {/* Gradient banner */}
                    <div
                      className="h-16 w-full"
                      style={{
                        background: `linear-gradient(180deg, ${color}30 0%, transparent 100%)`,
                      }}
                    />
                    {/* Avatar chevauchant */}
                    <div className="flex flex-col items-center -mt-6 pb-5 px-5">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl border-2 border-bg-primary"
                        style={{ backgroundColor: `${color}20` }}
                      >
                        {emoji}
                      </div>
                      <div className="text-base font-semibold text-text-primary mt-2">{name || 'Agent'}</div>
                      <div className="text-xs text-text-muted">{role || 'Role non defini'}</div>
                      {bio && (
                        <p className="text-xs text-text-secondary mt-2 text-center">{bio}</p>
                      )}
                      <div className="flex items-center gap-2 mt-3">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                        <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color }}>
                          Dispo
                        </span>
                      </div>
                      <div className="mt-4 text-xs text-text-muted text-center">
                        Les skills seront configures apres la creation
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Advanced mode */
            <div className="space-y-4 animate-scale-in">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-text-secondary block mb-1">Nom</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nom de l'agent"
                    className="w-full bg-bg-hover border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-active"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-text-secondary block mb-1">Role</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="Role"
                    className="w-full bg-bg-hover border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-active"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-text-secondary block mb-1">Emoji</label>
                  <input
                    type="text"
                    value={emoji}
                    onChange={(e) => setEmoji(e.target.value)}
                    className="w-full bg-bg-hover border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-border-active"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-text-secondary block mb-1">Couleur</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-8 h-8 rounded border-0 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="flex-1 bg-bg-hover border border-border rounded-lg px-3 py-2 text-sm text-text-primary font-mono focus:outline-none focus:border-border-active"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-text-secondary block mb-1">Bio</label>
                <input
                  type="text"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Description courte"
                  className="w-full bg-bg-hover border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-active"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-text-secondary block mb-1">CLAUDE.md</label>
                <textarea
                  value={personality || DEFAULT_PERSONALITY(name, role)}
                  onChange={(e) => setPersonality(e.target.value)}
                  className="w-full bg-bg-hover border border-border rounded-lg px-3 py-2 text-sm text-text-secondary font-mono focus:outline-none focus:border-border-active resize-none leading-relaxed"
                  rows={8}
                  spellCheck={false}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-text-secondary block mb-1">
                  Skills (JSON)
                </label>
                <textarea
                  value={skillsJson}
                  onChange={(e) => setSkillsJson(e.target.value)}
                  placeholder='[{"name": "Analyse", "value": 85}]'
                  className="w-full bg-bg-hover border border-border rounded-lg px-3 py-2 text-sm text-text-secondary font-mono focus:outline-none focus:border-border-active resize-none"
                  rows={3}
                  spellCheck={false}
                />
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-between">
          {mode === 'wizard' ? (
            <>
              {/* Step indicator with names */}
              <div className="flex items-center gap-1">
                {STEP_LABELS.map((label, i) => {
                  const stepNum = i + 1;
                  const isActive = step === stepNum;
                  const isPast = step > stepNum;
                  return (
                    <div key={label} className="flex items-center">
                      {i > 0 && (
                        <div className={`w-6 h-px mx-1 ${isPast ? 'bg-accent-cyan/40' : 'bg-border'}`} />
                      )}
                      <button
                        onClick={() => isPast && setStep(stepNum)}
                        className={`flex items-center gap-1.5 text-xs transition-colors ${
                          isPast ? 'cursor-pointer' : 'cursor-default'
                        }`}
                      >
                        {isPast ? (
                          <svg className="text-green-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        ) : (
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold ${
                              isActive ? 'text-white' : 'bg-bg-hover text-text-muted'
                            }`}
                            style={isActive ? { backgroundColor: color } : {}}
                          >
                            {stepNum}
                          </span>
                        )}
                        <span
                          className={`font-medium ${
                            isActive ? '' : isPast ? 'text-text-secondary' : 'text-text-muted'
                          }`}
                          style={isActive ? { color } : {}}
                        >
                          {label}
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center gap-2">
                {step > 1 && (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="px-4 py-2 rounded-lg text-sm text-text-muted hover:text-text-secondary transition-colors"
                  >
                    Retour
                  </button>
                )}
                {step < 3 ? (
                  <button
                    onClick={() => setStep(step + 1)}
                    disabled={!canProceed()}
                    className="px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-30 transition-colors"
                    style={{
                      backgroundColor: `${color}20`,
                      color: color,
                    }}
                  >
                    Suivant
                  </button>
                ) : (
                  <button
                    onClick={handleCreate}
                    disabled={creating}
                    className="px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 transition-colors"
                    style={{
                      backgroundColor: `${color}20`,
                      color: color,
                    }}
                  >
                    {creating ? 'Creation...' : 'Creer l\'agent'}
                  </button>
                )}
              </div>
            </>
          ) : (
            <>
              <div />
              <button
                onClick={handleCreate}
                disabled={creating || !name.trim()}
                className="px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-30 transition-colors"
                style={{
                  backgroundColor: `${color}20`,
                  color: color,
                }}
              >
                {creating ? 'Creation...' : 'Creer l\'agent'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
