import 'server-only';

import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { connection } from 'next/server';
import { cache } from 'react';

const COOKIE_NAME = 'picky_session';
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export interface Session {
  userId: string;
  name: string;
  email: string;
}

function secretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (secret) return new TextEncoder().encode(secret);
  if (process.env.NODE_ENV === 'production') {
    throw new Error('AUTH_SECRET must be set in production');
  }
  return new TextEncoder().encode('picky-development-secret-do-not-use-in-production');
}

export async function createSession(session: Session): Promise<void> {
  const token = await new SignJWT({ name: session.name, email: session.email })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(session.userId)
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(secretKey());

  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function deleteSession(): Promise<void> {
  (await cookies()).delete(COOKIE_NAME);
}

export const getSession = cache(async (): Promise<Session | null> => {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;

  await connection();

  try {
    const { payload } = await jwtVerify<{ name: string; email: string }>(token, secretKey(), {
      algorithms: ['HS256'],
    });
    if (!payload.sub) return null;
    return { userId: payload.sub, name: payload.name, email: payload.email };
  } catch {
    return null;
  }
});
