import { existsSync, readFileSync, writeFileSync, unlinkSync } from 'fs';
import path from 'path';
import type { Conversation } from '../route';

const CONV_DIR = path.join(process.cwd(), '.data', 'conversations');

function getPath(id: string): string {
  return path.join(CONV_DIR, `${id}.json`);
}

function loadConv(id: string): Conversation | null {
  const fp = getPath(id);
  if (!existsSync(fp)) return null;
  try {
    return JSON.parse(readFileSync(fp, 'utf-8'));
  } catch {
    return null;
  }
}

function saveConv(conv: Conversation) {
  writeFileSync(getPath(conv.id), JSON.stringify(conv, null, 2));
}

// GET /api/conversations/[id] — full conversation with messages
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const conv = loadConv(id);
  if (!conv) {
    return Response.json({ error: 'Not found' }, { status: 404 });
  }
  return Response.json(conv);
}

// PUT /api/conversations/[id] — update conversation
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const conv = loadConv(id);
  if (!conv) {
    return Response.json({ error: 'Not found' }, { status: 404 });
  }

  const body = await req.json();

  if (body.agentId !== undefined) conv.agentId = body.agentId;
  if (body.clientId !== undefined) conv.clientId = body.clientId;
  if (body.title !== undefined) conv.title = body.title;
  if (Array.isArray(body.messages)) conv.messages = body.messages;

  conv.updatedAt = new Date().toISOString();

  // Auto-title from first user message if still default
  if (conv.title === 'Nouvelle conversation' && conv.messages.length > 0) {
    const firstUser = conv.messages.find((m) => m.role === 'user');
    if (firstUser) {
      conv.title = firstUser.content.slice(0, 60).replace(/\n/g, ' ');
      if (firstUser.content.length > 60) conv.title += '...';
    }
  }

  saveConv(conv);
  return Response.json(conv);
}

// DELETE /api/conversations/[id]
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const fp = getPath(id);
  if (existsSync(fp)) {
    unlinkSync(fp);
  }
  return Response.json({ ok: true });
}
