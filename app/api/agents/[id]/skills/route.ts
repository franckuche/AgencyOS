import { readdirSync, readFileSync, writeFileSync, statSync, existsSync, mkdirSync } from 'fs';
import path from 'path';
import { getAgent } from '@/lib/agents';

interface SkillInfo {
  name: string;
  slug: string;
  size: number;
  modified: string;
  preview: string;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const agent = getAgent(id);
  if (!agent) return Response.json({ error: 'Agent not found' }, { status: 404 });

  const skillsDir = path.join(agent.cwd, 'skills');
  if (!existsSync(skillsDir)) {
    return Response.json([]);
  }

  const files = readdirSync(skillsDir).filter(f => f.endsWith('.md'));
  const skills: SkillInfo[] = files.map(f => {
    const fullPath = path.join(skillsDir, f);
    const stat = statSync(fullPath);
    const content = readFileSync(fullPath, 'utf-8');
    const firstLine = content.split('\n').find(l => l.trim().startsWith('#'))?.replace(/^#+\s*/, '') || f;
    const preview = content.split('\n').filter(l => l.trim() && !l.startsWith('#')).slice(0, 2).join(' ').slice(0, 120);

    return {
      name: firstLine,
      slug: f.replace('.md', ''),
      size: stat.size,
      modified: stat.mtime.toISOString(),
      preview,
    };
  });

  return Response.json(skills);
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const agent = getAgent(id);
  if (!agent) return Response.json({ error: 'Agent not found' }, { status: 404 });

  const { name, content } = await req.json();
  if (!name?.trim()) return Response.json({ error: 'Name required' }, { status: 400 });

  const skillsDir = path.join(agent.cwd, 'skills');
  if (!existsSync(skillsDir)) mkdirSync(skillsDir, { recursive: true });

  const slug = name.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/(^_|_$)/g, '');

  const filePath = path.join(skillsDir, `${slug}.md`);
  if (existsSync(filePath)) {
    return Response.json({ error: 'Skill already exists' }, { status: 409 });
  }

  const body = content?.trim() || `# ${name}\n\n> Contenu du skill à rédiger.`;
  writeFileSync(filePath, body);

  return Response.json({ slug, name });
}
