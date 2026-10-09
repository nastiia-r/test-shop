import { APP_NAME, UNSPLASH_HOME } from '@/lib/unsplash/attribution';

import styles from './Footer.module.scss';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p>
          <strong>{APP_NAME}</strong> — a mini Unsplash clone built with Next.js.
        </p>
        <p>
          Photos provided by{' '}
          <a href={UNSPLASH_HOME} target="_blank" rel="noopener noreferrer">
            Unsplash
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
