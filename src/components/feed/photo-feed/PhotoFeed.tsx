import type { Route } from 'next';

import { PhotoGrid } from '@/components/feed/photo-grid';
import { getGridDensity } from '@/server/preferences';
import { getViewer } from '@/server/viewer';
import { buildHref } from '@/shared/lib/search-params';
import type { PhotoPage } from '@/shared/types/photo';
import { LinkButton } from '@/shared/ui/button';
import { EmptyState } from '@/shared/ui/empty-state';
import { Pagination } from '@/shared/ui/pagination';

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
  query = {},
  emptyTitle = 'No photos found',
  emptyText = 'Try a different search term or check your spelling.',
}: PhotoFeedProps) {
  const [viewer, density] = await Promise.all([getViewer(), getGridDensity()]);
  const hrefForPage = (page: number) => buildHref(pathname, query, { page }) as Route;

  if (result.photos.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyText}
        actions={
          result.page > 1 && (
            <LinkButton href={hrefForPage(1)} size="lg">
              Back to first page
            </LinkButton>
          )
        }
      />
    );
  }

  return (
    <>
      <PhotoGrid photos={result.photos} viewer={viewer} density={density} />
      <Pagination page={result.page} totalPages={result.totalPages} getHref={hrefForPage} />
    </>
  );
}
