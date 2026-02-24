'use client';

import AgentAvatar from '@/components/AgentAvatar';
import ThinkingBlock from './ThinkingBlock';
import MarkdownContent from './MarkdownContent';
import type { AgentConfig, Message, ClientSummary } from '@/lib/types';

interface MessageBubbleProps {
  message: Message;
  agent: AgentConfig;
  clients: ClientSummary[];
}

export default function MessageBubble({ message, agent, clients }: MessageBubbleProps) {
  return (
    <div className={`chat-message ${message.role === 'user' ? 'chat-message-user' : 'chat-message-assistant'}`}>
      <div className="flex gap-3 py-4">
        {message.role === 'assistant' ? (
          <div className="w-7 h-7 rounded-lg overflow-hidden flex-shrink-0 mt-0.5 ring-1 ring-border">
            <AgentAvatar avatar={agent.avatar} emoji={agent.emoji} name={agent.name} color={agent.color} size={28} className="w-full h-full" />
          </div>
        ) : (
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-text-primary">
              {message.role === 'assistant' ? agent.name : 'Toi'}
            </span>
            <span className="text-[10px] text-text-muted">{message.timestamp}</span>
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
            <div className="chat-markdown text-[13.5px] leading-relaxed text-text-primary">
              <MarkdownContent content={message.content} />
            </div>
          ) : (
            <p className="text-[13.5px] leading-relaxed text-text-primary whitespace-pre-wrap">{message.content}</p>
          )}
        </div>
      </div>
    </div>
  );
}
