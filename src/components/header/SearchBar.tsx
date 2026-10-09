'use client';

import type { Route } from 'next';
import { usePathname, useRouter } from 'next/navigation';
import { type FormEvent, useRef, useState } from 'react';

import { CloseIcon, SearchIcon } from '@/components/icons';
import { normalizeQuery, queryToSlug, slugToQuery } from '@/lib/search-params';

import styles from './SearchBar.module.scss';

function queryFromPath(pathname: string): string {
  const match = /^\/s\/photos\/([^/]+)/.exec(pathname);
  return match ? slugToQuery(match[1]) : '';
}

interface FieldProps {
  value?: string;
  onChange?: (value: string) => void;
  onClear?: () => void;
  inputRef?: React.Ref<HTMLInputElement>;
}

function Field({ value, onChange, onClear, inputRef }: FieldProps) {
  return (
    <>
      <button type="submit" className={styles.submit} aria-label="Search">
        <SearchIcon size={18} />
      </button>
      <input
        ref={inputRef}
        type="search"
        name="q"
        className={styles.input}
        placeholder="Search photos"
        aria-label="Search photos"
        autoComplete="off"
        enterKeyHint="search"
        value={value}
        defaultValue={value === undefined ? '' : undefined}
        onChange={onChange ? (event) => onChange(event.target.value) : undefined}
      />
      {value ? (
        <button type="button" className={styles.clear} onClick={onClear} aria-label="Clear search">
          <CloseIcon size={16} />
        </button>
      ) : null}
    </>
  );
}

export function SearchBar() {
  const pathname = usePathname();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(() => queryFromPath(pathname));

  const [syncedPath, setSyncedPath] = useState(pathname);
  if (pathname !== syncedPath) {
    setSyncedPath(pathname);
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

  return (
    <form role="search" action="/search" className={styles.form} onSubmit={handleSubmit}>
      <Field
        value={value}
        onChange={setValue}
        inputRef={inputRef}
        onClear={() => {
          setValue('');
          inputRef.current?.focus();
        }}
      />
    </form>
  );
}

export function SearchBarPlaceholder() {
  return (
    <form role="search" action="/search" className={styles.form}>
      <Field />
    </form>
  );
}
