import Image from 'next/image';
import Link from 'next/link';

import { DownloadIcon } from '@/components/icons';
import { SaveButton } from '@/components/photo/SaveButton';
import type { Photo } from '@/lib/unsplash/types';

import styles from './PhotoCard.module.scss';

interface PhotoCardProps {
  photo: Photo;
  saved: boolean;
  isAuthenticated: boolean;
  sizes: string;
}

export function PhotoCard({ photo, saved, isAuthenticated, sizes }: PhotoCardProps) {
  const { author } = photo;

  const authorLink = (
    <a href={author.profileUrl} target="_blank" rel="noopener noreferrer" className={styles.author}>
      <Image src={author.avatar} alt="" width={32} height={32} className={styles.avatar} />
      <span className={styles.authorName}>{author.name}</span>
    </a>
  );

  return (
    <figure className={styles.card}>
      <div className={styles.touchHeader}>{authorLink}</div>

      <div className={styles.media} style={{ backgroundColor: photo.color }}>
        <Link href={`/photos/${photo.id}`} scroll={false} className={styles.link} aria-label={photo.alt}>
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
          <div className={styles.overlayTop}>
            <SaveButton photo={photo} initialSaved={saved} isAuthenticated={isAuthenticated} />
          </div>
          <div className={styles.overlayBottom}>
            {authorLink}
            <a
              href={`/photos/${photo.id}/download`}
              className="btn btn--icon"
              aria-label="Download photo"
              title="Download"
              rel="nofollow"
            >
              <DownloadIcon size={18} />
            </a>
          </div>
        </div>
      </div>

      <figcaption className={styles.touchFooter}>
        <SaveButton photo={photo} initialSaved={saved} isAuthenticated={isAuthenticated} />
        <a href={`/photos/${photo.id}/download`} className="btn" rel="nofollow">
          Download
        </a>
      </figcaption>
    </figure>
  );
}
