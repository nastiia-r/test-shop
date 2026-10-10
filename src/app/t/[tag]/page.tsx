import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { FeedPageSkeleton } from '@/components/feed/feed-skeleton';
import { SearchFeed } from '@/components/feed/search-feed';
import { TopicNav } from '@/components/layout/topic-nav';
import { parsePage, queryToSlug, slugToQuery } from '@/shared/lib/search-params';

type Props = PageProps<'/t/[tag]'>;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tag = slugToQuery((await params).tag);
  return { title: `#${tag} photos` };
}

async function TagCollection({ params, searchParams }: Props) {
  const [{ tag: slug }, { page }] = await Promise.all([params, searchParams]);
  const tag = slugToQuery(slug);
  if (!tag) notFound();

  return (
    <>
      <TopicNav active={tag} />
      <SearchFeed variant="tag" query={tag} pathname={`/t/${queryToSlug(tag)}`} page={parsePage(page)} />
    </>
  );
}

export default function TagPage(props: Props) {
  return (
    <Suspense fallback={<FeedPageSkeleton />}>
      <TagCollection {...props} />
    </Suspense>
  );
}
