import type { Metadata } from 'next';
import { Suspense } from 'react';

import { FeedPageSkeleton } from '@/components/gallery/FeedPageSkeleton';
import { SearchCollection } from '@/components/gallery/SearchCollection';
import { parseOrder, parseOrientation, parsePage, queryToSlug, slugToQuery } from '@/lib/search-params';

type Props = PageProps<'/s/photos/[query]'>;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const query = slugToQuery((await params).query);
  return { title: `${query.charAt(0).toUpperCase()}${query.slice(1)} pictures` };
}

async function SearchResults({ params, searchParams }: Props) {
  const [{ query: slug }, filters] = await Promise.all([params, searchParams]);
  const query = slugToQuery(slug);

  return (
    <SearchCollection
      variant="search"
      query={query}
      pathname={`/s/photos/${queryToSlug(query)}`}
      page={parsePage(filters.page)}
      orientation={parseOrientation(filters.orientation)}
      order={parseOrder(filters.order_by)}
    />
  );
}

export default function SearchPage(props: Props) {
  return (
    <Suspense fallback={<FeedPageSkeleton />}>
      <SearchResults {...props} />
    </Suspense>
  );
}
