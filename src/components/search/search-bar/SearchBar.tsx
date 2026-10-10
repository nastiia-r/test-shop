'use client';

import type { Route } from 'next';
import { usePathname, useRouter } from 'next/navigation';
import { type FormEvent, useRef, useState } from 'react';

import { normalizeQuery, queryToSlug, slugToQuery } from '@/shared/lib/search-params';
import { SearchField } from '@/shared/ui/search-field';

import styles from './SearchBar.module.scss';

const SEARCH_PATH = /^\/s\/photos\/([^/]+)/;
const PLACEHOLDER = 'Search photos';

function queryFromPath(pathname: string): string {
  const match = SEARCH_PATH.exec(pathname);
  return match ? slugToQuery(match[1]) : '';
}

export function SearchBar() {
  const pathname = usePathname();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(() => queryFromPath(pathname));

  const [syncedPathname, setSyncedPathname] = useState(pathname);
  if (pathname !== syncedPathname) {
    setSyncedPathname(pathname);
    setValue(queryFromPath(pathname));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = normalizeQuery(value);
    if (!query) {
      inputRef.current?.focus();
      return;
    }
    inputRef.current?.blur();
    router.push(`/s/photos/${queryToSlug(query)}` as Route);
  }

  function handleClear() {
    setValue('');
    inputRef.current?.focus();
  }

  return (
    <form role="search" action="/search" className={styles.form} onSubmit={handleSubmit}>
      <SearchField
        inputRef={inputRef}
        name="q"
        placeholder={PLACEHOLDER}
        aria-label={PLACEHOLDER}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onClear={handleClear}
      />
    </form>
  );
}

export function SearchBarFallback() {
  return (
    <form role="search" action="/search" className={styles.form}>
      <SearchField name="q" placeholder={PLACEHOLDER} aria-label={PLACEHOLDER} defaultValue="" />
    </form>
  );
}
