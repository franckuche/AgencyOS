'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import AgentPicker from './AgentPicker';
import { formatFileSize } from '@/lib/utils';
import type { AgentConfig, UploadedFile, ClientSummary } from '@/lib/types';

interface ChatInputProps {
  agent: AgentConfig;
  agents: AgentConfig[];
  onChangeAgent: (agentId: string) => void;
  onSendMessage: (agentId: string, message: string, clientId: string | null) => void;
  onStop: () => void;
  isLoading: boolean;
  selectedClient: string | null;
  clients: ClientSummary[];
}

export default function ChatInput({
  agent,
  agents,
  onChangeAgent,
  onSendMessage,
  onStop,
  isLoading,
  selectedClient,
  clients,
}: ChatInputProps) {
  const [input, setInput] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<UploadedFile[]>([]);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [agent.id]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    if (!input.trim() && attachedFiles.length === 0) return;

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
    if (e.key === 'Escape' && isLoading) {
      e.preventDefault();
      onStop();
      return;
    }
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const currentClient = clients.find((c) => c.id === selectedClient);

  return (
    <div className="border-t border-border bg-bg-primary">
      {/* Upload status toast */}
      {uploadStatus && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 bg-bg-card border border-border rounded-lg px-4 py-2.5 text-xs text-text-secondary shadow-xl flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />
          {uploadStatus}
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-3">
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
            <AgentPicker agent={agent} agents={agents} onChangeAgent={onChangeAgent} />

            {/* Attach button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-3.5 text-text-muted hover:text-text-secondary transition-colors flex-shrink-0"
              title="Joindre un fichier"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
              className="flex-1 bg-transparent py-4 text-[15px] text-text-primary placeholder-text-muted resize-none focus:outline-none"
              style={{ minHeight: '56px', maxHeight: '180px' }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = '56px';
                target.style.height = `${Math.min(target.scrollHeight, 180)}px`;
              }}
            />

            {/* Send / Stop button */}
            {isLoading ? (
              <button
                type="button"
                onClick={onStop}
                className="p-3.5 flex-shrink-0 transition-all group"
                title="Stopper la génération"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-red-400 group-hover:text-red-300 transition-colors">
                  <rect x="4" y="4" width="16" height="16" rx="2" fill="currentColor" />
                </svg>
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim() && attachedFiles.length === 0}
                className="p-3.5 flex-shrink-0 transition-all disabled:opacity-20"
                style={{ color: (input.trim() || attachedFiles.length > 0) ? agent.color : '#D1D5DB' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            )}
          </div>
        </form>
        <p className="text-[10px] text-text-muted text-center mt-2">
          Enter pour envoyer, Shift+Enter pour sauter une ligne{isLoading ? ', Echap pour stopper' : ''}
        </p>
      </div>
    </div>
  );
}
