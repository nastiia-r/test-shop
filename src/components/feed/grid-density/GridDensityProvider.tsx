'use client';

import { type ReactNode, useMemo, useState, useTransition } from 'react';

import { GridDensityContext } from '@/hooks/use-grid-density';
import { saveGridDensity } from '@/server/actions/preferences';
import type { GridDensity } from '@/shared/lib/grid-density';

export function GridDensityProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<GridDensity | null>(null);
  const [, startTransition] = useTransition();

  const value = useMemo(
    () => ({
      selected,
      select: (density: GridDensity) => {
        setSelected(density);
        startTransition(() => saveGridDensity(density));
      },
    }),
    [selected],
  );

  return <GridDensityContext value={value}>{children}</GridDensityContext>;
}
