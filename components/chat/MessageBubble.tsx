'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import AgentAvatar from '@/components/AgentAvatar';
import ThinkingBlock from './ThinkingBlock';
import MarkdownContent from './MarkdownContent';
import SkillEnrichModal from './SkillEnrichModal';
import type { AgentConfig, Message, ClientSummary } from '@/lib/types';

interface MessageBubbleProps {
  message: Message;
  agent: AgentConfig;
  clients: ClientSummary[];
}

export default function MessageBubble({ message, agent, clients }: MessageBubbleProps) {
  const [showEnrichModal, setShowEnrichModal] = useState(false);
  const [enrichContent, setEnrichContent] = useState('');
  const [copied, setCopied] = useState(false);
  const [selection, setSelection] = useState<{ text: string; top: number; left: number } | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [message.content]);

  const handleMouseUp = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !contentRef.current) {
      setSelection(null);
      return;
    }

    // Check selection is inside this message
    if (!contentRef.current.contains(sel.anchorNode)) {
      setSelection(null);
      return;
    }

    const text = sel.toString().trim();
    if (!text) {
      setSelection(null);
      return;
    }

    const range = sel.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const parentRect = contentRef.current.getBoundingClientRect();

    setSelection({
      text,
      top: rect.top - parentRect.top - 40,
      left: Math.min(rect.left - parentRect.left + rect.width / 2, parentRect.width - 60),
    });
  }, []);

  // Clear selection toolbar when clicking outside
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (!selection) return;
      const target = e.target as HTMLElement;
      if (target.closest('[data-selection-toolbar]')) return;
      setSelection(null);
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [selection]);

  const handleLearnSelection = useCallback(() => {
    if (!selection) return;
    setEnrichContent(selection.text);
    setShowEnrichModal(true);
    setSelection(null);
    window.getSelection()?.removeAllRanges();
  }, [selection]);

  return (
    <div className={`chat-message ${message.role === 'user' ? 'chat-message-user' : 'chat-message-assistant'} group relative`}>
      <div className="flex gap-3.5 py-5">
        {message.role === 'assistant' ? (
          <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 mt-0.5 ring-1 ring-border">
            <AgentAvatar avatar={agent.avatar} emoji={agent.emoji} name={agent.name} color={agent.color} size={32} className="w-full h-full" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-sm font-semibold text-text-primary">
              {message.role === 'assistant' ? agent.name : 'Toi'}
            </span>
            <span className="text-[11px] text-text-muted">{message.timestamp}</span>
            {message.role === 'user' && message.clientId && (
              <span className="text-[10px] text-accent-cyan bg-accent-cyan/8 px-1.5 py-0.5 rounded">
                {clients.find((c) => c.id === message.clientId)?.name || message.clientId}
              </span>
            )}
          </div>
          {message.role === 'assistant' && (message.thinking || message.toolCalls) && (
            <ThinkingBlock thinking={message.thinking} toolCalls={message.toolCalls} />
          )}
          {message.role === 'assistant' ? (
            <div ref={contentRef} className="chat-markdown text-[14.5px] leading-relaxed text-text-primary relative" onMouseUp={handleMouseUp}>
              <MarkdownContent content={message.content} />

              {/* Selection toolbar */}
              {selection && (
                <div
                  data-selection-toolbar
                  className="absolute z-20 animate-scale-in"
                  style={{ top: selection.top, left: selection.left, transform: 'translateX(-50%)' }}
                >
                  <button
                    onMouseDown={(e) => { e.preventDefault(); handleLearnSelection(); }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105 shadow-xl"
                    style={{
                      backgroundColor: agent.color,
                      color: '#fff',
                      boxShadow: `0 4px 20px -2px ${agent.color}60`,
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 5v14" />
                      <path d="M5 12h14" />
                    </svg>
                    Sauver dans un skill
                  </button>
                </div>
              )}
            </div>
          ) : (
            <p className="text-[14.5px] leading-relaxed text-text-primary whitespace-pre-wrap">{message.content}</p>
          )}
        </div>
      </div>

      {/* Copy button on hover — assistant only */}
      {message.role === 'assistant' && message.content && (
        <button
          onClick={handleCopy}
          className="absolute top-4 right-3 z-10 px-2.5 py-1 rounded-md bg-bg-hover/80 hover:bg-bg-hover text-text-muted hover:text-text-secondary text-xs font-mono transition-all opacity-0 group-hover:opacity-100"
        >
          {copied ? '✓ Copie' : 'Copier'}
        </button>
      )}

      {showEnrichModal && (
        <SkillEnrichModal
          agent={agent}
          content={enrichContent}
          onClose={() => setShowEnrichModal(false)}
        />
      )}
    </div>
  );
}
