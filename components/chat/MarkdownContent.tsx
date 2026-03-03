'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import dynamic from 'next/dynamic';
import CopyButton from './CopyButton';

const ChartBlock = dynamic(() => import('./ChartBlock'), { ssr: false });

export default function MarkdownContent({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        pre({ children }) {
          let codeString = '';
          let isChart = false;
          try {
            const codeEl = children as React.ReactElement<{ children?: string; className?: string }>;
            if (codeEl?.props?.children && typeof codeEl.props.children === 'string') {
              codeString = codeEl.props.children;
            }
            if (codeEl?.props?.className === 'language-chart') {
              isChart = true;
            }
          } catch {
            // ignore
          }

          if (isChart && codeString) {
            return <ChartBlock raw={codeString} />;
          }

          return (
            <div className="relative group my-3">
              <pre className="chat-pre">{children}</pre>
              {codeString && <CopyButton text={codeString} />}
            </div>
          );
        },
        code({ className, children, ...props }) {
          const isBlock = className?.startsWith('language-');
          if (isBlock) {
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          }
          return (
            <code className="chat-inline-code" {...props}>
              {children}
            </code>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
