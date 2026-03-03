import { readFileSync, writeFileSync, existsSync } from 'fs';
import path from 'path';
import { getAgent } from '@/lib/agents';
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

  const claudeMdPath = path.join(agent.cwd, 'CLAUDE.md');
  if (!existsSync(claudeMdPath)) {
    return Response.json({ content: '' });
  }

  const content = readFileSync(claudeMdPath, 'utf-8');
  return Response.json({ content });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const bad = validateParam(id);
  if (bad) return bad;
  const agent = getAgent(id);
  if (!agent) return Response.json({ error: 'Agent not found' }, { status: 404 });

  const { content } = await req.json();
  if (content === undefined) return Response.json({ error: 'Content required' }, { status: 400 });

  const claudeMdPath = path.join(agent.cwd, 'CLAUDE.md');
  writeFileSync(claudeMdPath, content);

  return Response.json({ ok: true });
}
