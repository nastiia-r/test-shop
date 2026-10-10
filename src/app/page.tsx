import { Suspense } from 'react';

import { UnsplashErrorState } from '@/components/common/unsplash-error-state';
import { GridSkeleton } from '@/components/feed/feed-skeleton';
import { LayoutToggle } from '@/components/feed/layout-toggle';
import { PhotoFeed } from '@/components/feed/photo-feed';
import { TopicNav } from '@/components/layout/topic-nav';
import { getEditorialPhotos } from '@/server/unsplash/client';
import { parsePage } from '@/shared/lib/search-params';
import { tryUnsplash } from '@/shared/lib/unsplash-errors';
import { Container } from '@/shared/ui/container';
import { PageHeader } from '@/shared/ui/page-header';

type Props = PageProps<'/'>;

async function EditorialFeed({ searchParams }: Pick<Props, 'searchParams'>) {
  const page = parsePage((await searchParams).page);
  const result = await tryUnsplash(() => getEditorialPhotos(page));
  if (!result.ok) return <UnsplashErrorState kind={result.kind} />;

  return <PhotoFeed result={result.data} pathname="/" />;
}

export default function HomePage({ searchParams }: Props) {
  return (
    <>
      <TopicNav />
      <Container>
        <PageHeader
          title="Editorial"
          subtitle="The internet’s source for visuals. Powered by creators everywhere, curated by the Unsplash editors."
          actions={<LayoutToggle />}
        />
        <Suspense fallback={<GridSkeleton />}>
          <EditorialFeed searchParams={searchParams} />
        </Suspense>
      </Container>
    </>
  );
}
