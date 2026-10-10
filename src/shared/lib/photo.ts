import type { Photo } from '@/shared/types/photo';

export function toPhotoSummary({ id, width, height, color, alt, src, author }: Photo): Photo {
  return { id, width, height, color, alt, src, author };
}
