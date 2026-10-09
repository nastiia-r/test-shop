import type { Metadata } from 'next';
import { Suspense } from 'react';

import { tryUnsplash } from '@/components/ApiErrorState';
import { PhotoSkeleton } from '@/components/photo/PhotoSkeleton';
import { PhotoView } from '@/components/photo/PhotoView';
import { getPhoto } from '@/lib/unsplash/client';

type Props = PageProps<'/photos/[id]'>;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const result = await tryUnsplash(async () => getPhoto((await params).id));
  if (!result.ok) return { title: 'Photo' };

  const photo = result.data;
  const title = `${photo.alt.charAt(0).toUpperCase()}${photo.alt.slice(1)} — photo by ${photo.author.name}`;
  return {
    title,
    description: photo.description ?? `Free photo by ${photo.author.name} on Unsplash.`,
    openGraph: {
      title,
      images: [{ url: `${photo.src}&w=1200&q=80&auto=format`, width: 1200 }],
    },
  };
}

async function PhotoContent({ params }: Pick<Props, 'params'>) {
  const { id } = await params;
  return <PhotoView id={id} />;
}

export default function PhotoPage({ params }: Props) {
  return (
    <Suspense fallback={<PhotoSkeleton />}>
      <PhotoContent params={params} />
    </Suspense>
  );
}
