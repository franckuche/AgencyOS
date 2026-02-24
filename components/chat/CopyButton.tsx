'use client';

import { useState } from 'react';

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="absolute top-2 right-2 px-2 py-1 rounded-md bg-bg-hover/80 hover:bg-bg-hover text-text-muted hover:text-text-secondary text-xs font-mono transition-all opacity-0 group-hover:opacity-100"
    >
      {copied ? '✓ Copié' : 'Copier'}
    </button>
  );
}
