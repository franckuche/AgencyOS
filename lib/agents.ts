import { readdirSync, readFileSync, existsSync, statSync } from 'fs';
import path from 'path';

export interface AgentSkill {
  name: string;
  value: number;
  color?: string;
}

export interface Agent {
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
  cwd: string;
}

interface AgentJson {
  name: string;
  role: string;
  quote?: string;
  emoji?: string;
  color?: string;
  avatar?: string;
  bio?: string;
  skills?: { name: string; value: number; color?: string }[];
}

const AGENTS_BASE = process.env.AGENTS_DIR || path.join(process.cwd(), 'agents');

export function getAgentsBase(): string {
  return AGENTS_BASE;
}

export function getAgents(): Agent[] {
  if (!existsSync(AGENTS_BASE)) return [];

  const entries = readdirSync(AGENTS_BASE);
  const agents: Agent[] = [];

  for (const entry of entries) {
    if (entry.startsWith('_') || entry.startsWith('.')) continue;
    const fullPath = path.join(AGENTS_BASE, entry);
    if (!statSync(fullPath).isDirectory()) continue;

    const agentJsonPath = path.join(fullPath, 'agent.json');
    if (!existsSync(agentJsonPath)) continue;

    try {
      const raw = readFileSync(agentJsonPath, 'utf-8');
      const data: AgentJson = JSON.parse(raw);

      const color = data.color || '#888888';
      const skills: AgentSkill[] = (data.skills || []).map((s) => ({
        name: s.name,
        value: s.value,
        color: s.color || color,
      }));

      agents.push({
        id: entry,
        name: data.name || entry,
        role: data.role || '',
        quote: data.quote || '',
        emoji: data.emoji || '',
        color,
        statusColor: color,
        avatar: data.avatar,
        bio: data.bio,
        skills,
        cwd: fullPath,
      });
    } catch {
      // Invalid agent.json, skip
    }
  }

  return agents.sort((a, b) => a.name.localeCompare(b.name));
}

export function getAgent(id: string): Agent | undefined {
  return getAgents().find((a) => a.id === id);
}
