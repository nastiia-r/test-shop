export type UnsplashErrorKind = 'missing-key' | 'unauthorized' | 'rate-limit' | 'not-found' | 'unknown';

export class UnsplashError extends Error {
  constructor(
    readonly kind: UnsplashErrorKind,
    message: string,
  ) {
    super(`[unsplash:${kind}] ${message}`);
    this.name = 'UnsplashError';
  }
}

const KIND_PATTERN = /^\[unsplash:([a-z-]+)\]/;

export function getUnsplashErrorKind(error: unknown): UnsplashErrorKind | null {
  if (error instanceof UnsplashError) return error.kind;
  if (error instanceof Error) {
    const match = KIND_PATTERN.exec(error.message);
    if (match) return match[1] as UnsplashErrorKind;
  }
  return null;
}

export type UnsplashResult<T> = { ok: true; data: T } | { ok: false; kind: UnsplashErrorKind };

export async function tryUnsplash<T>(load: () => Promise<T>): Promise<UnsplashResult<T>> {
  try {
    return { ok: true, data: await load() };
  } catch (error) {
    const kind = getUnsplashErrorKind(error);
    if (kind) return { ok: false, kind };
    throw error;
  }
}
