'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ClientSelector, { type ClientInfo } from './ClientSelector';

interface ToolCall {
  name: string;
  input: Record<string, unknown>;
  result?: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  clientId?: string | null;
  thinking?: string;
  toolCalls?: ToolCall[];
}

interface Agent {
  id: string;
  name: string;
  role: string;
  avatar: string;
  color: string;
}

interface UploadedFile {
  name: string;
  size: number;
  path: string;
}

interface ChatPanelProps {
  agent: Agent;
  agents: Agent[];
  onChangeAgent: (agentId: string) => void;
  messages: Message[];
  onSendMessage: (agentId: string, message: string, clientId: string | null) => void;
  isLoading: boolean;
  streamingText: string;
  streamingThinking: string;
  streamingTools: ToolCall[];
  clients: ClientInfo[];
  selectedClient: string | null;
  onSelectClient: (id: string | null) => void;
}

function CopyButton({ text }: { text: string }) {
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

function MarkdownContent({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        pre({ children }) {
          let codeString = '';
          try {
            const codeEl = children as React.ReactElement<{ children?: string }>;
            if (codeEl?.props?.children && typeof codeEl.props.children === 'string') {
              codeString = codeEl.props.children;
            }
          } catch {
            // ignore
          }
          return (
            <div className="relative group my-3">
              <pre className="chat-pre">{children}</pre>
              {codeString && <CopyButton text={codeString} />}
            </div>
          );
        },
        code({ className, children, ...props }) {
          const isBlock = className?.startsWith('language-');
          if (isBlock) {
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          }
          return (
            <code className="chat-inline-code" {...props}>
              {children}
            </code>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

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

function ThinkingBlock({
  thinking,
  toolCalls,
  defaultOpen = false,
}: {
  thinking?: string;
  toolCalls?: ToolCall[];
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  if (!thinking && (!toolCalls || toolCalls.length === 0)) return null;

  const toolCount = toolCalls?.length || 0;

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
          <span className="text-[10px] bg-bg-hover px-1.5 py-0.5 rounded text-text-muted">
            {toolCount} outil{toolCount > 1 ? 's' : ''}
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
            toolCalls.map((tc, i) => (
              <div key={i} className="text-[11px]">
                <div className="flex items-center gap-1.5 text-text-secondary">
                  <span className="text-text-muted">{getToolIcon(tc.name)}</span>
                  <span className="font-mono font-medium text-accent-cyan/80">{tc.name}</span>
                  <span className="text-text-muted truncate max-w-[300px]">{getToolLabel(tc)}</span>
                </div>
                {tc.result && (
                  <pre className="mt-1 text-[10px] text-text-muted bg-bg-hover/50 rounded p-1.5 max-h-20 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                    {tc.result}
                  </pre>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default function ChatPanel({
  agent,
  agents,
  onChangeAgent,
  messages,
  onSendMessage,
  isLoading,
  streamingText,
  streamingThinking,
  streamingTools,
  clients,
  selectedClient,
  onSelectClient,
}: ChatPanelProps) {
  const [showAgentPicker, setShowAgentPicker] = useState(false);
  const [input, setInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [attachedFiles, setAttachedFiles] = useState<UploadedFile[]>([]);
  const dragCounter = useRef(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingText, streamingThinking, streamingTools]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [agent.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && attachedFiles.length === 0) || isLoading) return;

    let message = input.trim();
    if (attachedFiles.length > 0) {
      const filePaths = attachedFiles.map((f) => f.path).join('\n');
      const fileList = attachedFiles.map((f) => `${f.name} (${formatFileSize(f.size)})`).join(', ');
      if (message) {
        message = `${message}\n\n[Fichiers joints : ${fileList}]\n${filePaths}`;
      } else {
        message = `Analyse ces fichiers : ${fileList}\n\n${filePaths}`;
      }
      setAttachedFiles([]);
    }

    onSendMessage(agent.id, message, selectedClient);
    setInput('');
    if (inputRef.current) {
      inputRef.current.style.height = '52px';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} o`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
  }

  const handleUploadFiles = useCallback(
    async (files: FileList) => {
      const url = selectedClient
        ? `/api/clients/${selectedClient}/files`
        : '/api/upload';

      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }
      formData.append('agentId', agent.id);

      setUploadStatus('Upload en cours...');
      try {
        const res = await fetch(url, { method: 'POST', body: formData });
        const data = await res.json();

        if (!res.ok) {
          setUploadStatus(`Erreur : ${data.error}`);
          setTimeout(() => setUploadStatus(null), 4000);
          return;
        }

        setUploadStatus(null);
        setAttachedFiles((prev) => [...prev, ...(data.files as UploadedFile[])]);
        inputRef.current?.focus();
      } catch {
        setUploadStatus('Erreur réseau');
        setTimeout(() => setUploadStatus(null), 4000);
      }
    },
    [selectedClient, agent.id],
  );

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.types.includes('Files')) setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      dragCounter.current = 0;
      const files = e.dataTransfer.files;
      if (files.length > 0) handleUploadFiles(files);
    },
    [handleUploadFiles],
  );

  const currentClient = clients.find((c) => c.id === selectedClient);

  const hasStreamingActivity = streamingText || streamingThinking || streamingTools.length > 0;

  return (
    <div
      className="flex flex-col h-screen relative bg-bg-primary"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Drag overlay */}
      {isDragging && (
        <div className="absolute inset-0 z-50 bg-bg-primary/90 backdrop-blur-sm flex items-center justify-center pointer-events-none">
          <div className="border-2 border-dashed border-accent-cyan/40 rounded-2xl p-12 text-center">
            <div className="w-12 h-12 rounded-xl bg-accent-cyan/10 flex items-center justify-center mx-auto mb-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent-cyan">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <p className="text-text-primary font-medium text-sm">Dépose ton fichier ici</p>
            <p className="text-text-muted text-xs mt-1">CSV, PDF, Excel, Word — max 50 Mo</p>
          </div>
        </div>
      )}

      {/* Upload status toast */}
      {uploadStatus && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 bg-bg-card border border-border rounded-lg px-4 py-2.5 text-xs text-text-secondary shadow-xl flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />
          {uploadStatus}
        </div>
      )}

      {/* Top bar */}
      <div className="border-b border-border px-5 py-3 flex items-center gap-3 bg-bg-primary/80 backdrop-blur-md sticky top-0 z-10">
        <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
          <Image src={agent.avatar} alt={agent.name} width={32} height={32} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-text-primary">{agent.name}</h2>
            <span className="text-xs text-text-muted">{agent.role}</span>
          </div>
        </div>

        {currentClient && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-accent-cyan/8 border border-accent-cyan/15">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan" />
            <span className="text-[11px] text-accent-cyan font-medium">{currentClient.name}</span>
          </div>
        )}

        <ClientSelector
          clients={clients}
          selectedClient={selectedClient}
          onSelectClient={onSelectClient}
          agentColor={agent.color}
        />

        <div className="flex items-center gap-1.5 ml-1">
          <span
            className="w-2 h-2 rounded-full transition-colors"
            style={{
              backgroundColor: isLoading ? '#FFB800' : agent.color,
              animation: isLoading ? 'pulse-dot 1.5s infinite' : 'none',
            }}
          />
          <span
            className="text-[10px] uppercase tracking-wider font-semibold"
            style={{ color: isLoading ? '#FFB800' : agent.color }}
          >
            {isLoading ? 'Réfléchit...' : 'Dispo'}
          </span>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 && !isLoading ? (
          /* Empty state */
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 rounded-2xl overflow-hidden mx-auto mb-5 ring-2 ring-border">
                <Image src={agent.avatar} alt={agent.name} width={64} height={64} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-1">
                Salut, c&apos;est{' '}
                <span style={{ color: agent.color }}>{agent.name}</span>
              </h3>
              <p className="text-sm text-text-secondary mb-4">{agent.role}</p>
              {currentClient ? (
                <p className="text-xs text-accent-cyan bg-accent-cyan/8 inline-block px-3 py-1.5 rounded-full">
                  Client actif : {currentClient.name}
                </p>
              ) : (
                <p className="text-xs text-text-muted">
                  Envoie un message ou sélectionne un client pour contextualiser
                </p>
              )}
            </div>
          </div>
        ) : (
          /* Messages */
          <div className="max-w-3xl mx-auto px-4 py-6 space-y-1">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-message ${msg.role === 'user' ? 'chat-message-user' : 'chat-message-assistant'}`}>
                <div className="flex gap-3 py-4">
                  {msg.role === 'assistant' ? (
                    <div className="w-7 h-7 rounded-lg overflow-hidden flex-shrink-0 mt-0.5 ring-1 ring-border">
                      <Image src={agent.avatar} alt={agent.name} width={28} height={28} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0 mt-0.5">
                      F
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-text-primary">
                        {msg.role === 'assistant' ? agent.name : 'Toi'}
                      </span>
                      <span className="text-[10px] text-text-muted">{msg.timestamp}</span>
                      {msg.role === 'user' && msg.clientId && (
                        <span className="text-[10px] text-accent-cyan bg-accent-cyan/8 px-1.5 py-0.5 rounded">
                          {clients.find((c) => c.id === msg.clientId)?.name || msg.clientId}
                        </span>
                      )}
                    </div>
                    {/* Thinking block for assistant messages */}
                    {msg.role === 'assistant' && (msg.thinking || msg.toolCalls) && (
                      <ThinkingBlock thinking={msg.thinking} toolCalls={msg.toolCalls} />
                    )}
                    {msg.role === 'assistant' ? (
                      <div className="chat-markdown text-[13.5px] leading-relaxed text-text-primary">
                        <MarkdownContent content={msg.content} />
                      </div>
                    ) : (
                      <p className="text-[13.5px] leading-relaxed text-text-primary whitespace-pre-wrap">{msg.content}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Streaming response */}
            {isLoading && hasStreamingActivity && (
              <div className="chat-message chat-message-assistant">
                <div className="flex gap-3 py-4">
                  <div className="w-7 h-7 rounded-lg overflow-hidden flex-shrink-0 mt-0.5 ring-1 ring-border">
                    <Image src={agent.avatar} alt={agent.name} width={28} height={28} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-text-primary">{agent.name}</span>
                    </div>
                    {/* Streaming thinking block — open by default */}
                    {(streamingThinking || streamingTools.length > 0) && (
                      <ThinkingBlock
                        thinking={streamingThinking}
                        toolCalls={streamingTools}
                        defaultOpen={true}
                      />
                    )}
                    {streamingText && (
                      <div className="chat-markdown text-[13.5px] leading-relaxed text-text-primary">
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
                <div className="flex gap-3 py-4">
                  <div className="w-7 h-7 rounded-lg overflow-hidden flex-shrink-0 mt-0.5 ring-1 ring-border">
                    <Image src={agent.avatar} alt={agent.name} width={28} height={28} className="w-full h-full object-cover" />
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
        )}
      </div>

      {/* Input area */}
      <div className="border-t border-border bg-bg-primary">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <form onSubmit={handleSubmit} className="relative">
            {/* Attached files */}
            {attachedFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {attachedFiles.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 bg-bg-card border border-border rounded-lg px-2.5 py-1.5 text-xs text-text-secondary"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-muted flex-shrink-0">
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                    <span className="truncate max-w-[150px]">{f.name}</span>
                    <span className="text-text-muted">{formatFileSize(f.size)}</span>
                    <button
                      type="button"
                      onClick={() => setAttachedFiles((prev) => prev.filter((_, idx) => idx !== i))}
                      className="ml-0.5 text-text-muted hover:text-red-400 transition-colors"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex items-end bg-bg-card border border-border rounded-2xl transition-colors focus-within:border-border-active">
              {/* Agent selector */}
              <div className="relative flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setShowAgentPicker(!showAgentPicker)}
                  className="flex items-center gap-1.5 pl-3 pr-1 py-3 text-text-secondary hover:text-text-primary transition-colors"
                  title={`Agent : ${agent.name}`}
                >
                  <div className="w-5 h-5 rounded-md overflow-hidden ring-1 ring-border">
                    <Image src={agent.avatar} alt={agent.name} width={20} height={20} className="w-full h-full object-cover" />
                  </div>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-text-muted">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>

                {showAgentPicker && (
                  <div className="absolute bottom-full left-0 mb-2 w-48 bg-bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50">
                    {agents.map((a) => (
                      <button
                        key={a.id}
                        onClick={() => {
                          onChangeAgent(a.id);
                          setShowAgentPicker(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left hover:bg-bg-hover transition-colors ${
                          a.id === agent.id ? 'bg-bg-hover' : ''
                        }`}
                      >
                        <div className="w-6 h-6 rounded-md overflow-hidden flex-shrink-0">
                          <Image src={a.avatar} alt={a.name} width={24} height={24} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-medium text-text-primary block">{a.name}</span>
                          <span className="text-[10px] text-text-muted block truncate">{a.role}</span>
                        </div>
                        {a.id === agent.id && (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-accent-cyan flex-shrink-0">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Attach button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-3 text-text-muted hover:text-text-secondary transition-colors flex-shrink-0"
                title="Joindre un fichier"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                </svg>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".csv,.pdf,.xlsx,.xls,.docx,.doc,.txt,.json,.html,.xml"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleUploadFiles(e.target.files);
                    e.target.value = '';
                  }
                }}
              />

              {/* Textarea */}
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  currentClient
                    ? `Message ${agent.name} à propos de ${currentClient.name}...`
                    : `Message ${agent.name}...`
                }
                rows={1}
                disabled={isLoading}
                className="flex-1 bg-transparent py-3.5 text-sm text-text-primary placeholder-text-muted resize-none focus:outline-none disabled:opacity-50"
                style={{ minHeight: '52px', maxHeight: '160px' }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = '52px';
                  target.style.height = `${Math.min(target.scrollHeight, 160)}px`;
                }}
              />

              {/* Send button */}
              <button
                type="submit"
                disabled={(!input.trim() && attachedFiles.length === 0) || isLoading}
                className="p-3 flex-shrink-0 transition-all disabled:opacity-20"
                style={{ color: (input.trim() || attachedFiles.length > 0) && !isLoading ? agent.color : '#3D4A5C' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </div>
          </form>
          <p className="text-[10px] text-text-muted text-center mt-2">
            Enter pour envoyer, Shift+Enter pour sauter une ligne
          </p>
        </div>
      </div>
    </div>
  );
}
