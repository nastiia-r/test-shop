import type { Metadata } from 'next';
import { Suspense } from 'react';

import { PhotoDetails } from '@/components/photo/photo-details';
import { PhotoDetailsSkeleton } from '@/components/photo/photo-details';
import { getPhoto } from '@/server/unsplash/client';
import { tryUnsplash } from '@/shared/lib/unsplash-errors';

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
  return <PhotoDetails id={id} />;
}

export default function PhotoPage({ params }: Props) {
  return (
    <Suspense fallback={<PhotoDetailsSkeleton />}>
      <PhotoContent params={params} />
    </Suspense>
  );
}
