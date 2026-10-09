'use server';

import { refresh } from 'next/cache';
import { z } from 'zod';

import { getSession } from '@/lib/auth/session';
import { removePhoto, savePhoto } from '@/lib/db/saved';

const unsplashImage = z.url().refine((value) => {
  const { protocol, hostname } = new URL(value);
  return protocol === 'https:' && (hostname === 'images.unsplash.com' || hostname === 'plus.unsplash.com');
}, 'Only Unsplash images can be saved');

const photoSchema = z.object({
  id: z.string().min(1).max(64),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  color: z.string().regex(/^#[0-9a-f]{3,8}$/i),
  alt: z.string().max(500),
  src: unsplashImage,
  author: z.object({
    username: z.string().max(100),
    name: z.string().max(200),
    avatar: unsplashImage,
    profileUrl: z.url().startsWith('https://unsplash.com/'),
  }),
});

export type SaveResult = { ok: true; saved: boolean } | { ok: false; reason: 'unauthenticated' | 'invalid' };

export async function setPhotoSaved(photo: unknown, saved: boolean): Promise<SaveResult> {
  const session = await getSession();
  if (!session) return { ok: false, reason: 'unauthenticated' };

  const parsed = photoSchema.safeParse(photo);
  if (!parsed.success) return { ok: false, reason: 'invalid' };

  if (saved) await savePhoto(session.userId, parsed.data);
  else await removePhoto(session.userId, parsed.data.id);

  refresh();
  return { ok: true, saved };
}
