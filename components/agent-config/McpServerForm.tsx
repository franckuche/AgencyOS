'use client';

import { useState, useRef } from 'react';

interface McpServerFormProps {
  title: string;
  showNameField?: boolean;
  agentId?: string;
  formState: {
    name?: string;
    type: 'stdio' | 'http';
    command: string;
    args: string;
    url: string;
    env: string;
  };
  onChange: (update: Partial<McpServerFormProps['formState']>) => void;
  testResult: { ok: boolean; message?: string; error?: string } | null;
  isTesting: boolean;
  onTest: () => void;
  onSave: () => void;
  onCancel: () => void;
  saveLabel?: string;
  disableSave?: boolean;
}

export default function McpServerForm({
  title,
  showNameField = false,
  agentId,
  formState,
  onChange,
  testResult,
  isTesting,
  onTest,
  onSave,
  onCancel,
  saveLabel = 'Ajouter',
  disableSave = false,
}: McpServerFormProps) {
  const [uploadedFile, setUploadedFile] = useState<{ name: string; path: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!agentId) return;
    setUploading(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append('files', file);
      formData.append('agentId', agentId);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.files?.[0]) {
        const uploaded = data.files[0];
        setUploadedFile({ name: uploaded.name, path: uploaded.path });

        // Auto-inject file path into env vars
        // Parse the uploaded JSON to detect credential type
        let envKey = 'GOOGLE_APPLICATION_CREDENTIALS';
        try {
          const fileContent = await file.text();
          const parsed = JSON.parse(fileContent);
          if (parsed.installed || parsed.web) {
            // OAuth client secret file (has "installed" or "web" key)
            envKey = 'GSC_OAUTH_CLIENT_SECRETS_FILE';
          } else if (parsed.type === 'service_account') {
            // Service account key file
            envKey = 'GOOGLE_APPLICATION_CREDENTIALS';
          }
        } catch {
          // Can't parse, keep default
        }
        try {
          const existing = formState.env.trim() ? JSON.parse(formState.env) : {};
          existing[envKey] = uploaded.path;
          onChange({ env: JSON.stringify(existing, null, 2) });
        } catch {
          onChange({ env: JSON.stringify({ [envKey]: uploaded.path }, null, 2) });
        }
      } else {
        setUploadError(data.error || 'Erreur upload');
      }
    } catch {
      setUploadError('Erreur reseau');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-md space-y-4 animate-scale-in">
      <h3 className="text-sm font-medium text-text-primary">{title}</h3>
      {showNameField && (
        <div>
          <label className="text-xs text-text-muted block mb-1">Nom</label>
          <input
            type="text"
            value={formState.name || ''}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="search-console"
            className="w-full bg-bg-hover border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-active"
          />
        </div>
      )}
      <div>
        <label className="text-xs text-text-muted block mb-1">Type</label>
        <div className="flex gap-2">
          <button
            onClick={() => onChange({ type: 'stdio' })}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
              formState.type === 'stdio' ? 'bg-accent-cyan/20 text-accent-cyan' : 'bg-bg-hover text-text-muted'
            }`}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="4 17 10 11 4 5" />
              <line x1="12" y1="19" x2="20" y2="19" />
            </svg>
            stdio
          </button>
          <button
            onClick={() => onChange({ type: 'http' })}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
              formState.type === 'http' ? 'bg-accent-cyan/20 text-accent-cyan' : 'bg-bg-hover text-text-muted'
            }`}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            http
          </button>
        </div>
      </div>
      {formState.type === 'stdio' ? (
        <>
          <div>
            <label className="text-xs text-text-muted block mb-0.5">Commande</label>
            <p className="text-[10px] text-text-muted mb-1.5">Executable a lancer (npx, node, python...)</p>
            <input
              type="text"
              value={formState.command}
              onChange={(e) => onChange({ command: e.target.value })}
              placeholder="npx"
              className="w-full bg-bg-hover border border-border rounded-lg px-3 py-2 text-sm text-text-primary font-mono placeholder:text-text-muted focus:outline-none focus:border-border-active"
            />
          </div>
          <div>
            <label className="text-xs text-text-muted block mb-0.5">Arguments</label>
            <p className="text-[10px] text-text-muted mb-1.5">Separes par des espaces</p>
            <input
              type="text"
              value={formState.args}
              onChange={(e) => onChange({ args: e.target.value })}
              placeholder="@anthropic/mcp-search-console"
              className="w-full bg-bg-hover border border-border rounded-lg px-3 py-2 text-sm text-text-primary font-mono placeholder:text-text-muted focus:outline-none focus:border-border-active"
            />
          </div>
        </>
      ) : (
        <div>
          <label className="text-xs text-text-muted block mb-0.5">URL</label>
          <p className="text-[10px] text-text-muted mb-1.5">Endpoint HTTP du serveur MCP</p>
          <input
            type="text"
            value={formState.url}
            onChange={(e) => onChange({ url: e.target.value })}
            placeholder="https://mcp.example.com/mcp"
            className="w-full bg-bg-hover border border-border rounded-lg px-3 py-2 text-sm text-text-primary font-mono placeholder:text-text-muted focus:outline-none focus:border-border-active"
          />
        </div>
      )}
      {/* Credentials file upload */}
      {agentId && (
        <div>
          <label className="flex items-center gap-1.5 text-xs text-text-muted mb-0.5">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Fichier d&apos;identifiants (optionnel)
          </label>
          <p className="text-[10px] text-text-muted mb-1.5">
            client_secrets.json, credentials.json, service_account.json...
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
              e.target.value = '';
            }}
          />
          {uploadedFile ? (
            <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2 text-xs">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-400 flex-shrink-0">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span className="text-green-400 truncate flex-1">{uploadedFile.name}</span>
              <button
                onClick={() => { setUploadedFile(null); fileInputRef.current?.click(); }}
                className="text-text-muted hover:text-text-secondary text-[10px]"
              >
                Changer
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-dashed border-border text-xs text-text-muted hover:text-text-secondary hover:border-text-muted transition-colors"
            >
              {uploading ? (
                <span>Upload en cours...</span>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  Uploader un fichier JSON
                </>
              )}
            </button>
          )}
          {uploadError && (
            <p className="text-[10px] text-red-400 mt-1">{uploadError}</p>
          )}
        </div>
      )}

      <div>
        <label className="flex items-center gap-1.5 text-xs text-text-muted mb-0.5">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          Variables d&apos;env (JSON, optionnel)
        </label>
        <p className="text-[10px] text-text-muted mb-1.5">Cles API et secrets necessaires</p>
        <textarea
          value={formState.env}
          onChange={(e) => onChange({ env: e.target.value })}
          placeholder='{"API_KEY": "..."}'
          rows={formState.env ? 4 : 3}
          className="w-full bg-bg-hover border border-border rounded-lg px-3 py-2 text-sm text-text-primary font-mono placeholder:text-text-muted focus:outline-none focus:border-border-active resize-none"
        />
      </div>
      {testResult && (
        <div className={`text-xs rounded-lg px-3 py-2 animate-scale-in ${
          testResult.ok
            ? 'bg-green-500/10 text-green-400 border border-green-500/20'
            : 'bg-red-500/10 text-red-400 border border-red-500/20'
        }`}>
          {testResult.ok ? testResult.message : testResult.error}
        </div>
      )}
      <div className="flex gap-2">
        <button
          onClick={onTest}
          disabled={isTesting || (!formState.command && !formState.url)}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 disabled:opacity-30 transition-colors"
        >
          {isTesting ? 'Test...' : 'Tester'}
        </button>
        <button
          onClick={onSave}
          disabled={disableSave}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-accent-cyan/20 text-accent-cyan hover:bg-accent-cyan/30 disabled:opacity-30 transition-colors"
        >
          {saveLabel}
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
