import type { Route } from 'next';
import { Suspense } from 'react';

import { GridSkeleton } from '@/components/feed/feed-skeleton';
import { PhotoGrid } from '@/components/feed/photo-grid';
import { getGridDensity } from '@/server/preferences';
import { searchPhotos } from '@/server/unsplash/client';
import { getViewer } from '@/server/viewer';
import { queryToSlug } from '@/shared/lib/search-params';
import { tryUnsplash } from '@/shared/lib/unsplash-errors';
import { LinkButton } from '@/shared/ui/button';

import styles from './RelatedPhotos.module.scss';

const RELATED_LIMIT = 15;

interface RelatedPhotosProps {
  tag: string;
  excludeId: string;
}

export function RelatedPhotos(props: RelatedPhotosProps) {
  return (
    <Suspense fallback={<GridSkeleton label="Loading related photos" />}>
      <RelatedPhotosContent {...props} />
    </Suspense>
  );
}

async function RelatedPhotosContent({ tag, excludeId }: RelatedPhotosProps) {
  const [result, viewer, density] = await Promise.all([
    tryUnsplash(() => searchPhotos({ query: tag, page: 1, orientation: undefined, orderBy: 'relevant' })),
    getViewer(),
    getGridDensity(),
  ]);
  if (!result.ok) return null;

  const photos = result.data.photos.filter((photo) => photo.id !== excludeId).slice(0, RELATED_LIMIT);
  if (photos.length === 0) return null;

  return (
    <>
      <PhotoGrid photos={photos} viewer={viewer} density={density} />
      <div className={styles.more}>
        <LinkButton href={`/t/${queryToSlug(tag)}` as Route} size="lg">
          See all “{tag}” photos
        </LinkButton>
      </div>
    </>
  );
}
