import { spawn, ChildProcess } from 'child_process';
import { readFileSync, existsSync, writeFileSync, appendFileSync, unlinkSync } from 'fs';
import path from 'path';
import { getAgent } from '@/lib/agents';
import { getClient } from '@/lib/clients';

export const maxDuration = 300;

const LOG_FILE = '/tmp/qg-claude-debug.log';
const PROCESS_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes max per request
const QUEUE_TIMEOUT_MS = 3 * 60 * 1000; // 3 minutes max waiting in queue

// Request queue — only one Claude CLI call at a time
let queue: { resolve: () => void; reject: (err: Error) => void }[] = [];
let running = false;

function enqueue(signal?: AbortSignal): Promise<void> {
  if (!running) {
    running = true;
    return Promise.resolve();
  }
  return new Promise<void>((resolve, reject) => {
    const entry = { resolve, reject };
    queue.push(entry);

    // Queue timeout — don't wait forever
    const timer = setTimeout(() => {
      const idx = queue.indexOf(entry);
      if (idx !== -1) {
        queue.splice(idx, 1);
        reject(new Error('Queue timeout'));
      }
    }, QUEUE_TIMEOUT_MS);

    // If client disconnects while waiting in queue, remove from queue
    signal?.addEventListener('abort', () => {
      clearTimeout(timer);
      const idx = queue.indexOf(entry);
      if (idx !== -1) {
        queue.splice(idx, 1);
        reject(new Error('Client disconnected'));
      }
    });

    // Clear timer when resolved
    const origResolve = entry.resolve;
    entry.resolve = () => {
      clearTimeout(timer);
      origResolve();
    };
  });
}

function dequeue() {
  if (queue.length > 0) {
    const next = queue.shift()!;
    next.resolve();
  } else {
    running = false;
  }
}

function log(msg: string) {
  const ts = new Date().toISOString();
  try {
    appendFileSync(LOG_FILE, `[${ts}] ${msg}\n`);
  } catch {
    // ignore log errors
  }
}

function killProcess(proc: ChildProcess, reason: string) {
  log(`Killing process: ${reason}`);
  try {
    // Kill the entire process group (bash + claude CLI)
    if (proc.pid) process.kill(-proc.pid, 'SIGTERM');
  } catch {
    try { proc.kill('SIGTERM'); } catch {}
  }
  // Force kill after 3s if still alive
  setTimeout(() => {
    try {
      if (proc.pid) process.kill(-proc.pid, 'SIGKILL');
    } catch {
      try { proc.kill('SIGKILL'); } catch {}
    }
  }, 3000);
}

function cleanupTempFile(filePath: string) {
  try { unlinkSync(filePath); } catch {}
}

