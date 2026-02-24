import { spawn } from 'child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync } from 'fs';
import path from 'path';

const MCP_SERVERS_DIR = path.join(process.env.HOME || '/tmp', '.qg', 'mcp-servers');
const INSTALL_TIMEOUT_MS = 120_000; // 2 minutes max

type ProjectType = 'node' | 'python' | 'unknown';

function runCommand(cmd: string, cwd: string): Promise<{ ok: boolean; output: string }> {
  return new Promise((resolve) => {
    const proc = spawn('/bin/bash', ['-c', cmd], { cwd });
    let output = '';

    proc.stdout.on('data', (chunk: Buffer) => { output += chunk.toString(); });
    proc.stderr.on('data', (chunk: Buffer) => { output += chunk.toString(); });

    const timer = setTimeout(() => {
      try { proc.kill('SIGTERM'); } catch {}
      resolve({ ok: false, output: 'Timeout (2 min)' });
    }, INSTALL_TIMEOUT_MS);

    proc.on('close', (code) => {
      clearTimeout(timer);
      resolve({ ok: code === 0, output });
    });

    proc.on('error', (err) => {
      clearTimeout(timer);
      resolve({ ok: false, output: err.message });
    });
  });
}

// ── Project type detection ──────────────────────────────────────────────────

function detectProjectType(serverDir: string): ProjectType {
  const hasPackageJson = existsSync(path.join(serverDir, 'package.json'));
  const hasRequirements = existsSync(path.join(serverDir, 'requirements.txt'));
  const hasPyproject = existsSync(path.join(serverDir, 'pyproject.toml'));
  const hasSetupPy = existsSync(path.join(serverDir, 'setup.py'));

  if (hasRequirements || hasPyproject || hasSetupPy) return 'python';
  if (hasPackageJson) return 'node';
  return 'unknown';
}

// ── Node.js install & detection ─────────────────────────────────────────────

function detectNodeEntryPoint(serverDir: string): string | null {
  const pkgPath = path.join(serverDir, 'package.json');
  if (existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));

      const distIndex = path.join(serverDir, 'dist', 'index.js');
      if (existsSync(distIndex)) return distIndex;

      const buildIndex = path.join(serverDir, 'build', 'index.js');
      if (existsSync(buildIndex)) return buildIndex;

      if (pkg.main) {
        const mainPath = path.join(serverDir, pkg.main);
        if (existsSync(mainPath)) return mainPath;
      }

      if (pkg.bin) {
        const binName = typeof pkg.bin === 'string' ? pkg.bin : Object.values(pkg.bin)[0];
        if (typeof binName === 'string') {
          const binPath = path.join(serverDir, binName);
          if (existsSync(binPath)) return binPath;
        }
      }
    } catch {}
  }

  for (const candidate of ['dist/index.js', 'build/index.js', 'index.js', 'src/index.js']) {
    const p = path.join(serverDir, candidate);
    if (existsSync(p)) return p;
  }

  return null;
}

async function installNode(serverDir: string): Promise<{ ok: boolean; error?: string }> {
  const install = await runCommand('npm install', serverDir);
  if (!install.ok) {
    return { ok: false, error: `npm install échoué: ${install.output.slice(0, 200)}` };
  }

  try {
    const pkg = JSON.parse(readFileSync(path.join(serverDir, 'package.json'), 'utf-8'));
    if (pkg.scripts?.build) {
      const build = await runCommand('npm run build', serverDir);
      if (!build.ok) {
        return { ok: false, error: `npm run build échoué: ${build.output.slice(0, 200)}` };
      }
    }
  } catch {}

  return { ok: true };
}

