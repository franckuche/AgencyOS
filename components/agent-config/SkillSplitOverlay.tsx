'use client';

interface SplitSection {
  heading: string;
  content: string;
  selected: boolean;
}

interface SkillSplitOverlayProps {
  sections: SplitSection[];
  onToggle: (index: number) => void;
  onExecute: () => void;
  onCancel: () => void;
}

export default function SkillSplitOverlay({ sections, onToggle, onExecute, onCancel }: SkillSplitOverlayProps) {
  const selectedCount = sections.filter((s) => s.selected).length;

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <h3 className="text-sm font-medium text-text-primary mb-4">Subdiviser le skill</h3>
      <p className="text-xs text-text-muted mb-4">
        Sélectionne les sections à extraire en fichiers séparés :
      </p>
      <div className="space-y-2 mb-6">
        {sections.map((section, i) => (
          <label key={i} className="flex items-start gap-3 p-3 rounded-lg bg-bg-hover/50 hover:bg-bg-hover cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={section.selected}
              onChange={() => onToggle(i)}
              className="mt-0.5 accent-accent-cyan"
            />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-text-primary">{section.heading}</div>
              <div className="text-xs text-text-muted mt-0.5 line-clamp-2">
                {section.content.slice(0, 150)}...
              </div>
            </div>
          </label>
        ))}
      </div>
      <div className="flex gap-2">
        <button
          onClick={onExecute}
          disabled={selectedCount === 0}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-accent-cyan/20 text-accent-cyan hover:bg-accent-cyan/30 disabled:opacity-30 transition-colors"
        >
          Extraire ({selectedCount} section{selectedCount > 1 ? 's' : ''})
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-lg text-sm text-text-muted hover:text-text-secondary transition-colors"
        >
          Annuler
        </button>
      </div>
    </div>
  );
}
