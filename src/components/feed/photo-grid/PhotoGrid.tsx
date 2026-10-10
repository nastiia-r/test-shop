import { GridDensityFrame } from '@/components/feed/grid-density';
import { DownloadButton } from '@/components/photo/download-button';
import { PhotoCard } from '@/components/photo/photo-card';
import { SaveButton } from '@/components/photo/save-button';
import type { Viewer } from '@/server/viewer';
import type { GridDensity } from '@/shared/lib/grid-density';
import { distributeIntoColumns } from '@/shared/lib/masonry';
import type { Photo } from '@/shared/types/photo';

import styles from './PhotoGrid.module.scss';

const COLUMN_COUNTS = [1, 2, 3, 5] as const;

interface PhotoGridProps {
  photos: Photo[];
  viewer: Viewer;
  density: GridDensity;
}

export function PhotoGrid({ photos, viewer, density }: PhotoGridProps) {
  const isAuthenticated = viewer.session !== null;

  return (
    <GridDensityFrame serverDensity={density} className={styles.grid}>
      {COLUMN_COUNTS.map((count) => (
        <div key={count} className={styles.layout} data-columns={count}>
          {distributeIntoColumns(photos, count).map((column, index) => (
            <div key={index} className={styles.column}>
              {column.map((photo) => (
                <PhotoCard
                  key={photo.id}
                  photo={photo}
                  sizes={`${Math.ceil(100 / count)}vw`}
                  topActions={
                    <SaveButton
                      photo={photo}
                      initialSaved={viewer.savedIds.has(photo.id)}
                      isAuthenticated={isAuthenticated}
                    />
                  }
                  bottomActions={<DownloadButton photoId={photo.id} />}
                />
              ))}
            </div>
          ))}
        </div>
      ))}
    </GridDensityFrame>
  );
}
