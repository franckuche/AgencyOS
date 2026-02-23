export async function GET() {
  const claudeVars: Record<string, string> = {};
  for (const [key, val] of Object.entries(process.env)) {
    if (key.toLowerCase().includes('claude') || key.toLowerCase().includes('anthropic')) {
      claudeVars[key] = val || '';
    }
  }
  return Response.json({
    claudeVars,
    nodeVersion: process.version,
    allEnvKeys: Object.keys(process.env).sort(),
  });
}
