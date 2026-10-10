import type { InputHTMLAttributes, Ref } from 'react';

import { cn } from '@/shared/lib/cn';
import { CloseIcon, SearchIcon } from '@/shared/ui/icons';

import styles from './SearchField.module.scss';

type SearchFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  inputRef?: Ref<HTMLInputElement>;
  onClear?: () => void;
  submitLabel?: string;
  clearLabel?: string;
};

export function SearchField({
  inputRef,
  onClear,
  submitLabel = 'Search',
  clearLabel = 'Clear search',
  className,
  value,
  ...props
}: SearchFieldProps) {
  return (
    <div className={cn(styles.field, className)}>
      <button type="submit" className={cn(styles.iconButton, styles.submit)} aria-label={submitLabel}>
        <SearchIcon size={18} />
      </button>
      <input
        ref={inputRef}
        type="search"
        className={styles.input}
        autoComplete="off"
        enterKeyHint="search"
        value={value}
        {...props}
      />
      {value && onClear ? (
        <button type="button" className={styles.iconButton} onClick={onClear} aria-label={clearLabel}>
          <CloseIcon size={16} />
        </button>
      ) : null}
    </div>
  );
}
