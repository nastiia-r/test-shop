import { UnsplashErrorState } from '@/components/common/unsplash-error-state';
import { LayoutToggle } from '@/components/feed/layout-toggle';
import { PhotoFeed } from '@/components/feed/photo-feed';
import { SearchFilters } from '@/components/search/search-filters';
import { searchPhotos } from '@/server/unsplash/client';
import { toSearchQuery } from '@/shared/lib/search-filters';
import { tryUnsplash } from '@/shared/lib/unsplash-errors';
import type { Orientation, SearchOrder } from '@/shared/types/photo';
import { Container } from '@/shared/ui/container';
import { PageHeader } from '@/shared/ui/page-header';

const formatCount = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });

interface SearchFeedProps {
  query: string;
  pathname: string;
  page: number;
  variant: 'search' | 'tag';
  orientation?: Orientation;
  order?: SearchOrder;
}

function describeTotal(total: number, query: string, variant: SearchFeedProps['variant']): string {
  const count = formatCount.format(total);
  return variant === 'tag'
    ? `${count} free photos tagged “${query}”, from the Unsplash community.`
    : `${count} results for “${query}”`;
}

export async function SearchFeed({ query, pathname, page, variant, orientation, order = 'relevant' }: SearchFeedProps) {
  const result = await tryUnsplash(() => searchPhotos({ query, page, orientation, orderBy: order }));

  return (
    <Container>
      <PageHeader
        title={variant === 'tag' ? `#${query}` : query}
        subtitle={result.ok ? describeTotal(result.data.total, query, variant) : undefined}
        actions={<LayoutToggle />}
      />

      {variant === 'search' && <SearchFilters pathname={pathname} orientation={orientation} order={order} />}

      {result.ok ? (
        <PhotoFeed
          result={result.data}
          pathname={pathname}
          query={toSearchQuery(orientation, order)}
          emptyTitle={`No photos for “${query}”`}
        />
      ) : (
        <UnsplashErrorState kind={result.kind} />
      )}
    </Container>
  );
}
