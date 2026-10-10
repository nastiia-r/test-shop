import 'server-only';

import { cookies } from 'next/headers';

import { GRID_DENSITY_COOKIE, type GridDensity, parseGridDensity } from '@/shared/lib/grid-density';

export async function getGridDensity(): Promise<GridDensity> {
  return parseGridDensity((await cookies()).get(GRID_DENSITY_COOKIE)?.value);
}
