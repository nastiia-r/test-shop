import type { Metadata } from 'next';
import { Suspense } from 'react';

import { FeedPageSkeleton } from '@/components/gallery/FeedPageSkeleton';
import { SearchCollection } from '@/components/gallery/SearchCollection';
import { parsePage, queryToSlug, slugToQuery } from '@/lib/search-params';

type Props = PageProps<'/t/[tag]'>;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tag = slugToQuery((await params).tag);
  return { title: `#${tag} photos` };
}

async function TagCollection({ params, searchParams }: Props) {
  const [{ tag: slug }, { page }] = await Promise.all([params, searchParams]);
  const tag = slugToQuery(slug);

  return <SearchCollection variant="tag" query={tag} pathname={`/t/${queryToSlug(tag)}`} page={parsePage(page)} />;
}

export default function TagPage(props: Props) {
  return (
    <Suspense fallback={<FeedPageSkeleton />}>
      <TagCollection {...props} />
    </Suspense>
  );
}
