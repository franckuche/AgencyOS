'use client';

import { useState, useEffect, useCallback } from 'react';
import { mcpApi } from '@/lib/api';
import McpServerCard from '../McpServerCard';
import McpServerForm from '../McpServerForm';
import type { AgentConfig, McpConfig, McpServer } from '@/lib/types';

interface McpServicesTabProps {
  agent: AgentConfig;
}

const emptyForm: McpFormState = { name: '', type: 'stdio', command: '', args: '', url: '', env: '' };

type McpFormState = { name: string; type: 'stdio' | 'http'; command: string; args: string; url: string; env: string };

export default function McpServicesTab({ agent }: McpServicesTabProps) {
  const [mcpConfig, setMcpConfig] = useState<McpConfig>({ servers: {} });
  const [showAddMcp, setShowAddMcp] = useState(false);
  const [mcpForm, setMcpForm] = useState(emptyForm);
  const [mcpTestResult, setMcpTestResult] = useState<{ ok: boolean; message?: string; error?: string } | null>(null);
  const [mcpTesting, setMcpTesting] = useState<string | false>(false);
  const [mcpInstalling, setMcpInstalling] = useState(false);
  const [mcpInstallUrl, setMcpInstallUrl] = useState('');
  const [mcpInstallResult, setMcpInstallResult] = useState<{ ok: boolean; message?: string; error?: string } | null>(null);
  const [editingMcp, setEditingMcp] = useState<string | null>(null);
  const [editMcpForm, setEditMcpForm] = useState({ command: '', args: '', url: '', env: '', type: 'stdio' as 'stdio' | 'http' });

  const fetchMcp = useCallback(async () => {
    try {
      const data = await mcpApi.get(agent.id);
      setMcpConfig(data || { servers: {} });
    } catch {
      setMcpConfig({ servers: {} });
    }
  }, [agent.id]);

  useEffect(() => {
    fetchMcp();
    setEditingMcp(null);
    setShowAddMcp(false);
  }, [agent.id, fetchMcp]);

  const saveMcp = async (config: McpConfig) => {
    try {
      await mcpApi.update(agent.id, config);
      setMcpConfig(config);
    } catch {
      // silently fail
    }
  };

  const toggleMcpServer = (name: string) => {
    const server = mcpConfig.servers[name];
    if (server) {
      const newConfig = {
        ...mcpConfig,
        servers: { ...mcpConfig.servers, [name]: { ...server, enabled: !server.enabled } },
      };
      saveMcp(newConfig);
    }
  };

  const removeMcpServer = (name: string) => {
    const { [name]: _, ...rest } = mcpConfig.servers;
    saveMcp({ ...mcpConfig, servers: rest });
  };

  const testMcpServer = async (
    serverName: string,
    serverData: { type: string; command?: string; args?: string[]; url?: string; env?: Record<string, string> },
  ) => {
    setMcpTesting(serverName);
    setMcpTestResult(null);
    try {
      const data = await mcpApi.test(agent.id, {
        name: serverName,
        type: serverData.type,
        command: serverData.command,
        args: serverData.args,
        url: serverData.url,
        env: serverData.env,
      });
      setMcpTestResult(data);
    } catch {
      setMcpTestResult({ ok: false, error: 'Erreur reseau' });
    } finally {
      setMcpTesting(false);
    }
  };

  const addMcpServer = () => {
    if (!mcpForm.name.trim()) return;
    const server: McpServer = { type: mcpForm.type, enabled: true };
    if (mcpForm.type === 'stdio') {
      server.command = mcpForm.command;
      server.args = mcpForm.args.split(/\s+/).filter(Boolean);
    } else {
      server.url = mcpForm.url;
    }
    if (mcpForm.env.trim()) {
      try { server.env = JSON.parse(mcpForm.env); } catch { /* ignore */ }
    }
    saveMcp({ ...mcpConfig, servers: { ...mcpConfig.servers, [mcpForm.name]: server } });
    setMcpForm(emptyForm);
    setShowAddMcp(false);
  };

  const installMcpFromGithub = async () => {
    if (!mcpInstallUrl.trim()) return;
    setMcpInstalling(true);
    setMcpInstallResult(null);
    try {
      const data = await mcpApi.install(mcpInstallUrl.trim());
      if (data.ok) {
        setMcpForm({
          name: data.name || '',
          type: 'stdio',
          command: data.command || 'node',
          args: (data.args || []).join(' '),
          url: '',
          env: data.envVars?.length
            ? JSON.stringify(Object.fromEntries(data.envVars.map((v: string) => [v, ''])), null, 2)
            : '',
        });
        setMcpInstallResult({ ok: true, message: `${data.message} — remplis les variables d'env puis clique Ajouter` });
        setShowAddMcp(true);
      } else {
        setMcpInstallResult({ ok: false, error: data.error || 'Erreur inconnue' });
      }
    } catch {
      setMcpInstallResult({ ok: false, error: 'Erreur reseau' });
    } finally {
      setMcpInstalling(false);
    }
  };

  const startEditMcp = (name: string) => {
    const server = mcpConfig.servers[name];
    if (!server) return;
    setEditingMcp(name);
    setEditMcpForm({
      type: server.type,
      command: server.command || '',
      args: (server.args || []).join(' '),
      url: server.url || '',
      env: server.env ? JSON.stringify(server.env, null, 2) : '',
    });
    setMcpTestResult(null);
  };

  const saveEditMcp = () => {
    if (!editingMcp) return;
    const server: McpServer = { type: editMcpForm.type, enabled: mcpConfig.servers[editingMcp]?.enabled !== false };
    if (editMcpForm.type === 'stdio') {
      server.command = editMcpForm.command;
      server.args = editMcpForm.args.split(/\s+/).filter(Boolean);
    } else {
      server.url = editMcpForm.url;
    }
    if (editMcpForm.env.trim()) {
      try { server.env = JSON.parse(editMcpForm.env); } catch { /* ignore */ }
    }
    saveMcp({ ...mcpConfig, servers: { ...mcpConfig.servers, [editingMcp]: server } });
    setEditingMcp(null);
  };

  const mcpServerNames = Object.keys(mcpConfig.servers || {});

  return (
    <>
      {/* Left panel: server list + install */}
      <div className="w-72 border-r border-border bg-bg-primary flex flex-col flex-shrink-0">
        <div className="flex-1 overflow-y-auto">
          <div className="p-3 space-y-2">
            {/* Install from GitHub */}
            <div className="relative flex gap-1.5">
              <div className="relative flex-1">
                <svg
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted"
                  width="14" height="14" viewBox="0 0 24 24" fill="currentColor"
                >
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <input
                  type="text"
                  value={mcpInstallUrl}
                  onChange={(e) => { setMcpInstallUrl(e.target.value); setMcpInstallResult(null); }}
                  onKeyDown={(e) => e.key === 'Enter' && installMcpFromGithub()}
                  placeholder="URL GitHub..."
                  className="w-full bg-bg-hover border-none rounded-lg pl-8 pr-3 py-2 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-border-active"
                />
              </div>
              <button
                onClick={installMcpFromGithub}
                disabled={mcpInstalling || !mcpInstallUrl.trim()}
                className="px-3 py-2 rounded-lg text-xs font-medium bg-accent-cyan/20 text-accent-cyan hover:bg-accent-cyan/30 disabled:opacity-30 transition-colors whitespace-nowrap flex items-center gap-1.5"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                {mcpInstalling ? '...' : 'Installer'}
              </button>
            </div>
            {mcpInstallResult && (
              <div className={`text-[11px] rounded-lg px-2.5 py-1.5 animate-scale-in ${
                mcpInstallResult.ok
                  ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                  : 'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}>
                {mcpInstallResult.ok ? mcpInstallResult.message : mcpInstallResult.error}
              </div>
            )}
            <button
              onClick={() => setShowAddMcp(true)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-dashed border-border text-xs text-text-muted hover:text-text-secondary hover:border-text-muted transition-colors"
            >
              <span className="text-sm leading-none">+</span> Config manuelle
            </button>
          </div>
          {mcpServerNames.length === 0 ? (
            <div className="px-4 py-8 text-center text-text-muted text-sm">
              Aucun service MCP
              <div className="text-xs mt-2">
                Connecte {agent.name} a des outils externes
              </div>
            </div>
          ) : (
            <div className="px-2 pb-3 space-y-1.5">
              {mcpServerNames.map((name) => (
                <McpServerCard
                  key={name}
                  name={name}
                  server={mcpConfig.servers[name]}
                  isEditing={editingMcp === name}
                  isTesting={mcpTesting === name}
                  onToggle={() => toggleMcpServer(name)}
                  onEdit={() => startEditMcp(name)}
                  onDelete={() => removeMcpServer(name)}
                  onTest={() => testMcpServer(name, mcpConfig.servers[name])}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right panel: form or empty */}
      <div className="flex-1 flex flex-col bg-[#0D1117]">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-bg-primary">
          <div className="flex items-center gap-3">
            <svg className="text-text-muted flex-shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
            </svg>
            <span className="text-sm font-medium text-text-primary">MCP Servers</span>
            <span className="text-xs text-text-muted">Services pour {agent.name}</span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {showAddMcp ? (
            <McpServerForm
              title="Ajouter un service MCP"
              showNameField
              agentId={agent.id}
              formState={mcpForm}
              onChange={(update) => setMcpForm({ ...mcpForm, ...update })}
              testResult={mcpTestResult}
              isTesting={mcpTesting !== false}
              onTest={() => {
                const args = mcpForm.args.split(/\s+/).filter(Boolean);
                let env: Record<string, string> | undefined;
                if (mcpForm.env.trim()) { try { env = JSON.parse(mcpForm.env); } catch { /* ignore */ } }
                testMcpServer(mcpForm.name || 'test', { type: mcpForm.type, command: mcpForm.command, args, url: mcpForm.url, env });
              }}
              onSave={addMcpServer}
              onCancel={() => { setShowAddMcp(false); setMcpTestResult(null); setMcpForm(emptyForm); }}
              saveLabel="Ajouter"
              disableSave={!mcpForm.name.trim()}
            />
          ) : editingMcp ? (
            <McpServerForm
              title={`Modifier \u00ab ${editingMcp} \u00bb`}
              agentId={agent.id}
              formState={editMcpForm}
              onChange={(update) => setEditMcpForm({ ...editMcpForm, ...update })}
              testResult={mcpTestResult}
              isTesting={mcpTesting !== false}
              onTest={() => {
                const args = editMcpForm.args.split(/\s+/).filter(Boolean);
                let env: Record<string, string> | undefined;
                if (editMcpForm.env.trim()) { try { env = JSON.parse(editMcpForm.env); } catch { /* ignore */ } }
                testMcpServer(editingMcp, { type: editMcpForm.type, command: editMcpForm.command, args, url: editMcpForm.url, env });
              }}
              onSave={saveEditMcp}
              onCancel={() => { setEditingMcp(null); setMcpTestResult(null); }}
              saveLabel="Sauvegarder"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-text-muted text-sm">
              <div className="text-center">
                <svg className="mx-auto mb-4 opacity-20" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
                </svg>
                {mcpServerNames.length > 0 ? (
                  <p>Clique sur un service pour le modifier</p>
                ) : (
                  <>
                    <p>Connecte des services MCP</p>
                    <p className="text-xs mt-2">Colle une URL GitHub ou ajoute manuellement</p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
