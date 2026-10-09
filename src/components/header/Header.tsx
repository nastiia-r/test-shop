import Link from 'next/link';
import { Suspense } from 'react';

import { Logo } from '@/components/icons';
import { APP_NAME } from '@/lib/unsplash/attribution';

import styles from './Header.module.scss';
import { SearchBar, SearchBarPlaceholder } from './SearchBar';
import { UserNav } from './UserNav';

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo} aria-label={`${APP_NAME} home`}>
          <Logo />
          <span className={styles.logoText}>{APP_NAME}</span>
        </Link>

        <Suspense fallback={<SearchBarPlaceholder />}>
          <SearchBar />
        </Suspense>

        <Suspense fallback={<div className={styles.navPlaceholder} />}>
          <UserNav />
        </Suspense>
      </div>
    </header>
  );
}
