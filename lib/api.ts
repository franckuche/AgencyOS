// ── Typed API client ─────────────────────────────────────────────────────────
//
// Wraps all fetch() calls with proper types.
// No backend changes — just a typed layer over the existing REST API.

import type {
  AgentConfig,
  Conversation,
  ConversationMeta,
  ClientInfo,
  SkillInfo,
  SkillDetail,
  McpConfig,
} from './types';

// ── Helpers ──────────────────────────────────────────────────────────────────

async function json<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw Object.assign(new Error(body.error || `HTTP ${res.status}`), { status: res.status, body });
  }
  return res.json();
}

function post(url: string, body: unknown) {
  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

function put(url: string, body: unknown) {
  return fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

function del(url: string) {
  return fetch(url, { method: 'DELETE' });
}

// ── Agents ───────────────────────────────────────────────────────────────────

export const agentsApi = {
  list: () => fetch('/api/agents').then((r) => json<AgentConfig[]>(r)),

  create: (data: {
    name: string;
    role: string;
    emoji: string;
    color: string;
    bio: string;
    skills: { name: string; value: number }[];
    personality: string;
  }) => post('/api/agents', data).then((r) => json<{ id: string }>(r)),

  delete: (id: string) => del(`/api/agents/${id}`),
};

// ── Conversations ────────────────────────────────────────────────────────────

export const conversationsApi = {
  list: () => fetch('/api/conversations').then((r) => json<ConversationMeta[]>(r)),

  get: (id: string) => fetch(`/api/conversations/${id}`).then((r) => json<Conversation>(r)),

  create: (data: { agentId: string; clientId: string | null }) =>
    post('/api/conversations', data).then((r) => json<Conversation>(r)),

  update: (id: string, data: {
    messages: Conversation['messages'];
    agentId: string;
    clientId: string | null;
    title: string;
  }) => put(`/api/conversations/${id}`, data),

  delete: (id: string) => del(`/api/conversations/${id}`),
};

// ── Chat ─────────────────────────────────────────────────────────────────────

export const chatApi = {
  /** Returns raw Response for streaming */
  send: (data: { agentId: string; message: string; clientId: string | null }) =>
    post('/api/chat', data),
};

// ── Clients ──────────────────────────────────────────────────────────────────

export const clientsApi = {
  list: () => fetch('/api/clients').then((r) => json<ClientInfo[]>(r)),

  create: (data: { name: string; sector: string; url: string }) =>
    post('/api/clients/create', data),

  listFiles: (clientId: string) =>
    fetch(`/api/clients/${clientId}/files`).then((r) => json<import('./types').FileInfo[]>(r)),

  addNote: (clientId: string, note: string) =>
    post(`/api/clients/${clientId}/notes`, { note }),

  uploadFiles: (clientId: string, formData: FormData) =>
    fetch(`/api/clients/${clientId}/files`, { method: 'POST', body: formData }),
};

// ── Skills ───────────────────────────────────────────────────────────────────

export const skillsApi = {
  list: (agentId: string) =>
    fetch(`/api/agents/${agentId}/skills`).then((r) => json<SkillInfo[]>(r)),

  get: (agentId: string, slug: string) =>
    fetch(`/api/agents/${agentId}/skills/${slug}`).then((r) => json<SkillDetail>(r)),

  update: (agentId: string, slug: string, content: string) =>
    put(`/api/agents/${agentId}/skills/${slug}`, { content }),

  create: (agentId: string, name: string) =>
    post(`/api/agents/${agentId}/skills`, { name }).then((r) => json<{ slug: string }>(r)),

  delete: (agentId: string, slug: string) =>
    del(`/api/agents/${agentId}/skills/${slug}`),

  split: (agentId: string, slug: string, sections: { heading: string; content: string; newSlug: string }[]) =>
    post(`/api/agents/${agentId}/skills/${slug}/split`, { sections }),
};

// ── Personality ──────────────────────────────────────────────────────────────

export const personalityApi = {
  get: (agentId: string) =>
    fetch(`/api/agents/${agentId}/personality`).then((r) => json<{ content: string }>(r)),

  update: (agentId: string, content: string) =>
    put(`/api/agents/${agentId}/personality`, { content }),
};

// ── MCP ──────────────────────────────────────────────────────────────────────

export const mcpApi = {
  get: (agentId: string) =>
    fetch(`/api/agents/${agentId}/mcp`).then((r) => json<McpConfig>(r)),

  update: (agentId: string, config: McpConfig) =>
    put(`/api/agents/${agentId}/mcp`, config),

  test: (agentId: string, data: {
    name: string;
    type: string;
    command?: string;
    args?: string[];
    url?: string;
    env?: Record<string, string>;
  }) =>
    post(`/api/agents/${agentId}/mcp/test`, data).then((r) => json<{ ok: boolean; message?: string; error?: string }>(r)),

  install: (url: string) =>
    post('/api/mcp/install', { url }).then((r) =>
      json<{
        ok: boolean;
        name?: string;
        command?: string;
        args?: string[];
        envVars?: string[];
        message?: string;
        error?: string;
      }>(r),
    ),
};

// ── Upload (generic, not client-specific) ────────────────────────────────────

export const uploadApi = {
  upload: (formData: FormData) =>
    fetch('/api/upload', { method: 'POST', body: formData }),
};
