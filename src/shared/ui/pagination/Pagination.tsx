import type { Route } from 'next';
import type { ReactNode } from 'react';

import { buttonClassName } from '@/shared/ui/button';
import { ChevronLeftIcon, ChevronRightIcon } from '@/shared/ui/icons';

import { getPageItems } from './get-page-items';
import { PageLink } from './PageLink';
import styles from './Pagination.module.scss';

interface PaginationProps {
  page: number;
  totalPages: number;
  getHref: (page: number) => Route;
}

const stepClassName = buttonClassName({ size: 'md', compactOnMobile: true }, styles.step);

export function Pagination({ page, totalPages, getHref }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav className={styles.pagination} aria-label="Pagination">
      <Step href={page > 1 ? getHref(page - 1) : null} rel="prev">
        <ChevronLeftIcon size={16} />
        <span className={styles.stepLabel}>Previous</span>
      </Step>

      <ol className={styles.pages}>
        {getPageItems(page, totalPages).map((item) =>
          typeof item === 'number' ? (
            <li key={item}>
              <PageLink
                href={getHref(item)}
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

      <Step href={page < totalPages ? getHref(page + 1) : null} rel="next">
        <span className={styles.stepLabel}>Next</span>
        <ChevronRightIcon size={16} />
      </Step>
    </nav>
  );
}

function Step({ href, rel, children }: { href: Route | null; rel: 'prev' | 'next'; children: ReactNode }) {
  if (!href) {
    return (
      <span className={stepClassName} aria-disabled="true">
        {children}
      </span>
    );
  }

  return (
    <PageLink href={href} className={stepClassName} rel={rel}>
      {children}
    </PageLink>
  );
}
