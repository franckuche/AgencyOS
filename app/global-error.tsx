'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Ignore browser extension errors (MetaMask, etc.)
  if (
    error.message?.includes('MetaMask') ||
    error.stack?.includes('chrome-extension://') ||
    error.stack?.includes('moz-extension://')
  ) {
    return null;
  }

  return (
    <html lang="fr">
      <body>
        <div style={{ padding: 40, fontFamily: 'system-ui' }}>
          <h2>Une erreur est survenue</h2>
          <p style={{ color: '#666' }}>{error.message}</p>
          <button
            onClick={reset}
            style={{
              marginTop: 16,
              padding: '8px 16px',
              background: '#3B82F6',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
            }}
          >
            Réessayer
          </button>
        </div>
      </body>
    </html>
  );
}
