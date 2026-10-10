import { APP_NAME, UNSPLASH_URL } from '@/shared/config';
import { withUtm } from '@/shared/lib/utm';

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
          <a href={withUtm(UNSPLASH_URL)} target="_blank" rel="noopener noreferrer">
            Unsplash
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
