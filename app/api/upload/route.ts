import { existsSync, mkdirSync, writeFileSync } from 'fs';
import path from 'path';
import { getAgent } from '@/lib/agents';

const FALLBACK_DIR = path.join(process.cwd(), '.data', 'uploads');
const ALLOWED_EXTENSIONS = ['.csv', '.pdf', '.xlsx', '.xls', '.docx', '.doc', '.txt', '.json', '.html', '.xml'];
const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500 Mo

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

export async function POST(req: Request) {
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return Response.json({ error: 'Invalid form data' }, { status: 400 });
  }

  const files = formData.getAll('files') as File[];
  const agentId = formData.get('agentId') as string | null;

  if (files.length === 0) {
    return Response.json({ error: 'No files provided' }, { status: 400 });
  }

  // Determine upload directory: agent's cwd/uploads/ if agentId provided, else fallback
  let uploadDir = FALLBACK_DIR;
  if (agentId) {
    const agent = getAgent(agentId);
    if (agent) {
      uploadDir = path.join(agent.cwd, 'uploads');
    }
  }

  if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir, { recursive: true });
  }

  const saved: { name: string; size: number; path: string }[] = [];
  const errors: string[] = [];

  for (const file of files) {
    const ext = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      errors.push(`${file.name} : type non autorisé (${ext})`);
      continue;
    }
    if (file.size > MAX_FILE_SIZE) {
      errors.push(`${file.name} : trop volumineux (${(file.size / 1024 / 1024).toFixed(1)} Mo, max 500 Mo)`);
      continue;
    }

    const destPath = getUniquePath(uploadDir, file.name);
    const buffer = Buffer.from(await file.arrayBuffer());
    writeFileSync(destPath, buffer);

    saved.push({ name: path.basename(destPath), size: file.size, path: destPath });
  }

  if (saved.length === 0 && errors.length > 0) {
    return Response.json({ error: errors.join('; ') }, { status: 400 });
  }

  return Response.json({ files: saved, errors });
}
