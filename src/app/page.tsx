import { Suspense } from 'react';

import { ApiErrorState, tryUnsplash } from '@/components/ApiErrorState';
import { GridSkeleton } from '@/components/gallery/GridSkeleton';
import { LayoutToggle } from '@/components/gallery/LayoutToggle';
import { PhotoFeed } from '@/components/gallery/PhotoFeed';
import { TopicNav } from '@/components/header/TopicNav';
import { parsePage } from '@/lib/search-params';
import { getEditorialPhotos } from '@/lib/unsplash/client';

async function EditorialFeed({ searchParams }: { searchParams: PageProps<'/'>['searchParams'] }) {
  const page = parsePage((await searchParams).page);
  const result = await tryUnsplash(() => getEditorialPhotos(page));
  if (!result.ok) return <ApiErrorState kind={result.kind} />;

  return <PhotoFeed result={result.data} pathname="/" />;
}

export default function HomePage({ searchParams }: PageProps<'/'>) {
  return (
    <>
      <TopicNav />
      <div className="container">
        <header className="page-head">
          <div>
            <h1 className="page-title">Editorial</h1>
            <p className="page-subtitle">
              The internet’s source for visuals. Powered by creators everywhere, curated by the Unsplash editors.
            </p>
          </div>
          <LayoutToggle />
        </header>

        <Suspense fallback={<GridSkeleton />}>
          <EditorialFeed searchParams={searchParams} />
        </Suspense>
      </div>
    </>
  );
}
