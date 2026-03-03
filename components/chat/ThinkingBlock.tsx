'use client';

import { useState } from 'react';
import type { ToolCall } from '@/lib/types';

function getToolIcon(name: string) {
  switch (name) {
    case 'Read':
      return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      );
    case 'Glob':
    case 'Grep':
      return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      );
    case 'Bash':
      return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="4 17 10 11 4 5" />
          <line x1="12" y1="19" x2="20" y2="19" />
        </svg>
      );
    case 'Edit':
    case 'Write':
      return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 20h9" />
          <path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.855z" />
        </svg>
      );
    default:
      return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      );
  }
}

function getToolLabel(tc: ToolCall): string {
  const input = tc.input;
  switch (tc.name) {
    case 'Read':
      return String(input.file_path || '').split('/').pop() || tc.name;
    case 'Glob':
      return String(input.pattern || '') || tc.name;
    case 'Grep':
      return String(input.pattern || '') || tc.name;
    case 'Bash':
      return String(input.command || '').slice(0, 60) || tc.name;
    case 'Edit':
    case 'Write':
      return String(input.file_path || '').split('/').pop() || tc.name;
    default:
      return tc.name;
  }
}

interface ThinkingBlockProps {
  thinking?: string;
  toolCalls?: ToolCall[];
  defaultOpen?: boolean;
  isStreaming?: boolean;
}

export default function ThinkingBlock({ thinking, toolCalls, defaultOpen = false, isStreaming = false }: ThinkingBlockProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  if (!thinking && (!toolCalls || toolCalls.length === 0)) return null;

  const toolCount = toolCalls?.length || 0;
  const completedCount = toolCalls?.filter(tc => tc.result !== undefined).length || 0;
  const hasRunningTool = isStreaming && toolCount > 0 && completedCount < toolCount;

  return (
    <div className="mb-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-secondary transition-colors group/think"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`transition-transform ${isOpen ? 'rotate-90' : ''}`}
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
        <span className="font-medium">Réflexion</span>
        {thinking && (
          <span className="text-[10px] bg-bg-hover px-1.5 py-0.5 rounded text-text-muted">
            thinking
          </span>
        )}
        {toolCount > 0 && (
          <span className={`text-[10px] px-1.5 py-0.5 rounded ${
            hasRunningTool
              ? 'bg-amber-500/10 text-amber-400'
              : 'bg-bg-hover text-text-muted'
          }`}>
            {hasRunningTool ? (
              <span className="flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-[pulse-dot_1.5s_ease-in-out_infinite]" />
                {completedCount}/{toolCount} outils
              </span>
            ) : (
              <>{toolCount} outil{toolCount > 1 ? 's' : ''}</>
            )}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="mt-2 pl-3 border-l-2 border-border/60 space-y-2">
          {thinking && (
            <div className="text-[11px] text-text-muted italic whitespace-pre-wrap max-h-60 overflow-y-auto leading-relaxed">
              {thinking}
            </div>
          )}
          {toolCalls &&
            toolCalls.map((tc, i) => {
              const isRunning = isStreaming && !tc.result && i === toolCount - 1;
              const isDone = tc.result !== undefined;

              return (
                <div key={i} className="text-[11px]">
                  <div className="flex items-center gap-1.5 text-text-secondary">
                    {/* Status indicator */}
                    {isRunning ? (
                      <span className="flex-shrink-0 w-3.5 h-3.5 flex items-center justify-center">
                        <span className="w-2 h-2 rounded-full border-[1.5px] border-amber-400 border-t-transparent animate-spin" />
                      </span>
                    ) : isDone ? (
                      <span className="flex-shrink-0 text-accent-green">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                    ) : (
                      <span className="flex-shrink-0 text-text-muted">{getToolIcon(tc.name)}</span>
                    )}
                    <span className="text-text-muted">{getToolIcon(tc.name)}</span>
                    <span className={`font-mono font-medium ${isRunning ? 'text-amber-400' : 'text-accent-cyan/80'}`}>{tc.name}</span>
                    <span className="text-text-muted truncate max-w-[300px]">{getToolLabel(tc)}</span>
                    {isRunning && (
                      <span className="text-[10px] text-amber-400/70 ml-auto flex-shrink-0">En cours...</span>
                    )}
                  </div>
                  {tc.result && (
                    <pre className="mt-1 text-[10px] text-text-muted bg-bg-hover/50 rounded p-1.5 max-h-20 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                      {tc.result}
                    </pre>
                  )}
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
