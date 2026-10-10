import type { Route } from 'next';

import { toSearchQuery } from '@/shared/lib/search-filters';
import { buildHref } from '@/shared/lib/search-params';
import type { Orientation, SearchOrder } from '@/shared/types/photo';
import { Chip } from '@/shared/ui/chip';

import styles from './SearchFilters.module.scss';

const ORIENTATION_OPTIONS: { value?: Orientation; label: string }[] = [
  { label: 'Any' },
  { value: 'landscape', label: 'Landscape' },
  { value: 'portrait', label: 'Portrait' },
  { value: 'squarish', label: 'Square' },
];

const ORDER_OPTIONS: { value: SearchOrder; label: string }[] = [
  { value: 'relevant', label: 'Relevance' },
  { value: 'latest', label: 'Newest' },
];

interface SearchFiltersProps {
  pathname: string;
  orientation?: Orientation;
  order: SearchOrder;
}

export function SearchFilters({ pathname, orientation, order }: SearchFiltersProps) {
  const current = toSearchQuery(orientation, order);
  const hrefWith = (patch: Record<string, string | undefined>) =>
    buildHref(pathname, current, { ...patch, page: 1 }) as Route;

  return (
    <div className={styles.filters}>
      <div className={styles.group} role="group" aria-label="Orientation">
        {ORIENTATION_OPTIONS.map((option) => (
          <Chip
            key={option.label}
            href={hrefWith({ orientation: option.value })}
            active={option.value === orientation}
            scroll={false}
          >
            {option.label}
          </Chip>
        ))}
      </div>
      <div className={styles.group} role="group" aria-label="Sort by">
        {ORDER_OPTIONS.map((option) => (
          <Chip
            key={option.value}
            href={hrefWith(toSearchQuery(orientation, option.value))}
            active={option.value === order}
            scroll={false}
          >
            {option.label}
          </Chip>
        ))}
      </div>
    </div>
  );
}
