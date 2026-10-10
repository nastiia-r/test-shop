export type GridDensity = 'comfortable' | 'dense';

export const GRID_DENSITY_COOKIE = 'picky_grid';
export const DEFAULT_GRID_DENSITY: GridDensity = 'comfortable';

export function parseGridDensity(value: unknown): GridDensity {
  return value === 'dense' ? 'dense' : DEFAULT_GRID_DENSITY;
}
