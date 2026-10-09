import type { ImageLoaderProps } from 'next/image';

export default function unsplashLoader({ src, width, quality }: ImageLoaderProps): string {
  if (!src.startsWith('https://')) return src;

  const url = new URL(src);
  url.searchParams.set('w', String(width));
  url.searchParams.set('q', String(quality ?? 75));
  url.searchParams.set('auto', 'format');
  url.searchParams.set('fit', 'max');
  return url.toString();
}
