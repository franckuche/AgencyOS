import { mkdirSync, writeFileSync, existsSync } from 'fs';
import path from 'path';
import { getAgents, getAgentsBase } from '@/lib/agents';

export async function GET() {
  const agents = getAgents();
  return Response.json(agents);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { name, role, emoji, color, bio, skills, personality } = body;

  if (!name?.trim()) {
    return Response.json({ error: 'Name required' }, { status: 400 });
  }

  // Generate id from name
  const id = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  if (!id) {
    return Response.json({ error: 'Invalid name' }, { status: 400 });
  }

  const agentDir = path.join(getAgentsBase(), id);
  if (existsSync(agentDir)) {
    return Response.json({ error: 'Agent already exists' }, { status: 409 });
  }

  // Create directory structure
  mkdirSync(agentDir, { recursive: true });
  mkdirSync(path.join(agentDir, 'skills'), { recursive: true });

  // Write agent.json
  const agentJson = {
    name: name.trim(),
    role: role?.trim() || '',
    quote: '',
    emoji: emoji || '',
    color: color || '#888888',
    bio: bio?.trim() || '',
    skills: skills || [],
  };
  writeFileSync(path.join(agentDir, 'agent.json'), JSON.stringify(agentJson, null, 2) + '\n');

  // Write CLAUDE.md
  const claudeMd = personality?.trim() || `# ${name.trim()}\n\nTu es ${name.trim()}, ${role?.trim() || 'un assistant'}.\n\n## Règles\n\n- Réponds en français\n- Sois direct et concis\n`;
  writeFileSync(path.join(agentDir, 'CLAUDE.md'), claudeMd);

  return Response.json({ id, name: name.trim() }, { status: 201 });
}
