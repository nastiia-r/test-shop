'use server';

import { cookies } from 'next/headers';

import { GRID_DENSITY_COOKIE, parseGridDensity } from '@/shared/lib/grid-density';

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export async function saveGridDensity(value: unknown): Promise<void> {
  (await cookies()).set(GRID_DENSITY_COOKIE, parseGridDensity(value), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: ONE_YEAR_SECONDS,
  });
}
