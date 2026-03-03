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

  const mcpPath = path.join(agent.cwd, 'mcp.json');
  if (!existsSync(mcpPath)) {
    return Response.json({ servers: {} });
  }

  try {
    const content = readFileSync(mcpPath, 'utf-8');
    const config = JSON.parse(content);
    return Response.json(config);
  } catch {
    return Response.json({ servers: {} });
  }
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

  const config = await req.json();
  const mcpPath = path.join(agent.cwd, 'mcp.json');

  // If no servers, delete the file
  if (!config.servers || Object.keys(config.servers).length === 0) {
    try {
      const { unlinkSync } = require('fs');
      if (existsSync(mcpPath)) unlinkSync(mcpPath);
    } catch {
      // ignore
    }
    return Response.json({ ok: true });
  }

  writeFileSync(mcpPath, JSON.stringify(config, null, 2) + '\n');
  return Response.json({ ok: true });
}
