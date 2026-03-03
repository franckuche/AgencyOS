import { readFileSync, writeFileSync, existsSync, unlinkSync, lstatSync, realpathSync } from 'fs';
import path from 'path';
import { getAgent } from '@/lib/agents';
import { validateParam } from '@/lib/validation';

function getSkillPath(agentCwd: string, slug: string): string {
  return path.join(agentCwd, 'skills', `${slug}.md`);
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string; slug: string }> }
) {
  const { id, slug } = await params;
  const bad = validateParam(id) || validateParam(slug, 'slug');
  if (bad) return bad;
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
  const bad = validateParam(id) || validateParam(slug, 'slug');
  if (bad) return bad;
  const agent = getAgent(id);
  if (!agent) return Response.json({ error: 'Agent not found' }, { status: 404 });

  const { content } = await req.json();
  if (content === undefined) return Response.json({ error: 'Content required' }, { status: 400 });

  const filePath = getSkillPath(agent.cwd, slug);
  if (!existsSync(filePath)) {
    return Response.json({ error: 'Skill not found' }, { status: 404 });
  }

  // Resolve symlink — write to the actual file
  const realPath = realpathSync(filePath);
  writeFileSync(realPath, content);

  return Response.json({ ok: true });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string; slug: string }> }
) {
  const { id, slug } = await params;
  const bad = validateParam(id) || validateParam(slug, 'slug');
  if (bad) return bad;
  const agent = getAgent(id);
  if (!agent) return Response.json({ error: 'Agent not found' }, { status: 404 });

  const { title, content } = await req.json();
  if (!title?.trim() || !content?.trim()) {
    return Response.json({ error: 'Title and content required' }, { status: 400 });
  }

  const filePath = getSkillPath(agent.cwd, slug);
  if (!existsSync(filePath)) {
    return Response.json({ error: 'Skill not found' }, { status: 404 });
  }

  const realPath = realpathSync(filePath);
  const existing = readFileSync(realPath, 'utf-8');
  const date = new Date().toISOString().split('T')[0];
  const block = `\n\n---\n\n## ${title.trim()} — ${date}\n\n${content.trim()}\n`;
  writeFileSync(realPath, existing + block);

  return Response.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string; slug: string }> }
) {
  const { id, slug } = await params;
  const bad = validateParam(id) || validateParam(slug, 'slug');
  if (bad) return bad;
  const agent = getAgent(id);
  if (!agent) return Response.json({ error: 'Agent not found' }, { status: 404 });

  const filePath = getSkillPath(agent.cwd, slug);
  if (!existsSync(filePath)) {
    return Response.json({ error: 'Skill not found' }, { status: 404 });
  }

  unlinkSync(filePath);
  return Response.json({ ok: true });
}
