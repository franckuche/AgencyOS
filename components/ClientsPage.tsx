'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export interface ClientInfo {
  id: string;
  name: string;
  sector: string;
  url: string;
  cwd: string;
  startDate: string;
  objectives: string[];
  hasClaudeMd: boolean;
}

interface FileInfo {
  name: string;
  type: 'file' | 'dir';
  size: number;
  modified: string;
  ext: string;
}

interface ClientsPageProps {
  clients: ClientInfo[];
  onRefresh: () => void;
  onSelectClientForChat: (clientId: string) => void;
}

const FILE_ICONS: Record<string, string> = {
  xlsx: '📊', xls: '📊', csv: '📊',
  pdf: '📄',
  md: '📝', txt: '📝', doc: '📝', docx: '📝',
  png: '🖼', jpg: '🖼', jpeg: '🖼', svg: '🖼', webp: '🖼',
  json: '{ }', html: '< >', xml: '< >',
};

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

export default function ClientsPage({ clients, onRefresh, onSelectClientForChat }: ClientsPageProps) {
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
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const fetchFiles = useCallback(async (clientId: string) => {
    try {
      const res = await fetch(`/api/clients/${clientId}/files`);
      if (res.ok) {
        const files = await res.json();
        setClientFiles(prev => ({ ...prev, [clientId]: files }));
      }
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
      const res = await fetch('/api/clients/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName, sector: newSector, url: newUrl }),
      });
      if (res.ok) {
        setNewName(''); setNewSector(''); setNewUrl('');
        setShowCreate(false);
        onRefresh();
      }
    } finally {
      setCreating(false);
    }
  };

  const handleAddNote = async (clientId: string) => {
    const note = noteInput[clientId]?.trim();
    if (!note) return;
    setSavingNote(true);
    try {
      const res = await fetch(`/api/clients/${clientId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note }),
      });
      if (res.ok) {
        setNoteInput(prev => ({ ...prev, [clientId]: '' }));
        fetchFiles(clientId);
        onRefresh();
      }
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
      const res = await fetch(`/api/clients/${clientId}/files`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Erreur upload');
      }
      fetchFiles(clientId);
    } catch {
      alert('Erreur réseau lors de l\'upload');
    } finally {
      setUploadingClient(null);
      const input = fileInputRefs.current[clientId];
      if (input) input.value = '';
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-mono tracking-wide">
            <span className="text-accent-cyan">CLIENTS</span>
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            {clients.length} client{clients.length !== 1 ? 's' : ''} — infos, livrables, contexte pour les agents
          </p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="px-4 py-2 bg-accent-cyan text-bg-primary text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity"
        >
          + Nouveau client
        </button>
      </div>

      {/* Create form */}
      {showCreate && (
        <form onSubmit={handleCreate} className="bg-bg-card border border-border rounded-xl p-6 mb-6 space-y-4">
          <h3 className="text-sm font-semibold text-text-primary">Nouveau client</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-text-muted mb-1">Nom *</label>
              <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)}
                placeholder="Ex: Sofinco" className="w-full bg-bg-input border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-border-active" />
            </div>
            <div>
              <label className="block text-xs text-text-muted mb-1">Secteur</label>
              <input type="text" value={newSector} onChange={(e) => setNewSector(e.target.value)}
                placeholder="Ex: E-commerce" className="w-full bg-bg-input border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-border-active" />
            </div>
            <div>
              <label className="block text-xs text-text-muted mb-1">URL</label>
              <input type="text" value={newUrl} onChange={(e) => setNewUrl(e.target.value)}
                placeholder="https://..." className="w-full bg-bg-input border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-border-active" />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={!newName.trim() || creating}
              className="px-4 py-2 bg-accent-cyan text-bg-primary text-sm font-semibold rounded-lg hover:opacity-90 disabled:opacity-40 transition-opacity">
              {creating ? 'Création...' : 'Créer'}
            </button>
            <button type="button" onClick={() => setShowCreate(false)}
              className="px-4 py-2 text-text-secondary text-sm hover:text-text-primary transition-colors">
              Annuler
            </button>
          </div>
        </form>
      )}

      {/* Client list */}
      <div className="space-y-4">
        {clients.map((client) => {
          const isExpanded = expandedClient === client.id;
          const files = clientFiles[client.id] || [];
          const livrables = files.filter(f => ['xlsx', 'xls', 'csv', 'pdf', 'docx', 'doc'].includes(f.ext));
          const docs = files.filter(f => ['md', 'txt'].includes(f.ext));
          const otherFiles = files.filter(f => f.type === 'file' && !livrables.includes(f) && !docs.includes(f));

          return (
            <div key={client.id} className="bg-bg-card border border-border rounded-xl overflow-hidden transition-all">
              {/* Client header - always visible */}
              <div
                className="p-6 cursor-pointer hover:bg-bg-hover/30 transition-colors"
                onClick={() => setExpandedClient(isExpanded ? null : client.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-text-primary">{client.name}</h3>
                      {client.sector && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent-cyan/10 text-accent-cyan font-medium">
                          {client.sector}
                        </span>
                      )}
                    </div>
                    {client.url && (
                      <p className="text-xs text-text-muted mt-1">{client.url}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); onSelectClientForChat(client.id); }}
                      className="px-3 py-1.5 text-xs bg-accent-cyan/10 text-accent-cyan rounded-lg hover:bg-accent-cyan/20 transition-colors font-medium"
                    >
                      Parler à Omar
                    </button>
                    <svg
                      className={`w-4 h-4 text-text-muted transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Objectives preview */}
                {client.objectives.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {client.objectives.slice(0, 3).map((obj, i) => (
                      <span key={i} className="text-[11px] text-text-secondary bg-bg-primary px-2 py-1 rounded-md">
                        {obj.length > 50 ? obj.slice(0, 50) + '...' : obj}
                      </span>
                    ))}
                    {client.objectives.length > 3 && (
                      <span className="text-[11px] text-text-muted px-2 py-1">
                        +{client.objectives.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Expanded: files, livrables, notes */}
              {isExpanded && (
                <div className="border-t border-border">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:divide-x divide-border">

                    {/* Left: Files & Livrables */}
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">
                          Fichiers & Livrables
                        </h4>
                        <div>
                          <input
                            ref={(el) => { fileInputRefs.current[client.id] = el; }}
                            type="file"
                            multiple
                            accept=".csv,.pdf,.xlsx,.xls,.docx,.doc"
                            className="hidden"
                            onChange={(e) => handleUpload(client.id, e.target.files)}
                          />
                          <button
                            onClick={() => fileInputRefs.current[client.id]?.click()}
                            disabled={uploadingClient === client.id}
                            className="px-2.5 py-1 text-[10px] font-semibold bg-accent-cyan/10 text-accent-cyan rounded-md hover:bg-accent-cyan/20 disabled:opacity-50 transition-colors"
                          >
                            {uploadingClient === client.id ? 'Upload...' : 'Uploader'}
                          </button>
                        </div>
                      </div>

                      {livrables.length > 0 && (
                        <div className="mb-4">
                          <p className="text-[10px] text-accent-cyan uppercase tracking-wider mb-2">Livrables</p>
                          {livrables.map((f) => (
                            <div key={f.name} className="flex items-center gap-2 py-1.5 px-2 rounded-md hover:bg-bg-hover/50">
                              <span className="text-sm">{FILE_ICONS[f.ext] || '📎'}</span>
                              <span className="text-xs text-text-primary flex-1 truncate">{f.name}</span>
                              <span className="text-[10px] text-text-muted">{formatSize(f.size)}</span>
                              <span className="text-[10px] text-text-muted">{formatDate(f.modified)}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {docs.length > 0 && (
                        <div className="mb-4">
                          <p className="text-[10px] text-text-secondary uppercase tracking-wider mb-2">Documents</p>
                          {docs.map((f) => (
                            <div key={f.name} className="flex items-center gap-2 py-1.5 px-2 rounded-md hover:bg-bg-hover/50">
                              <span className="text-sm">{FILE_ICONS[f.ext] || '📎'}</span>
                              <span className="text-xs text-text-primary flex-1 truncate">{f.name}</span>
                              <span className="text-[10px] text-text-muted">{formatSize(f.size)}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {otherFiles.length > 0 && (
                        <div>
                          <p className="text-[10px] text-text-muted uppercase tracking-wider mb-2">Autres</p>
                          {otherFiles.map((f) => (
                            <div key={f.name} className="flex items-center gap-2 py-1.5 px-2 rounded-md hover:bg-bg-hover/50">
                              <span className="text-sm">📎</span>
                              <span className="text-xs text-text-primary flex-1 truncate">{f.name}</span>
                              <span className="text-[10px] text-text-muted">{formatSize(f.size)}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {files.length === 0 && (
                        <p className="text-xs text-text-muted">Aucun fichier. Dépose des exports crawl, livrables Excel, etc. dans le dossier client.</p>
                      )}

                      <div className="mt-3 pt-3 border-t border-border">
                        <p className="text-[10px] text-text-muted font-mono truncate">{client.cwd}</p>
                      </div>
                    </div>

                    {/* Right: Context & Notes */}
                    <div className="p-5">
                      <h4 className="text-[10px] text-text-muted uppercase tracking-wider font-semibold mb-3">
                        Contexte & Notes
                      </h4>

                      {/* Objectives full list */}
                      {client.objectives.length > 0 && (
                        <div className="mb-4">
                          <p className="text-[10px] text-accent-cyan uppercase tracking-wider mb-2">Objectifs</p>
                          <ul className="space-y-1.5">
                            {client.objectives.map((obj, i) => (
                              <li key={i} className="text-xs text-text-secondary flex items-start gap-2">
                                <span className="text-accent-cyan mt-px">-</span>
                                <span>{obj}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Add note */}
                      <div className="mt-4">
                        <p className="text-[10px] text-text-secondary uppercase tracking-wider mb-2">
                          Ajouter une note au contexte
                        </p>
                        <p className="text-[10px] text-text-muted mb-2">
                          Ajoutée au CLAUDE.md — les agents la verront automatiquement
                        </p>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={noteInput[client.id] || ''}
                            onChange={(e) => setNoteInput(prev => ({ ...prev, [client.id]: e.target.value }))}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleAddNote(client.id); }}
                            placeholder="Ex: RDV client le 20/02, focus maillage catégories..."
                            className="flex-1 bg-bg-input border border-border rounded-lg px-3 py-2 text-xs text-text-primary placeholder-text-muted focus:outline-none focus:border-border-active"
                          />
                          <button
                            onClick={() => handleAddNote(client.id)}
                            disabled={!noteInput[client.id]?.trim() || savingNote}
                            className="px-3 py-2 bg-accent-cyan text-bg-primary text-xs font-semibold rounded-lg hover:opacity-90 disabled:opacity-40 transition-opacity"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="mt-4 pt-3 border-t border-border">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-text-muted">Depuis {client.startDate || '—'}</span>
                          <span className="text-[10px] text-text-muted">
                            {client.hasClaudeMd ? 'CLAUDE.md actif' : 'Pas de CLAUDE.md'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {clients.length === 0 && (
        <div className="text-center py-16">
          <p className="text-text-muted text-sm">Aucun client pour l&apos;instant.</p>
          <p className="text-text-muted text-xs mt-1">Crée ton premier client avec le bouton ci-dessus.</p>
        </div>
      )}
    </div>
  );
}
