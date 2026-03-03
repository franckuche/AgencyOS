import { writeFileSync, existsSync, mkdirSync } from 'fs';
import path from 'path';
import { getAgent } from '@/lib/agents';
import { validateParam } from '@/lib/validation';

interface SplitSection {
  heading: string;
  content: string;
  newSlug: string;
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string; slug: string }> }
) {
  const { id, slug } = await params;
  const bad = validateParam(id) || validateParam(slug, 'slug');
  if (bad) return bad;
  const agent = getAgent(id);
  if (!agent) return Response.json({ error: 'Agent not found' }, { status: 404 });

  const skillsDir = path.join(agent.cwd, 'skills');
  const originalPath = path.join(skillsDir, `${slug}.md`);
  if (!existsSync(originalPath)) {
    return Response.json({ error: 'Skill not found' }, { status: 404 });
  }

  const { sections } = await req.json() as { sections: SplitSection[] };
  if (!sections || sections.length === 0) {
    return Response.json({ error: 'No sections provided' }, { status: 400 });
  }

  if (!existsSync(skillsDir)) mkdirSync(skillsDir, { recursive: true });

  const created: string[] = [];
  for (const section of sections) {
    const newSlug = section.newSlug
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/(^_|_$)/g, '');

    if (!newSlug) continue;

    const newPath = path.join(skillsDir, `${newSlug}.md`);
    if (existsSync(newPath)) continue; // skip if already exists

    writeFileSync(newPath, section.content);
    created.push(newSlug);
  }

  return Response.json({ created });
}
