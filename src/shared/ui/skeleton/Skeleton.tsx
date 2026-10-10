import type { CSSProperties } from 'react';

import { cn } from '@/shared/lib/cn';

import styles from './Skeleton.module.scss';

export type SkeletonShape = 'rect' | 'rounded' | 'circle';

interface SkeletonProps {
  shape?: SkeletonShape;
  width?: CSSProperties['width'];
  height?: CSSProperties['height'];
  aspectRatio?: CSSProperties['aspectRatio'];
  className?: string;
}

export function Skeleton({ shape = 'rounded', width, height, aspectRatio, className }: SkeletonProps) {
  return <div className={cn(styles.skeleton, styles[shape], className)} style={{ width, height, aspectRatio }} />;
}
