// ── Shared types for the QG app ──────────────────────────────────────────────

// ── Agents ───────────────────────────────────────────────────────────────────

export interface AgentSkill {
  name: string;
  value: number;
  color?: string;
}

/** Client-side agent config (no cwd — that's server-only) */
export interface AgentConfig {
  id: string;
  name: string;
  role: string;
  quote: string;
  emoji: string;
  color: string;
  statusColor: string;
  avatar?: string;
  bio?: string;
  skills: AgentSkill[];
}

// ── Chat ─────────────────────────────────────────────────────────────────────

export interface ToolCall {
  name: string;
  input: Record<string, unknown>;
  result?: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  clientId?: string | null;
  thinking?: string;
  toolCalls?: ToolCall[];
}

// ── Conversations ────────────────────────────────────────────────────────────

export interface ConversationMeta {
  id: string;
  title: string;
  agentId: string;
  clientId: string | null;
  updatedAt: string;
  messageCount: number;
}

export interface Conversation extends ConversationMeta {
  messages: Message[];
  createdAt: string;
}

// ── Clients ──────────────────────────────────────────────────────────────────

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

/** Lightweight subset used by components that only need id/name/sector/url */
export type ClientSummary = Pick<ClientInfo, 'id' | 'name' | 'sector' | 'url'>;

export interface FileInfo {
  name: string;
  type: 'file' | 'dir';
  size: number;
  modified: string;
  ext: string;
}

// ── Skills ───────────────────────────────────────────────────────────────────

export interface SkillInfo {
  name: string;
  slug: string;
  size: number;
  modified: string;
  preview: string;
  category?: string;
}

export interface SkillDetail {
  slug: string;
  content: string;
  isSymlink: boolean;
}

// ── MCP ──────────────────────────────────────────────────────────────────────

export interface McpServer {
  type: 'stdio' | 'http';
  command?: string;
  args?: string[];
  url?: string;
  headers?: Record<string, string>;
  env?: Record<string, string>;
  enabled?: boolean;
}

export interface McpConfig {
  servers: Record<string, McpServer>;
}

// ── Files / Uploads ──────────────────────────────────────────────────────────

export interface UploadedFile {
  name: string;
  size: number;
  path: string;
}

// ── Navigation ───────────────────────────────────────────────────────────────

export type AppView = 'chat' | 'clients' | 'config';
