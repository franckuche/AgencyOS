import { readFileSync, writeFileSync, existsSync } from 'fs';
import path from 'path';
import { getClient } from '@/lib/clients';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const client = getClient(id);
  if (!client) {
    return Response.json({ error: 'Client not found' }, { status: 404 });
  }

  const { note } = await req.json();
  if (!note?.trim()) {
    return Response.json({ error: 'Note is required' }, { status: 400 });
  }

  const claudeMdPath = path.join(client.cwd, 'CLAUDE.md');
  if (!existsSync(claudeMdPath)) {
    return Response.json({ error: 'No CLAUDE.md found' }, { status: 404 });
  }

  let content = readFileSync(claudeMdPath, 'utf-8');

  const today = new Date().toISOString().slice(0, 10);
  const noteEntry = `\n- [${today}] ${note.trim()}`;

  // Append to Notes section
  const notesIdx = content.indexOf('## Notes');
  if (notesIdx !== -1) {
    // Find the end of the ">" line after ## Notes, then append
    const afterNotes = content.slice(notesIdx);
    const firstNewline = afterNotes.indexOf('\n');
    const secondNewline = afterNotes.indexOf('\n', firstNewline + 1);

    // Check if there's a "> ..." line after ## Notes
    const lineAfterHeader = afterNotes.slice(firstNewline + 1, secondNewline).trim();
    if (lineAfterHeader.startsWith('>')) {
      // Replace the > placeholder with actual notes
      content = content.slice(0, notesIdx + secondNewline) + noteEntry + content.slice(notesIdx + secondNewline);
    } else {
      content = content.slice(0, notesIdx + firstNewline) + noteEntry + content.slice(notesIdx + firstNewline);
    }
  } else {
    content += `\n\n## Notes${noteEntry}`;
  }

  writeFileSync(claudeMdPath, content);

  return Response.json({ ok: true });
}
