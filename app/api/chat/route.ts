import { spawn } from 'child_process';
import { readFileSync, existsSync, writeFileSync, appendFileSync, unlinkSync } from 'fs';
import path from 'path';
import { getAgent } from '@/lib/agents';
import { getClient } from '@/lib/clients';

export const maxDuration = 120;

const LOG_FILE = '/tmp/qg-claude-debug.log';

// Request queue — only one Claude CLI call at a time
let queue: (() => void)[] = [];
let running = false;

function enqueue(): Promise<void> {
  if (!running) {
    running = true;
    return Promise.resolve();
  }
  return new Promise<void>((resolve) => {
    queue.push(resolve);
  });
}

function dequeue() {
  if (queue.length > 0) {
    const next = queue.shift()!;
    next();
  } else {
    running = false;
  }
}

function log(msg: string) {
  const ts = new Date().toISOString();
  appendFileSync(LOG_FILE, `[${ts}] ${msg}\n`);
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
  await enqueue();
  log(`Queue: started processing for ${agent.name}`);

  const claudeBin = process.env.CLAUDE_BIN || 'claude';
  const cmd = `unset CLAUDECODE CLAUDE_CODE_ENTRYPOINT; cat "${promptFile}" | ${claudeBin} -p --verbose --output-format stream-json --allowedTools "Read,Glob,Grep,Bash,Write,Edit,WebFetch,WebSearch"`;

  const proc = spawn('/bin/bash', ['-c', cmd], { cwd });

  const encoder = new TextEncoder();

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
              // Tool results
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
        dequeue();
        try { unlinkSync(promptFile); } catch {}

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

        log(`Process closed with code ${code}`);
        controller.close();
      });

      proc.on('error', (err) => {
        dequeue();
        try { unlinkSync(promptFile); } catch {}
        log(`Process error: ${err.message}`);
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
