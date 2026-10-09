import type { Route } from 'next';
import Link from 'next/link';

import { getViewer } from '@/lib/viewer';
import type { PhotoPage } from '@/lib/unsplash/types';

import { Pagination } from './Pagination';
import { PhotoGrid } from './PhotoGrid';
import styles from './PhotoFeed.module.scss';

interface PhotoFeedProps {
  result: PhotoPage;
  pathname: string;
  query?: Record<string, string | undefined>;
  emptyTitle?: string;
  emptyText?: string;
}

export async function PhotoFeed({
  result,
  pathname,
  query,
  emptyTitle = 'No photos found',
  emptyText = 'Try a different search term or check your spelling.',
}: PhotoFeedProps) {
  const viewer = await getViewer();

  if (result.photos.length === 0) {
    return (
      <div className={styles.empty}>
        <h2>{emptyTitle}</h2>
        <p>{emptyText}</p>
        {result.page > 1 && result.totalPages > 0 ? (
          <Link href={pathname as Route} className="btn btn--lg">
            Back to first page
          </Link>
        ) : null}
      </div>
    );
  }

  return (
    <>
      <PhotoGrid photos={result.photos} savedIds={viewer.savedIds} isAuthenticated={viewer.session !== null} />
      <Pagination page={result.page} totalPages={result.totalPages} pathname={pathname} query={query} />
    </>
  );
}
