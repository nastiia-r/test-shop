import { Suspense } from 'react';

import { Modal } from '@/components/photo/Modal';
import { PhotoSkeleton } from '@/components/photo/PhotoSkeleton';
import { PhotoView } from '@/components/photo/PhotoView';

type Props = PageProps<'/photos/[id]'>;

async function PhotoContent({ params }: Pick<Props, 'params'>) {
  const { id } = await params;
  return <PhotoView id={id} inModal />;
}

export default function PhotoModal({ params }: Props) {
  return (
    <Modal label="Photo details">
      <Suspense fallback={<PhotoSkeleton />}>
        <PhotoContent params={params} />
      </Suspense>
    </Modal>
  );
}
