'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { clientsApi } from '@/lib/api';
import { formatFileSize, formatDateFull } from '@/lib/utils';
import type { ClientInfo, FileInfo } from '@/lib/types';

interface ClientsPageProps {
  clients: ClientInfo[];
  onRefresh: () => void;
  onSelectClientForChat: (clientId: string) => void;
  onOpenSidebar?: () => void;
}

const FILE_ICONS: Record<string, string> = {
  xlsx: '📊', xls: '📊', csv: '📊',
  pdf: '📄',
  md: '📝', txt: '📝', doc: '📝', docx: '📝',
  png: '🖼', jpg: '🖼', jpeg: '🖼', svg: '🖼', webp: '🖼',
  json: '{ }', html: '< >', xml: '< >',
};

function getClientColor(name: string): string {
  const colors = ['#00D4AA', '#FF8C42', '#4ECB71', '#5B8DEF', '#E040FB', '#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#FF6B9D'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export default function ClientsPage({ clients, onRefresh, onSelectClientForChat, onOpenSidebar }: ClientsPageProps) {
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newSector, setNewSector] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [creating, setCreating] = useState(false);
  const [expandedClient, setExpandedClient] = useState<string | null>(null);
  const [clientFiles, setClientFiles] = useState<Record<string, FileInfo[]>>({});
  const [noteInput, setNoteInput] = useState<Record<string, string>>({});
  const [savingNote, setSavingNote] = useState(false);
  const [uploadingClient, setUploadingClient] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const fetchFiles = useCallback(async (clientId: string) => {
    try {
      const files = await clientsApi.listFiles(clientId);
      setClientFiles(prev => ({ ...prev, [clientId]: files }));
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (expandedClient) {
      fetchFiles(expandedClient);
    }
  }, [expandedClient, fetchFiles]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    try {
      await clientsApi.create({ name: newName, sector: newSector, url: newUrl });
      setNewName(''); setNewSector(''); setNewUrl('');
      setShowCreate(false);
      onRefresh();
    } finally {
      setCreating(false);
    }
  };

  const handleAddNote = async (clientId: string) => {
    const note = noteInput[clientId]?.trim();
    if (!note) return;
    setSavingNote(true);
    try {
      await clientsApi.addNote(clientId, note);
      setNoteInput(prev => ({ ...prev, [clientId]: '' }));
      fetchFiles(clientId);
      onRefresh();
    } finally {
      setSavingNote(false);
    }
  };

  const handleUpload = async (clientId: string, fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setUploadingClient(clientId);
    try {
      const formData = new FormData();
      for (let i = 0; i < fileList.length; i++) {
        formData.append('files', fileList[i]);
      }
      const res = await clientsApi.uploadFiles(clientId, formData);
      if (!res.ok) {
        const data = await res.json();
        setUploadError(data.error || 'Erreur upload');
        setTimeout(() => setUploadError(null), 4000);
      }
      fetchFiles(clientId);
    } catch {
      setUploadError('Erreur reseau');
      setTimeout(() => setUploadError(null), 4000);
    } finally {
      setUploadingClient(null);
      const input = fileInputRefs.current[clientId];
      if (input) input.value = '';
    }
  };

  const selectedClient = clients.find(c => c.id === expandedClient);
  const files = expandedClient ? (clientFiles[expandedClient] || []) : [];
  const livrables = files.filter(f => ['xlsx', 'xls', 'csv', 'pdf', 'docx', 'doc'].includes(f.ext));
  const docs = files.filter(f => ['md', 'txt'].includes(f.ext));
  const otherFiles = files.filter(f => f.type === 'file' && !livrables.includes(f) && !docs.includes(f));

  return (
    <div className="h-screen flex flex-col">
      {uploadError && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg px-4 py-2.5 text-xs shadow-xl animate-scale-in">
          {uploadError}
        </div>
      )}

      {/* Header */}
      <div className="border-b border-border bg-bg-primary px-8 py-5 flex-shrink-0">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            {onOpenSidebar && (
              <button
                onClick={onOpenSidebar}
                className="md:hidden p-1.5 rounded-lg hover:bg-bg-hover text-text-muted"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
            )}
            <div>
              <h1 className="text-lg font-semibold text-text-primary">Clients</h1>
              <p className="text-sm text-text-secondary mt-0.5">
                {clients.length} client{clients.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="px-4 py-2 bg-accent-cyan/20 text-accent-cyan text-sm font-semibold rounded-lg hover:bg-accent-cyan/30 transition-colors"
          >
            + Nouveau client
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-8 py-6">
          {showCreate && (
            <form onSubmit={handleCreate} className="bg-bg-card border border-border rounded-xl p-6 mb-6 space-y-4 animate-scale-in">
              <h3 className="text-sm font-semibold text-text-primary">Nouveau client</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-text-muted mb-1">Nom *</label>
                  <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)}
                    placeholder="Ex: Sofinco" className="w-full bg-bg-hover border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-border-active" />
                </div>
                <div>
                  <label className="block text-xs text-text-muted mb-1">Secteur</label>
                  <input type="text" value={newSector} onChange={(e) => setNewSector(e.target.value)}
                    placeholder="Ex: E-commerce" className="w-full bg-bg-hover border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-border-active" />
                </div>
                <div>
                  <label className="block text-xs text-text-muted mb-1">URL</label>
                  <input type="text" value={newUrl} onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="https://..." className="w-full bg-bg-hover border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-border-active" />
                </div>
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={!newName.trim() || creating}
                  className="px-4 py-2 bg-accent-cyan/20 text-accent-cyan text-sm font-semibold rounded-lg hover:bg-accent-cyan/30 disabled:opacity-40 transition-colors">
                  {creating ? 'Creation...' : 'Creer'}
                </button>
                <button type="button" onClick={() => setShowCreate(false)}
                  className="px-4 py-2 text-text-secondary text-sm hover:text-text-primary transition-colors">
                  Annuler
                </button>
              </div>
            </form>
          )}

          {/* Grid 2 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {clients.map((client) => {
              const clientColor = getClientColor(client.name);
              const isSelected = expandedClient === client.id;

              return (
                <div
                  key={client.id}
                  onClick={() => setExpandedClient(isSelected ? null : client.id)}
                  className={`bg-bg-card border rounded-xl p-4 cursor-pointer transition-all animate-fade-in ${
                    isSelected
                      ? 'ring-2 ring-accent-cyan border-accent-cyan/30'
                      : 'border-border hover:ring-1 hover:ring-border-active'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Avatar initiale */}
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                      style={{ backgroundColor: `${clientColor}20`, color: clientColor }}
                    >
                      {client.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-text-primary truncate">{client.name}</h3>
                        {client.sector && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent-cyan/10 text-accent-cyan font-medium flex-shrink-0">
                            {client.sector}
                          </span>
                        )}
                      </div>
                      {client.url && (
                        <p className="text-xs text-text-muted mt-0.5 truncate">{client.url}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); onSelectClientForChat(client.id); }}
                        className="px-2.5 py-1 text-[10px] bg-accent-cyan/10 text-accent-cyan rounded-lg hover:bg-accent-cyan/20 transition-colors font-medium"
                      >
                        Chatter
                      </button>
                      <svg
                        className={`w-4 h-4 text-text-muted transition-transform ${isSelected ? 'rotate-180' : ''}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {client.objectives.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {client.objectives.slice(0, 2).map((obj, i) => (
                        <span key={i} className="text-[10px] text-text-secondary bg-bg-primary px-2 py-0.5 rounded-md">
                          {obj.length > 40 ? obj.slice(0, 40) + '...' : obj}
                        </span>
                      ))}
                      {client.objectives.length > 2 && (
                        <span className="text-[10px] text-text-muted px-1">
                          +{client.objectives.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Detail panel */}
          {selectedClient && (
            <div className="mt-4 bg-bg-card border border-border rounded-xl overflow-hidden animate-scale-in">
              {/* Client header */}
              <div className="px-6 py-4 border-b border-border flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0"
                  style={{ backgroundColor: `${getClientColor(selectedClient.name)}20`, color: getClientColor(selectedClient.name) }}
                >
                  {selectedClient.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-text-primary">{selectedClient.name}</h3>
                  <div className="flex items-center gap-3 mt-0.5">
                    {selectedClient.sector && (
                      <span className="text-xs text-text-secondary">{selectedClient.sector}</span>
                    )}
                    {selectedClient.url && (
                      <a
                        href={selectedClient.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs text-accent-cyan hover:underline"
                      >
                        {selectedClient.url}
                      </a>
                    )}
                  </div>
                </div>
                <span className="text-[10px] text-text-muted">Depuis {selectedClient.startDate || '—'}</span>
              </div>

              {/* 3-column detail */}
              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
                {/* Col 1: Info */}
                <div className="p-5">
                  <h4 className="text-[10px] text-text-muted uppercase tracking-wider font-semibold mb-3">Info</h4>
                  {selectedClient.objectives.length > 0 && (
                    <div className="mb-4">
                      <p className="text-[10px] text-accent-cyan uppercase tracking-wider mb-2">Objectifs</p>
                      <ul className="space-y-1.5">
                        {selectedClient.objectives.map((obj, i) => (
                          <li key={i} className="text-xs text-text-secondary flex items-start gap-2">
                            <span className="text-accent-cyan mt-px">-</span>
                            <span>{obj}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="pt-3 border-t border-border">
                    <p className="text-[10px] text-text-muted font-mono truncate">{selectedClient.cwd}</p>
                    <span className="text-[10px] text-text-muted mt-1 block">
                      {selectedClient.hasClaudeMd ? 'CLAUDE.md actif' : 'Pas de CLAUDE.md'}
                    </span>
                  </div>
                </div>

                {/* Col 2: Fichiers */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">
                      Fichiers
                    </h4>
                    <div>
                      <input
                        ref={(el) => { fileInputRefs.current[selectedClient.id] = el; }}
                        type="file"
                        multiple
                        accept=".csv,.pdf,.xlsx,.xls,.docx,.doc"
                        className="hidden"
                        onChange={(e) => handleUpload(selectedClient.id, e.target.files)}
                      />
                      <button
                        onClick={(e) => { e.stopPropagation(); fileInputRefs.current[selectedClient.id]?.click(); }}
                        disabled={uploadingClient === selectedClient.id}
                        className="px-2.5 py-1 text-[10px] font-semibold bg-accent-cyan/10 text-accent-cyan rounded-md hover:bg-accent-cyan/20 disabled:opacity-50 transition-colors"
                      >
                        {uploadingClient === selectedClient.id ? 'Upload...' : 'Uploader'}
                      </button>
                    </div>
                  </div>

                  {livrables.length > 0 && (
                    <div className="mb-3">
                      <p className="text-[10px] text-accent-cyan uppercase tracking-wider mb-1.5">Livrables</p>
                      {livrables.map((f) => (
                        <div key={f.name} className="flex items-center gap-2 py-1 px-2 rounded-md hover:bg-bg-hover/50">
                          <span className="text-sm">{FILE_ICONS[f.ext] || '📎'}</span>
                          <span className="text-xs text-text-primary flex-1 truncate">{f.name}</span>
                          <span className="text-[10px] text-text-muted">{formatFileSize(f.size)}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {docs.length > 0 && (
                    <div className="mb-3">
                      <p className="text-[10px] text-text-secondary uppercase tracking-wider mb-1.5">Documents</p>
                      {docs.map((f) => (
                        <div key={f.name} className="flex items-center gap-2 py-1 px-2 rounded-md hover:bg-bg-hover/50">
                          <span className="text-sm">{FILE_ICONS[f.ext] || '📎'}</span>
                          <span className="text-xs text-text-primary flex-1 truncate">{f.name}</span>
                          <span className="text-[10px] text-text-muted">{formatFileSize(f.size)}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {otherFiles.length > 0 && (
                    <div>
                      <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1.5">Autres</p>
                      {otherFiles.map((f) => (
                        <div key={f.name} className="flex items-center gap-2 py-1 px-2 rounded-md hover:bg-bg-hover/50">
                          <span className="text-sm">📎</span>
                          <span className="text-xs text-text-primary flex-1 truncate">{f.name}</span>
                          <span className="text-[10px] text-text-muted">{formatFileSize(f.size)}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {files.length === 0 && (
                    <p className="text-xs text-text-muted">Aucun fichier.</p>
                  )}
                </div>

                {/* Col 3: Notes */}
                <div className="p-5">
                  <h4 className="text-[10px] text-text-muted uppercase tracking-wider font-semibold mb-3">
                    Notes
                  </h4>

                  <div>
                    <p className="text-[10px] text-text-muted mb-2">
                      Ajoutee au CLAUDE.md — visible par les agents
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={noteInput[selectedClient.id] || ''}
                        onChange={(e) => setNoteInput(prev => ({ ...prev, [selectedClient.id]: e.target.value }))}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleAddNote(selectedClient.id); }}
                        onClick={(e) => e.stopPropagation()}
                        placeholder="Ajouter une note..."
                        className="flex-1 bg-bg-hover border border-border rounded-lg px-3 py-2 text-xs text-text-primary placeholder-text-muted focus:outline-none focus:border-border-active"
                      />
                      <button
                        onClick={(e) => { e.stopPropagation(); handleAddNote(selectedClient.id); }}
                        disabled={!noteInput[selectedClient.id]?.trim() || savingNote}
                        className="px-3 py-2 bg-accent-cyan/20 text-accent-cyan text-xs font-semibold rounded-lg hover:bg-accent-cyan/30 disabled:opacity-40 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {clients.length === 0 && (
            <div className="text-center py-20">
              <svg className="mx-auto mb-4 opacity-20 text-text-muted" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <p className="text-text-secondary text-sm font-medium">Aucun client pour l&apos;instant</p>
              <p className="text-text-muted text-xs mt-1">Cree ton premier client pour commencer</p>
              <button
                onClick={() => setShowCreate(true)}
                className="mt-4 px-4 py-2 bg-accent-cyan/20 text-accent-cyan text-sm font-semibold rounded-lg hover:bg-accent-cyan/30 transition-colors"
              >
                + Nouveau client
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
