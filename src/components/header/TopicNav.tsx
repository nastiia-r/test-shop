import type { Route } from 'next';
import Link from 'next/link';

import { queryToSlug } from '@/lib/search-params';

import styles from './TopicNav.module.scss';

export const TOPICS = [
  'Wallpapers',
  'Nature',
  '3D Renders',
  'Travel',
  'Architecture',
  'Textures',
  'Street Photography',
  'Film',
  'Animals',
  'Fashion',
  'People',
  'Food',
  'Interiors',
  'Experimental',
  'Business',
] as const;

export function TopicNav({ active }: { active?: string }) {
  const current = active?.toLowerCase();

  return (
    <nav className={styles.nav} aria-label="Topics">
      <div className={styles.track}>
        <Link href="/" className={styles.item} aria-current={current === undefined ? 'page' : undefined}>
          Editorial
        </Link>
        <span className={styles.divider} aria-hidden="true" />
        {TOPICS.map((topic) => {
          const isActive = topic.toLowerCase() === current;
          return (
            <Link
              key={topic}
              href={`/t/${queryToSlug(topic)}` as Route}
              className={styles.item}
              aria-current={isActive ? 'page' : undefined}
            >
              {topic}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