function getNodeServerName(serverDir: string, fallback: string): string {
  try {
    const pkg = JSON.parse(readFileSync(path.join(serverDir, 'package.json'), 'utf-8'));
    if (pkg.name) {
      return pkg.name.replace(/^@[^/]+\//, '').replace(/^mcp-/, '').replace(/-mcp$/, '');
    }
  } catch {}
  return fallback;
}

// ── Python install & detection ──────────────────────────────────────────────

function detectPythonEntryPoint(serverDir: string): string | null {
  // Common MCP server entry points
  const candidates = [
    'server.py',
    'src/server.py',
    'main.py',
    'src/main.py',
    'app.py',
    'src/index.py',
    '__main__.py',
    'src/__main__.py',
    'mcp_server.py',
    'src/mcp_server.py',
  ];

  for (const candidate of candidates) {
    const p = path.join(serverDir, candidate);
    if (existsSync(p)) return p;
  }

  // Check pyproject.toml for scripts/entry points
  const pyprojectPath = path.join(serverDir, 'pyproject.toml');
  if (existsSync(pyprojectPath)) {
    try {
      const content = readFileSync(pyprojectPath, 'utf-8');
      // Look for [project.scripts] section — common pattern: server = "package.module:main"
      const scriptsMatch = content.match(/\[project\.scripts\]\s*\n([^\[]*)/);
      if (scriptsMatch) {
        // If there's a scripts entry, the package is installable — use -m approach
        const moduleMatch = content.match(/name\s*=\s*"([^"]+)"/);
        if (moduleMatch) return `__module__:${moduleMatch[1]}`;
      }
    } catch {}
  }

  // Last resort: find any .py file that imports mcp
  try {
    const files = readdirSync(serverDir).filter(f => f.endsWith('.py'));
    for (const file of files) {
      const content = readFileSync(path.join(serverDir, file), 'utf-8');
      if (content.includes('from mcp') || content.includes('import mcp')) {
        return path.join(serverDir, file);
      }
    }
    // Check src/ directory
    const srcDir = path.join(serverDir, 'src');
    if (existsSync(srcDir)) {
      const srcFiles = readdirSync(srcDir).filter(f => f.endsWith('.py'));
      for (const file of srcFiles) {
        const content = readFileSync(path.join(srcDir, file), 'utf-8');
        if (content.includes('from mcp') || content.includes('import mcp')) {
          return path.join(srcDir, file);
        }
      }
    }
  } catch {}

  return null;
}

async function installPython(serverDir: string): Promise<{ ok: boolean; error?: string; venvPython: string }> {
  const venvDir = path.join(serverDir, '.venv');
  const venvPython = path.join(venvDir, 'bin', 'python');

  // Check if uv is available (faster), fallback to python3
  const hasUv = (await runCommand('which uv', serverDir)).ok;

  // Create venv
  if (!existsSync(venvDir)) {
    const venvCmd = hasUv
      ? `uv venv "${venvDir}"`
      : `python3 -m venv "${venvDir}"`;
    const venv = await runCommand(venvCmd, serverDir);
    if (!venv.ok) {
      return { ok: false, error: `Création venv échouée: ${venv.output.slice(0, 200)}`, venvPython };
    }
  }

  // Install dependencies
  const hasRequirements = existsSync(path.join(serverDir, 'requirements.txt'));
  const hasPyproject = existsSync(path.join(serverDir, 'pyproject.toml'));
  const hasSetupPy = existsSync(path.join(serverDir, 'setup.py'));

  let installCmd: string;
  if (hasUv) {
    if (hasRequirements) {
      installCmd = `uv pip install --python "${venvPython}" -r requirements.txt`;
    } else if (hasPyproject || hasSetupPy) {
      installCmd = `uv pip install --python "${venvPython}" -e .`;
    } else {
      return { ok: true, venvPython };
    }
  } else {
    if (hasRequirements) {
      installCmd = `"${venvPython}" -m pip install -r requirements.txt`;
    } else if (hasPyproject || hasSetupPy) {
      installCmd = `"${venvPython}" -m pip install -e .`;
    } else {
      return { ok: true, venvPython };
    }
  }

  const install = await runCommand(installCmd, serverDir);
  if (!install.ok) {
    return { ok: false, error: `Installation Python échouée: ${install.output.slice(0, 200)}`, venvPython };
  }

  return { ok: true, venvPython };
}

function getPythonServerName(serverDir: string, fallback: string): string {
  // Try pyproject.toml
  const pyprojectPath = path.join(serverDir, 'pyproject.toml');
  if (existsSync(pyprojectPath)) {
    try {
      const content = readFileSync(pyprojectPath, 'utf-8');
      const nameMatch = content.match(/name\s*=\s*"([^"]+)"/);
      if (nameMatch) {
        return nameMatch[1].replace(/^mcp-/, '').replace(/-mcp$/, '').replace(/_/g, '-');
      }
    } catch {}
  }

  // Try setup.py
  const setupPath = path.join(serverDir, 'setup.py');
  if (existsSync(setupPath)) {
    try {
      const content = readFileSync(setupPath, 'utf-8');
      const nameMatch = content.match(/name\s*=\s*['"]([^'"]+)['"]/);
      if (nameMatch) {
        return nameMatch[1].replace(/^mcp-/, '').replace(/-mcp$/, '').replace(/_/g, '-');
      }
    } catch {}
  }

  return fallback;
}

// ── Shared ──────────────────────────────────────────────────────────────────

