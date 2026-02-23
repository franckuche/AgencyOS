import { readdirSync, statSync, existsSync, mkdirSync, writeFileSync } from 'fs';
import path from 'path';
import { getClient } from '@/lib/clients';

const ALLOWED_EXTENSIONS = ['.csv', '.pdf', '.xlsx', '.xls', '.docx', '.doc'];
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 Mo

interface FileInfo {
  name: string;
  type: 'file' | 'dir';
  size: number;
  modified: string;
  ext: string;
}

function getIcon(ext: string): string {
  const icons: Record<string, string> = {
    xlsx: 'excel', xls: 'excel', csv: 'excel',
    pdf: 'pdf',
    md: 'doc', txt: 'doc', doc: 'doc', docx: 'doc',
    png: 'img', jpg: 'img', jpeg: 'img', svg: 'img', webp: 'img',
    json: 'code', html: 'code', xml: 'code',
  };
  return icons[ext] || 'file';
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const client = getClient(id);
  if (!client) {
    return Response.json({ error: 'Client not found' }, { status: 404 });
  }

  if (!existsSync(client.cwd)) {
    return Response.json([]);
  }

  const entries = readdirSync(client.cwd);
  const files: FileInfo[] = [];

  for (const entry of entries) {
    if (entry.startsWith('.')) continue;
    const fullPath = path.join(client.cwd, entry);
    const stat = statSync(fullPath);
    const ext = path.extname(entry).slice(1).toLowerCase();

    files.push({
      name: entry,
      type: stat.isDirectory() ? 'dir' : 'file',
      size: stat.size,
      modified: stat.mtime.toISOString(),
      ext,
    });
  }

  // Sort: dirs first, then by modification date desc
  files.sort((a, b) => {
    if (a.type !== b.type) return a.type === 'dir' ? -1 : 1;
    return new Date(b.modified).getTime() - new Date(a.modified).getTime();
  });

  return Response.json(files);
}

function getUniquePath(dir: string, filename: string): string {
  const ext = path.extname(filename);
  const base = path.basename(filename, ext);
  let candidate = path.join(dir, filename);
  let counter = 1;
  while (existsSync(candidate)) {
    counter++;
    candidate = path.join(dir, `${base}_${counter}${ext}`);
  }
  return candidate;
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const client = getClient(id);
  if (!client) {
    return Response.json({ error: 'Client not found' }, { status: 404 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return Response.json({ error: 'Invalid form data' }, { status: 400 });
  }

  const files = formData.getAll('files') as File[];
  if (files.length === 0) {
    return Response.json({ error: 'No files provided' }, { status: 400 });
  }

  // Ensure client directory exists
  if (!existsSync(client.cwd)) {
    mkdirSync(client.cwd, { recursive: true });
  }

  const saved: { name: string; size: number }[] = [];
  const errors: string[] = [];

  for (const file of files) {
    const ext = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      errors.push(`${file.name} : type non autorisé (${ext})`);
      continue;
    }
    if (file.size > MAX_FILE_SIZE) {
      errors.push(`${file.name} : trop volumineux (${(file.size / 1024 / 1024).toFixed(1)} Mo, max 50 Mo)`);
      continue;
    }

    const destPath = getUniquePath(client.cwd, file.name);
    const buffer = Buffer.from(await file.arrayBuffer());
    writeFileSync(destPath, buffer);

    saved.push({ name: path.basename(destPath), size: file.size });
  }

  if (saved.length === 0 && errors.length > 0) {
    return Response.json({ error: errors.join('; ') }, { status: 400 });
  }

  return Response.json({ files: saved, errors });
}
