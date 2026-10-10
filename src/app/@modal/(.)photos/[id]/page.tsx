import { Suspense } from 'react';

import { PhotoDetails, PhotoDetailsSkeleton, PhotoModal } from '@/components/photo/photo-details';

type Props = PageProps<'/photos/[id]'>;

async function PhotoContent({ params }: Pick<Props, 'params'>) {
  const { id } = await params;
  return <PhotoDetails id={id} inModal />;
}

export default function PhotoModalPage({ params }: Props) {
  return (
    <PhotoModal>
      <Suspense fallback={<PhotoDetailsSkeleton inModal />}>
        <PhotoContent params={params} />
      </Suspense>
    </PhotoModal>
  );
}
