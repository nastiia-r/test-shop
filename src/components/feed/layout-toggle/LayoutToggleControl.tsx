'use client';

import { useGridDensity } from '@/hooks/use-grid-density';
import type { GridDensity } from '@/shared/lib/grid-density';
import { GridComfortIcon, GridDenseIcon } from '@/shared/ui/icons';
import { SegmentedControl, type SegmentedOption } from '@/shared/ui/segmented-control';

import styles from './LayoutToggleControl.module.scss';

const OPTIONS: readonly SegmentedOption<GridDensity>[] = [
  { value: 'comfortable', label: '3 columns', icon: <GridComfortIcon size={18} /> },
  { value: 'dense', label: '5 columns', icon: <GridDenseIcon size={18} /> },
];

export function LayoutToggleControl({ serverDensity }: { serverDensity: GridDensity }) {
  const { density, setDensity } = useGridDensity(serverDensity);

  return (
    <SegmentedControl
      label="Grid layout"
      options={OPTIONS}
      value={density}
      onChange={setDensity}
      className={styles.toggle}
    />
  );
}
