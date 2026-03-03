import { readFileSync, writeFileSync, existsSync, rmSync } from 'fs';
import path from 'path';
import { getAgent, getAgentsBase } from '@/lib/agents';
import { validateParam } from '@/lib/validation';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const bad = validateParam(id);
  if (bad) return bad;
  const agent = getAgent(id);
  if (!agent) return Response.json({ error: 'Agent not found' }, { status: 404 });
  return Response.json(agent);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const bad = validateParam(id);
  if (bad) return bad;
  const agentDir = path.join(getAgentsBase(), id);
  const agentJsonPath = path.join(agentDir, 'agent.json');

  if (!existsSync(agentJsonPath)) {
    return Response.json({ error: 'Agent not found' }, { status: 404 });
  }

  const updates = await req.json();
  const current = JSON.parse(readFileSync(agentJsonPath, 'utf-8'));

  // Merge updates into current config
  const merged = { ...current };
  if (updates.name !== undefined) merged.name = updates.name;
  if (updates.role !== undefined) merged.role = updates.role;
  if (updates.quote !== undefined) merged.quote = updates.quote;
  if (updates.emoji !== undefined) merged.emoji = updates.emoji;
  if (updates.color !== undefined) merged.color = updates.color;
  if (updates.avatar !== undefined) merged.avatar = updates.avatar;
  if (updates.bio !== undefined) merged.bio = updates.bio;
  if (updates.skills !== undefined) merged.skills = updates.skills;

  writeFileSync(agentJsonPath, JSON.stringify(merged, null, 2) + '\n');

  return Response.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const bad = validateParam(id);
  if (bad) return bad;
  const agentDir = path.join(getAgentsBase(), id);

  if (!existsSync(agentDir)) {
    return Response.json({ error: 'Agent not found' }, { status: 404 });
  }

  rmSync(agentDir, { recursive: true, force: true });

  return Response.json({ ok: true });
}
