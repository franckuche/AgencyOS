import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';

const CONV_DIR = path.join(process.cwd(), '.data', 'conversations');

export interface Conversation {
  id: string;
  title: string;
  agentId: string;
  clientId: string | null;
  messages: { role: string; content: string; timestamp: string; clientId?: string | null; thinking?: string; toolCalls?: unknown[] }[];
  createdAt: string;
  updatedAt: string;
}

function ensureDir() {
  if (!existsSync(CONV_DIR)) {
    mkdirSync(CONV_DIR, { recursive: true });
  }
}

// GET /api/conversations — list all (metadata only, no messages)
export async function GET() {
  ensureDir();

  const files = readdirSync(CONV_DIR).filter((f) => f.endsWith('.json'));
  const conversations = files.map((f) => {
    try {
      const data: Conversation = JSON.parse(
        readFileSync(path.join(CONV_DIR, f), 'utf-8')
      );
      return {
        id: data.id,
        title: data.title,
        agentId: data.agentId,
        clientId: data.clientId,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        messageCount: data.messages?.length || 0,
      };
    } catch {
      return null;
    }
  }).filter(Boolean);

  // Sort by updatedAt descending (most recent first)
  conversations.sort((a, b) => new Date(b!.updatedAt).getTime() - new Date(a!.updatedAt).getTime());

  return Response.json(conversations);
}

// POST /api/conversations — create new conversation
export async function POST(req: Request) {
  ensureDir();

  const body = await req.json();
  const { agentId, clientId = null, title = '' } = body;

  if (!agentId) {
    return Response.json({ error: 'agentId required' }, { status: 400 });
  }

  const id = `conv_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const now = new Date().toISOString();

  const conversation: Conversation = {
    id,
    title: title || 'Nouvelle conversation',
    agentId,
    clientId,
    messages: [],
    createdAt: now,
    updatedAt: now,
  };

  writeFileSync(
    path.join(CONV_DIR, `${id}.json`),
    JSON.stringify(conversation, null, 2)
  );

  return Response.json(conversation);
}
