import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

import { FeedPageSkeleton } from '@/components/feed/feed-skeleton';
import { LayoutToggle } from '@/components/feed/layout-toggle';
import { PhotoFeed } from '@/components/feed/photo-feed';
import { getSession } from '@/server/auth/session';
import { getSavedPhotos } from '@/server/db/collection';
import { PER_PAGE } from '@/server/unsplash/client';
import { parsePage } from '@/shared/lib/search-params';
import { Container } from '@/shared/ui/container';
import { PageHeader } from '@/shared/ui/page-header';

export const metadata: Metadata = { title: 'Your collection' };

type Props = PageProps<'/profile'>;

function describeCount(count: number): string {
  if (count === 0) return 'Your collection is empty.';
  return `${count} saved ${count === 1 ? 'photo' : 'photos'}`;
}

async function Collection({ searchParams }: Props) {
  const session = await getSession();
  if (!session) redirect('/login?next=/profile');

  const page = parsePage((await searchParams).page);
  const saved = await getSavedPhotos(session.userId);
  const totalPages = Math.max(1, Math.ceil(saved.length / PER_PAGE));
  const photos = saved.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <Container>
      <PageHeader title={session.name} subtitle={describeCount(saved.length)} actions={<LayoutToggle />} />
      <PhotoFeed
        result={{ photos, page, totalPages, total: saved.length }}
        pathname="/profile"
        emptyTitle={page > 1 ? 'Nothing on this page' : 'No saved photos yet'}
        emptyText="Hover over any photo in the feed and press the heart to keep it here."
      />
    </Container>
  );
}

export default function ProfilePage(props: Props) {
  return (
    <Suspense fallback={<FeedPageSkeleton />}>
      <Collection {...props} />
    </Suspense>
  );
}