export async function POST(req: Request) {
  const { agentId, message, clientId } = await req.json();

  const agent = getAgent(agentId);
  if (!agent) {
    return new Response(JSON.stringify({ error: 'Agent not found' }), {
      status: 404,
    });
  }

  let cwd = agent.cwd;
  let prompt = message;

  if (clientId) {
    const client = getClient(clientId);
    if (client) {
      cwd = client.cwd;
      const agentClaudeMd = path.join(agent.cwd, 'CLAUDE.md');
      let agentContext = '';
      if (existsSync(agentClaudeMd)) {
        agentContext = readFileSync(agentClaudeMd, 'utf-8');
      }
      prompt = `[RÔLE]\n${agentContext}\n\n[CLIENT ACTIF: ${client.name}]\n\n[MESSAGE]\n${message}`;
    }
  }

  // Write prompt to temp file to avoid shell escaping issues
  const promptFile = `/tmp/qg-prompt-${Date.now()}.txt`;
  writeFileSync(promptFile, prompt);

  log(`Agent: ${agent.name}, CWD: ${cwd}, Prompt length: ${prompt.length}`);

  // Wait for our turn in the queue
  try {
    await enqueue(req.signal);
  } catch (err) {
    cleanupTempFile(promptFile);
    const msg = err instanceof Error ? err.message : 'Queue error';
    log(`Queue error: ${msg}`);
    return new Response(JSON.stringify({ error: msg }), { status: 503 });
  }

  log(`Queue: started processing for ${agent.name}`);

  const claudeBin = process.env.CLAUDE_BIN || 'claude';

  // Check for MCP config
  const mcpConfigPath = path.join(agent.cwd, 'mcp.json');
  let mcpFlag = '';
  let filteredMcpPath = '';
  if (existsSync(mcpConfigPath)) {
    try {
      const mcpContent = JSON.parse(readFileSync(mcpConfigPath, 'utf-8'));
      const servers = mcpContent.servers || {};
      const enabledServers: Record<string, unknown> = {};
      for (const [name, server] of Object.entries(servers)) {
        const s = server as { enabled?: boolean };
        if (s.enabled !== false) {
          const { enabled: _, ...rest } = s as Record<string, unknown>;
          enabledServers[name] = rest;
        }
      }
      if (Object.keys(enabledServers).length > 0) {
        filteredMcpPath = `/tmp/qg-mcp-${Date.now()}.json`;
        writeFileSync(filteredMcpPath, JSON.stringify({ mcpServers: enabledServers }, null, 2));
        mcpFlag = ` --mcp-config "${filteredMcpPath}"`;
      }
    } catch {
      // Invalid mcp.json, skip
    }
  }

  // Build allowed tools list — include MCP server wildcards when MCP is configured
  const baseTools = 'Read,Glob,Grep,Bash,Write,Edit,WebFetch,WebSearch';
  let mcpToolPatterns = '';
  if (mcpFlag && existsSync(mcpConfigPath)) {
    try {
      const mcpContent = JSON.parse(readFileSync(mcpConfigPath, 'utf-8'));
      const serverNames = Object.keys(mcpContent.servers || {}).filter(
        (name) => (mcpContent.servers[name] as { enabled?: boolean }).enabled !== false
      );
      if (serverNames.length > 0) {
        mcpToolPatterns = ',' + serverNames.map((name) => `mcp__${name}__*`).join(',');
      }
    } catch {}
  }

  const cmd = `unset CLAUDECODE CLAUDE_CODE_ENTRYPOINT; cat "${promptFile}" | ${claudeBin} -p --verbose --output-format stream-json --permission-mode bypassPermissions --allowedTools "${baseTools}${mcpToolPatterns}"${mcpFlag}`;

  // Spawn with process group so we can kill the whole tree
  const proc = spawn('/bin/bash', ['-c', cmd], { cwd, detached: true });

  const encoder = new TextEncoder();

  // Single cleanup guard — ensures dequeue() is called exactly once
  let cleaned = false;
  function cleanup(reason: string) {
    if (cleaned) return;
    cleaned = true;
    log(`Cleanup: ${reason}`);
    dequeue();
    cleanupTempFile(promptFile);
    if (filteredMcpPath) cleanupTempFile(filteredMcpPath);
  }

  // Process timeout — kill if it takes too long
  const timeoutTimer = setTimeout(() => {
    if (!cleaned) {
      killProcess(proc, 'timeout');
    }
  }, PROCESS_TIMEOUT_MS);

  // Client disconnect — kill process if the client goes away
  req.signal.addEventListener('abort', () => {
    clearTimeout(timeoutTimer);
    if (!cleaned) {
      killProcess(proc, 'client disconnected');
    }
  });

  const stream = new ReadableStream({
    start(controller) {
      let buffer = '';

      proc.stdout.on('data', (chunk: Buffer) => {
        buffer += chunk.toString();
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const event = JSON.parse(line);

            if (event.type === 'assistant' && event.message?.content) {
              for (const block of event.message.content) {
                if (block.type === 'thinking') {
                  controller.enqueue(
                    encoder.encode(
                      JSON.stringify({ type: 'thinking', text: block.thinking }) + '\n'
                    )
                  );
                } else if (block.type === 'text') {
                  controller.enqueue(
                    encoder.encode(
                      JSON.stringify({ type: 'text', text: block.text }) + '\n'
                    )
                  );
                } else if (block.type === 'tool_use') {
                  controller.enqueue(
                    encoder.encode(
                      JSON.stringify({
                        type: 'tool_use',
                        name: block.name,
                        input: block.input,
                      }) + '\n'
                    )
                  );
                }
              }
            } else if (event.type === 'user' && event.message?.content) {
              for (const block of event.message.content) {
                if (block.type === 'tool_result') {
                  let snippet = '';
                  if (typeof block.content === 'string') {
                    snippet = block.content.slice(0, 500);
                  } else if (Array.isArray(block.content)) {
                    snippet = block.content
                      .filter((c: { type: string }) => c.type === 'text')
                      .map((c: { text: string }) => c.text)
                      .join('\n')
                      .slice(0, 500);
                  }
                  controller.enqueue(
                    encoder.encode(
                      JSON.stringify({ type: 'tool_result', snippet }) + '\n'
                    )
                  );
                }
              }
            } else if (event.type === 'result') {
              controller.enqueue(
                encoder.encode(JSON.stringify({ type: 'done' }) + '\n')
              );
            }
          } catch {
            // Not valid JSON line, skip
          }
        }
      });

      proc.stderr.on('data', (chunk: Buffer) => {
        log(`STDERR: ${chunk.toString()}`);
      });

      proc.on('close', (code) => {
        clearTimeout(timeoutTimer);
        cleanup(`process closed with code ${code}`);

        // Process remaining buffer
        if (buffer.trim()) {
          try {
            const event = JSON.parse(buffer);
            if (event.type === 'result') {
              controller.enqueue(
                encoder.encode(JSON.stringify({ type: 'done' }) + '\n')
              );
            }
          } catch {}
        }

        controller.close();
      });

      proc.on('error', (err) => {
        clearTimeout(timeoutTimer);
        cleanup(`process error: ${err.message}`);

        controller.enqueue(
          encoder.encode(
            JSON.stringify({ type: 'error', text: err.message }) + '\n'
          )
        );
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'application/x-ndjson',
      'Cache-Control': 'no-cache',
      'X-Agent': agent.name,
    },
  });
}
