'use client';

import { useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import ThinkingBlock from './ThinkingBlock';
import MarkdownContent from './MarkdownContent';
import AgentAvatar from '@/components/AgentAvatar';
import type { AgentConfig, Message, ToolCall, ClientSummary } from '@/lib/types';

interface MessageListProps {
  agent: AgentConfig;
  messages: Message[];
  isLoading: boolean;
  streamingText: string;
  streamingThinking: string;
  streamingTools: ToolCall[];
  clients: ClientSummary[];
}

export default function MessageList({
  agent,
  messages,
  isLoading,
  streamingText,
  streamingThinking,
  streamingTools,
  clients,
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingText, streamingThinking, streamingTools]);

  const hasStreamingActivity = streamingText || streamingThinking || streamingTools.length > 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-1">
      {messages.map((msg, i) => (
        <MessageBubble key={i} message={msg} agent={agent} clients={clients} />
      ))}

      {/* Streaming response */}
      {isLoading && hasStreamingActivity && (
        <div className="chat-message chat-message-assistant">
          <div className="flex gap-3.5 py-5">
            <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 mt-0.5 ring-1 ring-border">
              <AgentAvatar avatar={agent.avatar} emoji={agent.emoji} name={agent.name} color={agent.color} size={32} className="w-full h-full" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-text-primary">{agent.name}</span>
              </div>
              {(streamingThinking || streamingTools.length > 0) && (
                <ThinkingBlock
                  thinking={streamingThinking}
                  toolCalls={streamingTools}
                  defaultOpen={true}
                  isStreaming={true}
                />
              )}
              {streamingText && (
                <div className="chat-markdown text-[14.5px] leading-relaxed text-text-primary">
                  <MarkdownContent content={streamingText} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Typing indicator */}
      {isLoading && !hasStreamingActivity && (
        <div className="chat-message chat-message-assistant">
          <div className="flex gap-3.5 py-5">
            <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 mt-0.5 ring-1 ring-border">
              <AgentAvatar avatar={agent.avatar} emoji={agent.emoji} name={agent.name} color={agent.color} size={32} className="w-full h-full" />
            </div>
            <div className="flex items-center gap-1 py-2">
              <span className="typing-dot w-1.5 h-1.5 rounded-full bg-text-muted" />
              <span className="typing-dot w-1.5 h-1.5 rounded-full bg-text-muted" />
              <span className="typing-dot w-1.5 h-1.5 rounded-full bg-text-muted" />
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
