// ── Input validation helpers ────────────────────────────────────────────────
//
// Protects against path traversal and injection attacks.
// Apply to ALL user-supplied IDs, slugs, and params from URL routes.

const SAFE_ID = /^[a-zA-Z0-9_-]+$/;

/**
 * Validates a route parameter (id, slug, agentId, etc.).
 * Returns null if valid, or an error Response if invalid.
 */
export function validateParam(value: string, name = 'id'): Response | null {
  if (!value || !SAFE_ID.test(value)) {
    return Response.json(
      { error: `Invalid ${name}: must be alphanumeric, dash, or underscore` },
      { status: 400 }
    );
  }
  return null;
}
