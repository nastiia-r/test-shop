import { Suspense } from 'react';

import { getGridDensity } from '@/server/preferences';
import { DEFAULT_GRID_DENSITY } from '@/shared/lib/grid-density';

import { LayoutToggleControl } from './LayoutToggleControl';

export function LayoutToggle() {
  return (
    <Suspense fallback={<LayoutToggleControl serverDensity={DEFAULT_GRID_DENSITY} />}>
      <SavedLayoutToggle />
    </Suspense>
  );
}

async function SavedLayoutToggle() {
  return <LayoutToggleControl serverDensity={await getGridDensity()} />;
}
