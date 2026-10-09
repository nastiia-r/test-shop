'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container status-page">
      <h1>Something went wrong</h1>
      <p>An unexpected error occurred. You can try again or go back to the feed.</p>
      <div className="toolbar">
        <button type="button" className="btn btn--primary btn--lg" onClick={reset}>
          Try again
        </button>
        <Link href="/" className="btn btn--lg">
          Back to the feed
        </Link>
      </div>
    </div>
  );
}
