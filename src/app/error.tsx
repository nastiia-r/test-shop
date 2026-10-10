'use client';

import { useEffect } from 'react';

import { Button, LinkButton } from '@/shared/ui/button';
import { Container } from '@/shared/ui/container';
import { EmptyState } from '@/shared/ui/empty-state';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container>
      <EmptyState
        variant="page"
        title="Something went wrong"
        description="An unexpected error occurred. You can try again or go back to the feed."
        actions={
          <>
            <Button variant="primary" size="lg" onClick={reset}>
              Try again
            </Button>
            <LinkButton href="/" size="lg">
              Back to the feed
            </LinkButton>
          </>
        }
      />
    </Container>
  );
}
