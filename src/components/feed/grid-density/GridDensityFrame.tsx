'use client';

import type { HTMLAttributes } from 'react';

import { useGridDensity } from '@/hooks/use-grid-density';
import type { GridDensity } from '@/shared/lib/grid-density';

type GridDensityFrameProps = HTMLAttributes<HTMLDivElement> & {
  serverDensity: GridDensity;
};

export function GridDensityFrame({ serverDensity, ...props }: GridDensityFrameProps) {
  const { density } = useGridDensity(serverDensity);
  return <div data-density={density} {...props} />;
}
