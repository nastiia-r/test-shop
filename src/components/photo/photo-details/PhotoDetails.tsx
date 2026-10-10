import type { Route } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import { UnsplashErrorState } from '@/components/common/unsplash-error-state';
import { RelatedPhotos } from '@/components/feed/related-photos';
import { AuthorLink } from '@/components/photo/author-link';
import { DownloadButton } from '@/components/photo/download-button';
import { SaveButton } from '@/components/photo/save-button';
import { getPhoto } from '@/server/unsplash/client';
import { getViewer } from '@/server/viewer';
import { toPhotoSummary } from '@/shared/lib/photo';
import { queryToSlug } from '@/shared/lib/search-params';
import { tryUnsplash } from '@/shared/lib/unsplash-errors';
import type { PhotoDetails as PhotoDetailsModel } from '@/shared/types/photo';
import { Chip } from '@/shared/ui/chip';
import { CalendarIcon, CameraIcon, ExternalIcon, MapPinIcon, ShieldIcon } from '@/shared/ui/icons';

import { CloseModalButton } from './CloseModalButton';
import styles from './PhotoDetails.module.scss';

const formatNumber = new Intl.NumberFormat('en-US');
const formatDate = new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeZone: 'UTC' });

interface PhotoDetailsProps {
  id: string;
  inModal?: boolean;
}

export async function PhotoDetails({ id, inModal = false }: PhotoDetailsProps) {
  const [result, viewer] = await Promise.all([tryUnsplash(() => getPhoto(id)), getViewer()]);

  if (!result.ok) {
    if (result.kind === 'not-found') notFound();
    return (
      <>
        {inModal && (
          <div className={styles.bar}>
            <div className={styles.actions}>
              <CloseModalButton />
            </div>
          </div>
        )}
        <UnsplashErrorState kind={result.kind} />
      </>
    );
  }

  const photo = result.data;
  const [relatedTag] = photo.tags;

  return (
    <article className={styles.view} data-modal={inModal || undefined}>
      <header className={styles.bar}>
        <AuthorLink author={photo.author} variant="detailed" />
        <div className={styles.actions}>
          <SaveButton
            photo={toPhotoSummary(photo)}
            initialSaved={viewer.savedIds.has(photo.id)}
            isAuthenticated={viewer.session !== null}
            withLabel
          />
          <DownloadButton photoId={photo.id} variant="primary" withLabel />
          {inModal && <CloseModalButton />}
        </div>
      </header>

      <div className={styles.stage}>
        <Image
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          sizes="(min-width: 1024px) 80vw, 100vw"
          className={styles.image}
          style={{ backgroundColor: photo.color }}
          preload
        />
      </div>

      <div className={styles.details}>
        <PhotoStats photo={photo} />
        {photo.description && <p className={styles.description}>{photo.description}</p>}
        <PhotoFacts photo={photo} />
        <PhotoExif photo={photo} />
        <PhotoTags tags={photo.tags} />
      </div>

      {relatedTag && (
        <section className={styles.related} aria-labelledby={`related-${photo.id}`}>
          <h2 id={`related-${photo.id}`}>Related images</h2>
          <RelatedPhotos tag={relatedTag} excludeId={photo.id} />
        </section>
      )}
    </article>
  );
}

function PhotoStats({ photo }: { photo: PhotoDetailsModel }) {
  const stats = [
    { label: 'Views', value: photo.views },
    { label: 'Downloads', value: photo.downloads },
    { label: 'Likes', value: photo.likes },
  ].filter((stat): stat is { label: string; value: number } => stat.value !== null);

  return (
    <dl className={styles.stats}>
      {stats.map((stat) => (
        <div key={stat.label}>
          <dt>{stat.label}</dt>
          <dd>{formatNumber.format(stat.value)}</dd>
        </div>
      ))}
    </dl>
  );
}

function PhotoFacts({ photo }: { photo: PhotoDetailsModel }) {
  return (
    <ul className={styles.facts}>
      {photo.location && (
        <li>
          <MapPinIcon size={16} />
          {photo.location}
        </li>
      )}
      <li>
        <CalendarIcon size={16} />
        Published on <time dateTime={photo.createdAt}>{formatDate.format(new Date(photo.createdAt))}</time>
      </li>
      {photo.camera && (
        <li>
          <CameraIcon size={16} />
          {photo.camera}
        </li>
      )}
      <li>
        <ShieldIcon size={16} />
        Free to use under the Unsplash License
      </li>
      <li>
        <ExternalIcon size={16} />
        <a href={photo.unsplashUrl} target="_blank" rel="noopener noreferrer" className={styles.link}>
          View on Unsplash
        </a>
      </li>
    </ul>
  );
}

function PhotoExif({ photo }: { photo: PhotoDetailsModel }) {
  if (photo.exif.length === 0) return null;

  return (
    <dl className={styles.exif}>
      {photo.exif.map((item) => (
        <div key={item.label}>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
      <div>
        <dt>Dimensions</dt>
        <dd>
          {photo.width} × {photo.height}
        </dd>
      </div>
    </dl>
  );
}

function PhotoTags({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null;

  return (
    <ul className={styles.tags} aria-label="Tags">
      {tags.map((tag) => (
        <li key={tag}>
          <Chip href={`/t/${queryToSlug(tag)}` as Route} variant="soft" className={styles.tag}>
            {tag}
          </Chip>
        </li>
      ))}
    </ul>
  );
}
