import { getUnsplashErrorKind, type UnsplashErrorKind } from '@/lib/unsplash/client';

import styles from './ApiErrorState.module.scss';

const MESSAGES: Record<Exclude<UnsplashErrorKind, 'not-found'>, { title: string; text: string }> = {
  'missing-key': {
    title: 'Unsplash API key is missing',
    text: 'Add UNSPLASH_ACCESS_KEY to .env.local (see .env.example) and restart the dev server.',
  },
  unauthorized: {
    title: 'Unsplash rejected the API key',
    text: 'Check that UNSPLASH_ACCESS_KEY contains the Access Key (not the Secret Key) of an active application.',
  },
  'rate-limit': {
    title: 'Taking a short break',
    text: 'The Unsplash API hourly request limit was reached. Photos you have already seen are cached — please try again in a few minutes.',
  },
  unknown: {
    title: 'Something went wrong',
    text: 'We could not load photos from Unsplash right now. Please try again shortly.',
  },
};

export function ApiErrorState({ kind }: { kind: UnsplashErrorKind }) {
  const message = MESSAGES[kind === 'not-found' ? 'unknown' : kind];
  return (
    <div className={styles.state} role="alert">
      <h2>{message.title}</h2>
      <p>{message.text}</p>
    </div>
  );
}

export async function tryUnsplash<T>(
  load: () => Promise<T>,
): Promise<{ ok: true; data: T } | { ok: false; kind: UnsplashErrorKind }> {
  try {
    return { ok: true, data: await load() };
  } catch (error) {
    const kind = getUnsplashErrorKind(error);
    if (kind) return { ok: false, kind };
    throw error;
  }
}
