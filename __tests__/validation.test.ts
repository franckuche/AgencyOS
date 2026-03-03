import { describe, it, expect } from 'vitest';
import { validateParam } from '../lib/validation';

describe('validateParam', () => {
  it('accepts valid alphanumeric IDs', () => {
    expect(validateParam('seo')).toBeNull();
    expect(validateParam('agent-1')).toBeNull();
    expect(validateParam('my_skill_name')).toBeNull();
    expect(validateParam('conv_1708123456_abc123')).toBeNull();
    expect(validateParam('ABC123')).toBeNull();
  });

  it('rejects path traversal attempts', () => {
    const res = validateParam('../../../etc/passwd');
    expect(res).not.toBeNull();
    expect(res!.status).toBe(400);
  });

  it('rejects slashes', () => {
    expect(validateParam('foo/bar')).not.toBeNull();
    expect(validateParam('foo\\bar')).not.toBeNull();
  });

  it('rejects dots alone', () => {
    expect(validateParam('..')).not.toBeNull();
    expect(validateParam('.')).not.toBeNull();
    expect(validateParam('foo..bar')).not.toBeNull();
  });

  it('rejects empty string', () => {
    expect(validateParam('')).not.toBeNull();
  });

  it('rejects special characters', () => {
    expect(validateParam('foo bar')).not.toBeNull();
    expect(validateParam('foo;rm -rf')).not.toBeNull();
    expect(validateParam('$(whoami)')).not.toBeNull();
    expect(validateParam('foo`id`')).not.toBeNull();
  });

  it('includes param name in error message', () => {
    const res = validateParam('../bad', 'slug');
    expect(res).not.toBeNull();
    // Verify it's a proper Response with JSON body
    expect(res!.status).toBe(400);
  });
});
