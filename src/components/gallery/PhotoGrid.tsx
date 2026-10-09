import { distributeIntoColumns } from '@/lib/masonry';
import type { Photo } from '@/lib/unsplash/types';

import { PhotoCard } from './PhotoCard';
import styles from './PhotoGrid.module.scss';

const COLUMN_COUNTS = [1, 2, 3, 5] as const;

interface PhotoGridProps {
  photos: Photo[];
  savedIds: ReadonlySet<string>;
  isAuthenticated: boolean;
}

export function PhotoGrid({ photos, savedIds, isAuthenticated }: PhotoGridProps) {
  return (
    <div className={styles.grid}>
      {COLUMN_COUNTS.map((count) => (
        <div key={count} className={styles.layout} data-columns={count}>
          {distributeIntoColumns(photos, count).map((column, index) => (
            <div key={index} className={styles.column}>
              {column.map((photo) => (
                <PhotoCard
                  key={photo.id}
                  photo={photo}
                  saved={savedIds.has(photo.id)}
                  isAuthenticated={isAuthenticated}
                  sizes={`${Math.ceil(100 / count)}vw`}
                />
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
