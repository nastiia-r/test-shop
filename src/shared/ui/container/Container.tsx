import type { HTMLAttributes } from 'react';

import { cn } from '@/shared/lib/cn';

import styles from './Container.module.scss';

export function Container({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn(styles.container, className)} {...props} />;
}
