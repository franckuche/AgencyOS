import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#FFFFFF',
};

export const metadata: Metadata = {
  title: 'Agency OS',
  description: 'Agent dashboard powered by Claude Code',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Suppress browser extension errors (MetaMask, etc.)
              window.addEventListener('error', function(e) {
                if (e.filename && (e.filename.includes('chrome-extension://') || e.filename.includes('moz-extension://'))) {
                  e.stopImmediatePropagation();
                  e.preventDefault();
                }
              });
              window.addEventListener('unhandledrejection', function(e) {
                if (e.reason && e.reason.stack && (e.reason.stack.includes('chrome-extension://') || e.reason.stack.includes('moz-extension://'))) {
                  e.stopImmediatePropagation();
                  e.preventDefault();
                }
              });
            `,
          }}
        />
      </head>
      <body className="bg-bg-primary text-text-primary font-sans antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
