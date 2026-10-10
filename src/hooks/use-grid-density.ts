'use client';

import { createContext, useContext } from 'react';

import type { GridDensity } from '@/shared/lib/grid-density';

interface GridDensityContextValue {
  selected: GridDensity | null;
  select: (density: GridDensity) => void;
}

export const GridDensityContext = createContext<GridDensityContextValue | null>(null);

export function useGridDensity(serverDensity: GridDensity) {
  const context = useContext(GridDensityContext);
  if (!context) throw new Error('useGridDensity must be used inside <GridDensityProvider>');

  return { density: context.selected ?? serverDensity, setDensity: context.select };
}
