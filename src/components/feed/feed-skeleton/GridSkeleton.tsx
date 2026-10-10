import { GridDensityFrame } from '@/components/feed/grid-density';
import { DEFAULT_GRID_DENSITY } from '@/shared/lib/grid-density';
import { Skeleton } from '@/shared/ui/skeleton';

import styles from './GridSkeleton.module.scss';

const COLUMNS = 5;
const TILES_PER_COLUMN = 3;
const ASPECT_RATIOS = [1.5, 0.67, 1.25, 0.8, 1.4, 1, 0.75, 1.5, 0.67, 1.2, 1.33, 0.9, 1.5, 0.7, 1.1];

export function GridSkeleton({ label = 'Loading photos' }: { label?: string }) {
  return (
    <GridDensityFrame serverDensity={DEFAULT_GRID_DENSITY} className={styles.skeleton} role="status" aria-label={label}>
      {Array.from({ length: COLUMNS }, (_, column) => (
        <div key={column} className={styles.column}>
          {ASPECT_RATIOS.slice(column * TILES_PER_COLUMN, (column + 1) * TILES_PER_COLUMN).map((ratio, index) => (
            <Skeleton key={index} shape="rect" width="100%" aspectRatio={`1 / ${ratio}`} />
          ))}
        </div>
      ))}
    </GridDensityFrame>
  );
}
