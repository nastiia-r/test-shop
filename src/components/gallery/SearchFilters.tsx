import type { Route } from 'next';
import Link from 'next/link';

import { buildHref } from '@/lib/search-params';
import type { Orientation, SearchOrder } from '@/lib/unsplash/types';

import styles from './SearchFilters.module.scss';

const ORIENTATIONS: { value?: Orientation; label: string }[] = [
  { label: 'Any' },
  { value: 'landscape', label: 'Landscape' },
  { value: 'portrait', label: 'Portrait' },
  { value: 'squarish', label: 'Square' },
];

const ORDERS: { value: SearchOrder; label: string }[] = [
  { value: 'relevant', label: 'Relevance' },
  { value: 'latest', label: 'Newest' },
];

interface SearchFiltersProps {
  pathname: string;
  orientation?: Orientation;
  order: SearchOrder;
}

export function SearchFilters({ pathname, orientation, order }: SearchFiltersProps) {
  const current = { orientation, order_by: order === 'latest' ? 'latest' : undefined };

  return (
    <div className={styles.filters}>
      <div className={styles.group} role="group" aria-label="Orientation">
        {ORIENTATIONS.map((option) => (
          <Link
            key={option.label}
            href={buildHref(pathname, current, { orientation: option.value, page: 1 }) as Route}
            className={styles.chip}
            aria-current={option.value === orientation ? 'true' : undefined}
            scroll={false}
          >
            {option.label}
          </Link>
        ))}
      </div>
      <div className={styles.group} role="group" aria-label="Sort by">
        {ORDERS.map((option) => (
          <Link
            key={option.value}
            href={
              buildHref(pathname, current, {
                order_by: option.value === 'latest' ? 'latest' : undefined,
                page: 1,
              }) as Route
            }
            className={styles.chip}
            aria-current={option.value === order ? 'true' : undefined}
            scroll={false}
          >
            {option.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
