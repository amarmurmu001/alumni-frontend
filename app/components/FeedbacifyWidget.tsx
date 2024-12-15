'use client';

import { useEffect, useState } from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "my-widget": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        "project-id": string | number;
      };
    }
  }
}

interface FeedbacifyWidgetProps {
  projectId: string | number;
}

export default function FeedbacifyWidget({ projectId }: FeedbacifyWidgetProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const script = document.createElement('script');
    script.src = 'https://feedbacify-widget.vercel.app/widget.umd.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div style={{ position: "fixed", bottom: "15px", right: "15px" }}>
      <my-widget project-id={projectId} />
    </div>
  );
}