function detectEnvVars(serverDir: string): string[] {
  const vars: string[] = [];

  // Check .env.example
  const envExample = path.join(serverDir, '.env.example');
  if (existsSync(envExample)) {
    const content = readFileSync(envExample, 'utf-8');
    for (const line of content.split('\n')) {
      const match = line.match(/^([A-Z][A-Z0-9_]+)\s*=/);
      if (match) vars.push(match[1]);
    }
  }

  // Check README for env vars
  const readme = path.join(serverDir, 'README.md');
  if (existsSync(readme) && vars.length === 0) {
    const content = readFileSync(readme, 'utf-8');
    const envMatches = content.match(/[A-Z][A-Z0-9_]{3,}_(?:KEY|TOKEN|SECRET|URL|ID|PASSWORD)/g);
    if (envMatches) {
      for (const v of [...new Set(envMatches)]) {
        if (!vars.includes(v)) vars.push(v);
      }
    }
  }

  return vars;
}

// ── Main handler ────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  const { url } = await req.json();

  if (!url?.trim()) {
    return Response.json({ error: 'URL requise' }, { status: 400 });
  }

  // Parse GitHub URL to get repo name
  const urlClean = url.trim().replace(/\/+$/, '').replace(/\.git$/, '');
  const parts = urlClean.split('/');
  const repoName = parts[parts.length - 1]?.toLowerCase();

  if (!repoName) {
    return Response.json({ error: 'URL invalide' }, { status: 400 });
  }

  // Create MCP servers directory
  if (!existsSync(MCP_SERVERS_DIR)) {
    mkdirSync(MCP_SERVERS_DIR, { recursive: true });
  }

  const serverDir = path.join(MCP_SERVERS_DIR, repoName);
  const alreadyExists = existsSync(serverDir);

  // Step 1: Clone (or pull if already exists)
  if (alreadyExists) {
    const pull = await runCommand('git pull', serverDir);
    if (!pull.ok) {
      return Response.json({
        error: `Git pull échoué: ${pull.output.slice(0, 200)}`,
      }, { status: 500 });
    }
  } else {
    const clone = await runCommand(`git clone "${urlClean}.git" "${serverDir}"`, MCP_SERVERS_DIR);
    if (!clone.ok) {
      const clone2 = await runCommand(`git clone "${urlClean}" "${serverDir}"`, MCP_SERVERS_DIR);
      if (!clone2.ok) {
        return Response.json({
          error: `Git clone échoué: ${clone2.output.slice(0, 200)}`,
        }, { status: 500 });
      }
    }
  }

  // Step 2: Detect project type
  const projectType = detectProjectType(serverDir);

  if (projectType === 'unknown') {
    const files = readdirSync(serverDir).join(', ');
    return Response.json({
      error: `Type de projet non reconnu (ni Node.js ni Python). Fichiers: ${files}`,
    }, { status: 500 });
  }

  // Step 3: Install dependencies + detect entry point based on type
  if (projectType === 'node') {
    // ── Node.js ──
    const install = await installNode(serverDir);
    if (!install.ok) {
      return Response.json({ error: install.error }, { status: 500 });
    }

    const entryPoint = detectNodeEntryPoint(serverDir);
    if (!entryPoint) {
      const files = readdirSync(serverDir).join(', ');
      return Response.json({
        error: `Pas de point d'entrée Node.js trouvé. Fichiers: ${files}`,
      }, { status: 500 });
    }

    const envVars = detectEnvVars(serverDir);
    const serverName = getNodeServerName(serverDir, repoName);

    return Response.json({
      ok: true,
      name: serverName,
      type: 'node',
      command: 'node',
      args: [entryPoint],
      envVars,
      path: serverDir,
      message: alreadyExists ? 'Mis à jour' : 'Installé',
    });
  } else {
    // ── Python ──
    const install = await installPython(serverDir);
    if (!install.ok) {
      return Response.json({ error: install.error }, { status: 500 });
    }

    const entryPoint = detectPythonEntryPoint(serverDir);
    if (!entryPoint) {
      const files = readdirSync(serverDir).join(', ');
      return Response.json({
        error: `Pas de point d'entrée Python trouvé. Fichiers: ${files}`,
      }, { status: 500 });
    }

    const envVars = detectEnvVars(serverDir);
    const serverName = getPythonServerName(serverDir, repoName);

    // If entry point is a module reference (from pyproject.toml scripts)
    if (entryPoint.startsWith('__module__:')) {
      const moduleName = entryPoint.replace('__module__:', '');
      return Response.json({
        ok: true,
        name: serverName,
        type: 'python',
        command: install.venvPython,
        args: ['-m', moduleName],
        envVars,
        path: serverDir,
        message: alreadyExists ? 'Mis à jour' : 'Installé',
      });
    }

    return Response.json({
      ok: true,
      name: serverName,
      type: 'python',
      command: install.venvPython,
      args: [entryPoint],
      envVars,
      path: serverDir,
      message: alreadyExists ? 'Mis à jour' : 'Installé',
    });
  }
}
