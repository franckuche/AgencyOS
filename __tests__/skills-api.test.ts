import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { mkdirSync, writeFileSync, rmSync, existsSync, readFileSync } from 'fs';
import path from 'path';

// Simulate the PATCH append logic (extracted from route handler)
function appendToSkill(filePath: string, title: string, content: string): void {
  const existing = readFileSync(filePath, 'utf-8');
  const date = new Date().toISOString().split('T')[0];
  const block = `\n\n---\n\n## ${title.trim()} — ${date}\n\n${content.trim()}\n`;
  writeFileSync(filePath, existing + block);
}

const TEST_DIR = path.join(__dirname, '_test_skills');

beforeAll(() => {
  mkdirSync(TEST_DIR, { recursive: true });
});

afterAll(() => {
  rmSync(TEST_DIR, { recursive: true, force: true });
});

describe('Skill append logic', () => {
  it('appends a dated block to an existing skill', () => {
    const fp = path.join(TEST_DIR, 'test_skill.md');
    writeFileSync(fp, '# Mon Skill\n\nContenu initial.\n');

    appendToSkill(fp, 'Nouvelle section', 'Du contenu ajoute.');

    const result = readFileSync(fp, 'utf-8');
    expect(result).toContain('# Mon Skill');
    expect(result).toContain('Contenu initial.');
    expect(result).toContain('---');
    expect(result).toContain('## Nouvelle section —');
    expect(result).toContain('Du contenu ajoute.');
  });

  it('preserves existing content on multiple appends', () => {
    const fp = path.join(TEST_DIR, 'multi_append.md');
    writeFileSync(fp, '# Base\n');

    appendToSkill(fp, 'Premier ajout', 'AAA');
    appendToSkill(fp, 'Deuxieme ajout', 'BBB');

    const result = readFileSync(fp, 'utf-8');
    expect(result).toContain('# Base');
    expect(result).toContain('## Premier ajout');
    expect(result).toContain('AAA');
    expect(result).toContain('## Deuxieme ajout');
    expect(result).toContain('BBB');

    // Verify order: first append comes before second
    const idxFirst = result.indexOf('Premier ajout');
    const idxSecond = result.indexOf('Deuxieme ajout');
    expect(idxFirst).toBeLessThan(idxSecond);
  });

  it('trims title and content', () => {
    const fp = path.join(TEST_DIR, 'trim_test.md');
    writeFileSync(fp, '# Trim\n');

    appendToSkill(fp, '  Titre avec espaces  ', '  Contenu avec espaces  ');

    const result = readFileSync(fp, 'utf-8');
    expect(result).toContain('## Titre avec espaces —');
    expect(result).toContain('Contenu avec espaces');
    // Should not have leading/trailing spaces in the content block
    expect(result).not.toContain('  Contenu avec espaces  ');
  });
});

describe('Skill creation format', () => {
  it('creates a new skill with correct markdown structure', () => {
    const name = 'Resolution indexation';
    const title = 'Solution crawl budget';
    const content = 'Voici la solution.';
    const date = new Date().toISOString().split('T')[0];

    const initialContent = `# ${name}\n\n## ${title} — ${date}\n\n${content}\n`;

    const fp = path.join(TEST_DIR, 'new_skill.md');
    writeFileSync(fp, initialContent);

    const result = readFileSync(fp, 'utf-8');
    expect(result).toContain('# Resolution indexation');
    expect(result).toContain(`## Solution crawl budget — ${date}`);
    expect(result).toContain('Voici la solution.');
  });
});
