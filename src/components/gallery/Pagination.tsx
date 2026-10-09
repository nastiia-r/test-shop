import type { Route } from 'next';

import { ChevronLeftIcon, ChevronRightIcon } from '@/components/icons';
import { getPageItems } from '@/lib/pagination';
import { buildHref } from '@/lib/search-params';

import { PageLink } from './PageLink';
import styles from './Pagination.module.scss';

interface PaginationProps {
  page: number;
  totalPages: number;
  pathname: string;
  query?: Record<string, string | undefined>;
}

export function Pagination({ page, totalPages, pathname, query = {} }: PaginationProps) {
  if (totalPages <= 1) return null;

  const href = (target: number) => buildHref(pathname, query, { page: target }) as Route;
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  return (
    <nav className={styles.pagination} aria-label="Pagination">
      {hasPrev ? (
        <PageLink href={href(page - 1)} className={`btn ${styles.step}`} rel="prev">
          <ChevronLeftIcon size={16} />
          <span className={styles.stepLabel}>Previous</span>
        </PageLink>
      ) : (
        <span className={`btn ${styles.step}`} aria-disabled="true">
          <ChevronLeftIcon size={16} />
          <span className={styles.stepLabel}>Previous</span>
        </span>
      )}

      <ol className={styles.pages}>
        {getPageItems(page, totalPages).map((item) =>
          typeof item === 'number' ? (
            <li key={item}>
              <PageLink
                href={href(item)}
                className={styles.page}
                aria-current={item === page ? 'page' : undefined}
                aria-label={`Page ${item}`}
              >
                {item}
              </PageLink>
            </li>
          ) : (
            <li key={item} className={styles.ellipsis} aria-hidden="true">
              …
            </li>
          ),
        )}
      </ol>

      <p className={styles.compact}>
        Page {page} of {totalPages}
      </p>

      {hasNext ? (
        <PageLink href={href(page + 1)} className={`btn ${styles.step}`} rel="next">
          <span className={styles.stepLabel}>Next</span>
          <ChevronRightIcon size={16} />
        </PageLink>
      ) : (
        <span className={`btn ${styles.step}`} aria-disabled="true">
          <span className={styles.stepLabel}>Next</span>
          <ChevronRightIcon size={16} />
        </span>
      )}
    </nav>
  );
}
