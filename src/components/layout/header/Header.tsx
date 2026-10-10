import Link from 'next/link';
import { Suspense } from 'react';

import { SearchBar, SearchBarFallback } from '@/components/search/search-bar';
import { APP_NAME } from '@/shared/config';
import { Logo } from '@/shared/ui/icons';

import { UserNav } from './UserNav';
import styles from './Header.module.scss';

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo} aria-label={`${APP_NAME} home`}>
          <Logo />
          <span className={styles.logoText}>{APP_NAME}</span>
        </Link>

        <Suspense fallback={<SearchBarFallback />}>
          <SearchBar />
        </Suspense>

        <Suspense fallback={<div className={styles.navPlaceholder} />}>
          <UserNav />
        </Suspense>
      </div>
    </header>
  );
}
