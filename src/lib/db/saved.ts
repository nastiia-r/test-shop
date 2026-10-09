import 'server-only';

import type { Photo } from '@/lib/unsplash/types';

import { getStore } from './store';

export interface SavedPhoto extends Photo {
  savedAt: string;
}

const savedKey = (userId: string) => `saved/${userId}`;

export async function getSavedPhotos(userId: string): Promise<SavedPhoto[]> {
  const store = await getStore();
  return (await store.get<SavedPhoto[]>(savedKey(userId))) ?? [];
}

export async function getSavedIds(userId: string): Promise<Set<string>> {
  return new Set((await getSavedPhotos(userId)).map((photo) => photo.id));
}

export async function savePhoto(userId: string, photo: Photo): Promise<void> {
  const store = await getStore();
  const saved = await getSavedPhotos(userId);
  if (saved.some((item) => item.id === photo.id)) return;
  await store.set(savedKey(userId), [{ ...photo, savedAt: new Date().toISOString() }, ...saved]);
}

export async function removePhoto(userId: string, photoId: string): Promise<void> {
  const store = await getStore();
  const saved = await getSavedPhotos(userId);
  await store.set(
    savedKey(userId),
    saved.filter((item) => item.id !== photoId),
  );
}
