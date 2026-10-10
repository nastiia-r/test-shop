import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';

import styles from './EmptyState.module.scss';

export type EmptyStateVariant = 'page' | 'section' | 'card';

interface EmptyStateProps {
  title: string;
  description?: ReactNode;
  code?: string;
  actions?: ReactNode;
  variant?: EmptyStateVariant;
  role?: 'alert' | 'status';
}

export function EmptyState({ title, description, code, actions, variant = 'section', role }: EmptyStateProps) {
  const Heading = variant === 'page' ? 'h1' : 'h2';

  return (
    <div className={cn(styles.state, styles[variant])} role={role}>
      {code && <p className={styles.code}>{code}</p>}
      <Heading className={styles.title}>{title}</Heading>
      {description && <p className={styles.description}>{description}</p>}
      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  );
}
