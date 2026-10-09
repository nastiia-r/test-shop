import type { Route } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { ApiErrorState, tryUnsplash } from '@/components/ApiErrorState';
import { GridSkeleton } from '@/components/gallery/GridSkeleton';
import { PhotoGrid } from '@/components/gallery/PhotoGrid';
import { CalendarIcon, CameraIcon, DownloadIcon, ExternalIcon, MapPinIcon, ShieldIcon } from '@/components/icons';
import { queryToSlug } from '@/lib/search-params';
import { getPhoto, searchPhotos } from '@/lib/unsplash/client';
import { toSummary } from '@/lib/unsplash/mappers';
import { getViewer } from '@/lib/viewer';

import styles from './PhotoView.module.scss';
import { SaveButton } from './SaveButton';

const formatNumber = new Intl.NumberFormat('en-US');
const formatDate = new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeZone: 'UTC' });
const RELATED_LIMIT = 15;

export async function PhotoView({ id, inModal = false }: { id: string; inModal?: boolean }) {
  const [result, viewer] = await Promise.all([tryUnsplash(() => getPhoto(id)), getViewer()]);

  if (!result.ok) {
    if (result.kind === 'not-found') notFound();
    return <ApiErrorState kind={result.kind} />;
  }

  const photo = result.data;
  const isAuthenticated = viewer.session !== null;
  const stats = [
    { label: 'Views', value: photo.views },
    { label: 'Downloads', value: photo.downloads },
    { label: 'Likes', value: photo.likes },
  ].filter((stat): stat is { label: string; value: number } => stat.value !== null);

  return (
    <article className={styles.view} data-modal={inModal || undefined}>
      <header className={styles.bar}>
        <a href={photo.author.profileUrl} target="_blank" rel="noopener noreferrer" className={styles.author}>
          <Image src={photo.author.avatar} alt="" width={40} height={40} className={styles.avatar} />
          <span className={styles.authorText}>
            <strong>{photo.author.name}</strong>
            <span>@{photo.author.username}</span>
          </span>
        </a>
        <div className={styles.actions}>
          <SaveButton
            photo={toSummary(photo)}
            initialSaved={viewer.savedIds.has(photo.id)}
            isAuthenticated={isAuthenticated}
            withLabel
          />
          <a href={`/photos/${photo.id}/download`} className="btn btn--primary" rel="nofollow">
            <DownloadIcon size={16} />
            <span>Download</span>
          </a>
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
        <dl className={styles.stats}>
          {stats.map((stat) => (
            <div key={stat.label}>
              <dt>{stat.label}</dt>
              <dd>{formatNumber.format(stat.value)}</dd>
            </div>
          ))}
        </dl>

        {photo.description && <p className={styles.description}>{photo.description}</p>}

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

        {photo.exif.length > 0 && (
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
        )}

        {photo.tags.length > 0 && (
          <ul className={styles.tags} aria-label="Tags">
            {photo.tags.map((tag) => (
              <li key={tag}>
                <Link href={`/t/${queryToSlug(tag)}` as Route} className={styles.tag}>
                  {tag}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {photo.tags[0] && (
        <section className={styles.related} aria-labelledby={`related-${photo.id}`}>
          <h2 id={`related-${photo.id}`}>Related images</h2>
          <Suspense fallback={<GridSkeleton label="Loading related photos" />}>
            <RelatedPhotos tag={photo.tags[0]} excludeId={photo.id} />
          </Suspense>
        </section>
      )}
    </article>
  );
}

async function RelatedPhotos({ tag, excludeId }: { tag: string; excludeId: string }) {
  const [result, viewer] = await Promise.all([
    tryUnsplash(() => searchPhotos({ query: tag, page: 1, orientation: undefined, orderBy: 'relevant' })),
    getViewer(),
  ]);
  if (!result.ok) return null;

  const photos = result.data.photos.filter((photo) => photo.id !== excludeId).slice(0, RELATED_LIMIT);
  if (photos.length === 0) return null;

  return (
    <>
      <PhotoGrid photos={photos} savedIds={viewer.savedIds} isAuthenticated={viewer.session !== null} />
      <div className={styles.more}>
        <Link href={`/t/${queryToSlug(tag)}` as Route} className="btn btn--lg">
          See all “{tag}” photos
        </Link>
      </div>
    </>
  );
}
