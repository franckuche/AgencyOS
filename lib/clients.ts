import { readdirSync, readFileSync, existsSync, statSync } from 'fs';
import path from 'path';

export interface Client {
  id: string;
  name: string;
  sector: string;
  url: string;
  cwd: string;
  startDate: string;
  objectives: string[];
  hasClaudeMd: boolean;
}

const CLIENTS_BASE = process.env.CLIENTS_DIR || path.join(process.cwd(), 'clients');

function parseClaudeMd(content: string): { sector: string; url: string; startDate: string; objectives: string[] } {
  const sectorMatch = content.match(/\*\*Secteur\*\*\s*:\s*(.+)/);
  const urlMatch = content.match(/\*\*URL\*\*\s*:\s*(.+)/);
  const dateMatch = content.match(/\*\*Date de début\*\*\s*:\s*(.+)/);

  // Extract objectives
  const objectivesSection = content.match(/## Objectifs\n([\s\S]*?)(?=\n## |\n$)/);
  const objectives: string[] = [];
  if (objectivesSection) {
    const lines = objectivesSection[1].split('\n');
    for (const line of lines) {
      const trimmed = line.replace(/^-\s*/, '').trim();
      if (trimmed && !trimmed.startsWith('>')) {
        objectives.push(trimmed);
      }
    }
  }

  return {
    sector: sectorMatch?.[1]?.trim() || '',
    url: urlMatch?.[1]?.trim() || '',
    startDate: dateMatch?.[1]?.trim() || '',
    objectives,
  };
}

function slugToName(slug: string): string {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function getClients(): Client[] {
  if (!existsSync(CLIENTS_BASE)) return [];

  const entries = readdirSync(CLIENTS_BASE);
  const clients: Client[] = [];

  for (const entry of entries) {
    if (entry.startsWith('_') || entry.startsWith('.')) continue;
    const fullPath = path.join(CLIENTS_BASE, entry);
    if (!statSync(fullPath).isDirectory()) continue;

    const claudeMdPath = path.join(fullPath, 'CLAUDE.md');
    const hasClaudeMd = existsSync(claudeMdPath);

    let parsed = { sector: '', url: '', startDate: '', objectives: [] as string[] };
    if (hasClaudeMd) {
      const content = readFileSync(claudeMdPath, 'utf-8');
      parsed = parseClaudeMd(content);
    }

    // Extract name from CLAUDE.md title or slug
    let name = slugToName(entry);
    if (hasClaudeMd) {
      const content = readFileSync(claudeMdPath, 'utf-8');
      const titleMatch = content.match(/# Client\s*:\s*(.+)/);
      if (titleMatch) name = titleMatch[1].trim();
    }

    clients.push({
      id: entry,
      name,
      sector: parsed.sector,
      url: parsed.url,
      cwd: fullPath,
      startDate: parsed.startDate,
      objectives: parsed.objectives,
      hasClaudeMd,
    });
  }

  return clients.sort((a, b) => a.name.localeCompare(b.name));
}

export function getClient(id: string): Client | undefined {
  return getClients().find((c) => c.id === id);
}

export function getClientsBase(): string {
  return CLIENTS_BASE;
}
