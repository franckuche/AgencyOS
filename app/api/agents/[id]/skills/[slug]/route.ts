import { readFileSync, writeFileSync, existsSync, unlinkSync, lstatSync } from 'fs';
import path from 'path';
import { getAgent } from '@/lib/agents';

function getSkillPath(agentCwd: string, slug: string): string {
  return path.join(agentCwd, 'skills', `${slug}.md`);
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string; slug: string }> }
) {
  const { id, slug } = await params;
  const agent = getAgent(id);
  if (!agent) return Response.json({ error: 'Agent not found' }, { status: 404 });

  const filePath = getSkillPath(agent.cwd, slug);
  if (!existsSync(filePath)) {
    return Response.json({ error: 'Skill not found' }, { status: 404 });
  }

  const content = readFileSync(filePath, 'utf-8');
  const isSymlink = lstatSync(filePath).isSymbolicLink();

  return Response.json({ slug, content, isSymlink });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string; slug: string }> }
) {
  const { id, slug } = await params;
  const agent = getAgent(id);
  if (!agent) return Response.json({ error: 'Agent not found' }, { status: 404 });

  const { content } = await req.json();
  if (content === undefined) return Response.json({ error: 'Content required' }, { status: 400 });

  const filePath = getSkillPath(agent.cwd, slug);
  if (!existsSync(filePath)) {
    return Response.json({ error: 'Skill not found' }, { status: 404 });
  }

  // Resolve symlink — write to the actual file
  const realPath = require('fs').realpathSync(filePath);
  writeFileSync(realPath, content);

  return Response.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string; slug: string }> }
) {
  const { id, slug } = await params;
  const agent = getAgent(id);
  if (!agent) return Response.json({ error: 'Agent not found' }, { status: 404 });

  const filePath = getSkillPath(agent.cwd, slug);
  if (!existsSync(filePath)) {
    return Response.json({ error: 'Skill not found' }, { status: 404 });
  }

  unlinkSync(filePath);
  return Response.json({ ok: true });
}
