import { spawn } from 'child_process';
import { getAgent } from '@/lib/agents';

const TEST_TIMEOUT_MS = 10_000; // 10 seconds max

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const agent = getAgent(id);
  if (!agent) return Response.json({ error: 'Agent not found' }, { status: 404 });

  const { name, type, command, args, url, env } = await req.json();

  if (type === 'http') {
    return testHttp(url);
  }
  return testStdio(command, args, env);
}

async function testHttp(url: string): Promise<Response> {
  if (!url) {
    return Response.json({ ok: false, error: 'URL manquante' });
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TEST_TIMEOUT_MS);

    const res = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timer);

    return Response.json({
      ok: res.ok,
      status: res.status,
      message: res.ok
        ? `Connecté (HTTP ${res.status})`
        : `Erreur HTTP ${res.status}`,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erreur inconnue';
    return Response.json({
      ok: false,
      error: msg.includes('abort') ? 'Timeout (10s)' : msg,
    });
  }
}

function testStdio(
  command: string,
  args: string[],
  env?: Record<string, string>
): Promise<Response> {
  if (!command) {
    return Promise.resolve(Response.json({ ok: false, error: 'Commande manquante' }));
  }

  return new Promise((resolve) => {
    let stderr = '';
    let stdout = '';
    let resolved = false;

    const done = (result: { ok: boolean; message?: string; error?: string }) => {
      if (resolved) return;
      resolved = true;
      try { proc.kill('SIGTERM'); } catch {}
      clearTimeout(timer);
      resolve(Response.json(result));
    };

    const procEnv = { ...process.env, ...(env || {}) };
    const proc = spawn(command, args || [], {
      env: procEnv,
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    // Timeout — if the process is still alive after TEST_TIMEOUT_MS,
    // it means it started successfully (MCP servers are long-running)
    const timer = setTimeout(() => {
      done({
        ok: true,
        message: `Le process a démarré et tourne (PID ${proc.pid})`,
      });
    }, 5000); // 5s is enough to confirm it starts

    proc.stdout.on('data', (chunk: Buffer) => {
      stdout += chunk.toString();
      // If we get any stdout, the server is responding
      if (stdout.length > 0 && !resolved) {
        done({
          ok: true,
          message: `Le serveur a répondu (${stdout.length} octets)`,
        });
      }
    });

    proc.stderr.on('data', (chunk: Buffer) => {
      stderr += chunk.toString();
    });

    proc.on('error', (err) => {
      done({
        ok: false,
        error: `Impossible de lancer la commande: ${err.message}`,
      });
    });

    proc.on('close', (code) => {
      if (code === 0) {
        done({ ok: true, message: 'Process terminé avec succès (code 0)' });
      } else {
        done({
          ok: false,
          error: `Process terminé avec code ${code}${stderr ? `: ${stderr.slice(0, 300)}` : ''}`,
        });
      }
    });

    // Send an empty JSON-RPC initialize to trigger a response from MCP servers
    try {
      const initMsg = JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'initialize',
        params: {
          protocolVersion: '2024-11-05',
          capabilities: {},
          clientInfo: { name: 'qg-test', version: '1.0.0' },
        },
      });
      proc.stdin.write(initMsg + '\n');
    } catch {
      // ignore stdin write errors
    }
  });
}
