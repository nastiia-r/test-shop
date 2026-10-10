import type { UnsplashErrorKind } from '@/shared/lib/unsplash-errors';
import { EmptyState } from '@/shared/ui/empty-state';

const MESSAGES: Record<Exclude<UnsplashErrorKind, 'not-found'>, { title: string; description: string }> = {
  'missing-key': {
    title: 'Unsplash API key is missing',
    description: 'Add UNSPLASH_ACCESS_KEY to .env.local (see .env.example) and restart the dev server.',
  },
  unauthorized: {
    title: 'Unsplash rejected the API key',
    description:
      'Check that UNSPLASH_ACCESS_KEY contains the Access Key (not the Secret Key) of an active application.',
  },
  'rate-limit': {
    title: 'Taking a short break',
    description:
      'The Unsplash API hourly request limit was reached. Photos you have already seen are cached — please try again in a few minutes.',
  },
  unknown: {
    title: 'Something went wrong',
    description: 'We could not load photos from Unsplash right now. Please try again shortly.',
  },
};

export function UnsplashErrorState({ kind }: { kind: UnsplashErrorKind }) {
  const message = MESSAGES[kind === 'not-found' ? 'unknown' : kind];
  return <EmptyState variant="card" role="alert" title={message.title} description={message.description} />;
}
