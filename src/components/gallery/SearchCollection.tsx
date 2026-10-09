import { ApiErrorState, tryUnsplash } from '@/components/ApiErrorState';
import { TopicNav } from '@/components/header/TopicNav';
import type { Orientation, SearchOrder } from '@/lib/unsplash/types';
import { searchPhotos } from '@/lib/unsplash/client';

import { LayoutToggle } from './LayoutToggle';
import { PhotoFeed } from './PhotoFeed';
import { SearchFilters } from './SearchFilters';

const formatCount = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });

interface SearchCollectionProps {
  query: string;
  pathname: string;
  page: number;
  variant: 'search' | 'tag';
  orientation?: Orientation;
  order?: SearchOrder;
}

export async function SearchCollection({
  query,
  pathname,
  page,
  variant,
  orientation,
  order = 'relevant',
}: SearchCollectionProps) {
  const result = await tryUnsplash(() => searchPhotos({ query, page, orientation, orderBy: order }));
  const total = result.ok ? result.data.total : null;

  const subtitle =
    total === null
      ? null
      : variant === 'tag'
        ? `${formatCount.format(total)} free photos tagged “${query}”, from the Unsplash community.`
        : `${formatCount.format(total)} results for “${query}”`;

  return (
    <>
      {variant === 'tag' && <TopicNav active={query} />}
      <div className="container">
        <header className="page-head">
          <div>
            <h1 className="page-title">{variant === 'tag' ? `#${query}` : query}</h1>
            {subtitle && <p className="page-subtitle">{subtitle}</p>}
          </div>
          <LayoutToggle />
        </header>

        {variant === 'search' && <SearchFilters pathname={pathname} orientation={orientation} order={order} />}

        {result.ok ? (
          <PhotoFeed
            result={result.data}
            pathname={pathname}
            query={{ orientation, order_by: order === 'latest' ? 'latest' : undefined }}
            emptyTitle={`No photos for “${query}”`}
          />
        ) : (
          <ApiErrorState kind={result.kind} />
        )}
      </div>
    </>
  );
}
