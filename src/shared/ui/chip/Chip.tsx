import Link from 'next/link';
import type { ComponentProps } from 'react';

import { cn } from '@/shared/lib/cn';

import styles from './Chip.module.scss';

export type ChipVariant = 'outline' | 'soft';

type ChipProps = ComponentProps<typeof Link> & {
  variant?: ChipVariant;
  active?: boolean;
};

export function Chip({ variant = 'outline', active = false, className, ...props }: ChipProps) {
  return (
    <Link
      className={cn(styles.chip, styles[variant], className)}
      aria-current={active ? 'true' : undefined}
      {...props}
    />
  );
}
