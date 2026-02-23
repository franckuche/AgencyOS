import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), '.data', 'history');

function getHistoryPath(agentId: string): string {
  return path.join(DATA_DIR, `${agentId}.json`);
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ agentId: string }> }
) {
  const { agentId } = await params;
  const filePath = getHistoryPath(agentId);

  if (!existsSync(filePath)) {
    return Response.json([]);
  }

  try {
    const data = JSON.parse(readFileSync(filePath, 'utf-8'));
    return Response.json(data);
  } catch {
    return Response.json([]);
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ agentId: string }> }
) {
  const { agentId } = await params;
  const { messages } = await req.json();

  if (!Array.isArray(messages)) {
    return Response.json({ error: 'messages array required' }, { status: 400 });
  }

  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }

  const filePath = getHistoryPath(agentId);
  writeFileSync(filePath, JSON.stringify(messages, null, 2));

  return Response.json({ ok: true, count: messages.length });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ agentId: string }> }
) {
  const { agentId } = await params;
  const filePath = getHistoryPath(agentId);

  if (existsSync(filePath)) {
    require('fs').unlinkSync(filePath);
  }

  return Response.json({ ok: true });
}
