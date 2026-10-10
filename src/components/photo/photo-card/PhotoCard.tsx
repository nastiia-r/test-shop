import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { AuthorLink } from '@/components/photo/author-link';
import type { Photo } from '@/shared/types/photo';

import styles from './PhotoCard.module.scss';

interface PhotoCardProps {
  photo: Photo;
  sizes: string;
  topActions?: ReactNode;
  bottomActions?: ReactNode;
}

export function PhotoCard({ photo, sizes, topActions, bottomActions }: PhotoCardProps) {
  return (
    <figure className={styles.card}>
      <div className={styles.touchHeader}>
        <AuthorLink author={photo.author} />
      </div>

      <div className={styles.media} style={{ backgroundColor: photo.color }}>
        <Link href={`/photos/${photo.id}`} scroll={false} className={styles.link}>
          <Image
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            sizes={sizes}
            className={styles.image}
          />
        </Link>

        <div className={styles.overlay}>
          <div className={styles.overlayTop}>{topActions}</div>
          <div className={styles.overlayBottom}>
            <AuthorLink author={photo.author} className={styles.overlayAuthor} />
            {bottomActions}
          </div>
        </div>
      </div>

      <figcaption className={styles.touchFooter}>
        {topActions}
        {bottomActions}
      </figcaption>
    </figure>
  );
}
