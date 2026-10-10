import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';

import styles from './SegmentedControl.module.scss';

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  icon?: ReactNode;
}

interface SegmentedControlProps<T extends string> {
  label: string;
  options: readonly SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  hideLabelsOnMobile?: boolean;
  className?: string;
}

export function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
  hideLabelsOnMobile = false,
  className,
}: SegmentedControlProps<T>) {
  return (
    <div className={cn(styles.control, className)} role="group" aria-label={label}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={styles.option}
          data-value={option.value}
          aria-pressed={option.value === value}
          title={option.label}
          onClick={() => onChange(option.value)}
        >
          {option.icon}
          <span className={cn(hideLabelsOnMobile && styles.collapsibleLabel)}>{option.label}</span>
        </button>
      ))}
    </div>
  );
}
