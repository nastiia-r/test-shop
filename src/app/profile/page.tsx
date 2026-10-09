import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

import { FeedPageSkeleton } from '@/components/gallery/FeedPageSkeleton';
import { LayoutToggle } from '@/components/gallery/LayoutToggle';
import { PhotoFeed } from '@/components/gallery/PhotoFeed';
import { getSession } from '@/lib/auth/session';
import { getSavedPhotos } from '@/lib/db/saved';
import { parsePage } from '@/lib/search-params';
import { PER_PAGE } from '@/lib/unsplash/client';

export const metadata: Metadata = { title: 'Your collection' };

async function Collection({ searchParams }: PageProps<'/profile'>) {
  const session = await getSession();
  if (!session) redirect('/login?next=/profile');

  const page = parsePage((await searchParams).page);
  const saved = await getSavedPhotos(session.userId);
  const totalPages = Math.max(1, Math.ceil(saved.length / PER_PAGE));
  const photos = saved.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="container">
      <header className="page-head">
        <div>
          <h1 className="page-title">{session.name}</h1>
          <p className="page-subtitle">
            {saved.length === 0
              ? 'Your collection is empty.'
              : `${saved.length} saved ${saved.length === 1 ? 'photo' : 'photos'}`}
          </p>
        </div>
        <LayoutToggle />
      </header>

      <PhotoFeed
        result={{ photos, page, totalPages, total: saved.length }}
        pathname="/profile"
        emptyTitle={page > 1 ? 'Nothing on this page' : 'No saved photos yet'}
        emptyText="Hover over any photo in the feed and press the heart to keep it here."
      />
    </div>
  );
}

export default function ProfilePage(props: PageProps<'/profile'>) {
  return (
    <Suspense fallback={<FeedPageSkeleton />}>
      <Collection {...props} />
    </Suspense>
  );
}
