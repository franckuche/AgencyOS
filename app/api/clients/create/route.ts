import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'fs';
import path from 'path';
import { getClientsBase } from '@/lib/clients';

export async function POST(req: Request) {
  const { name, sector, url } = await req.json();

  if (!name) {
    return Response.json({ error: 'Name is required' }, { status: 400 });
  }

  const slug = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const clientDir = path.join(getClientsBase(), slug);

  if (existsSync(clientDir)) {
    return Response.json({ error: 'Client already exists' }, { status: 409 });
  }

  // Read template
  const templatePath = path.join(getClientsBase(), '_template', 'CLAUDE.md');
  let template = existsSync(templatePath)
    ? readFileSync(templatePath, 'utf-8')
    : '# Client : [NOM DU CLIENT]\n';

  // Fill template
  template = template.replace('[NOM DU CLIENT]', name);
  if (sector) {
    template = template.replace(/(\*\*Secteur\*\*\s*:).*/, `$1 ${sector}`);
  }
  if (url) {
    template = template.replace(/(\*\*URL\*\*\s*:).*/, `$1 ${url}`);
  }
  const today = new Date().toISOString().slice(0, 7);
  template = template.replace(/(\*\*Date de début\*\*\s*:).*/, `$1 ${today}`);

  mkdirSync(clientDir, { recursive: true });
  writeFileSync(path.join(clientDir, 'CLAUDE.md'), template);

  return Response.json({ id: slug, name, cwd: clientDir });
}
