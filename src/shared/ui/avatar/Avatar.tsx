import Image from 'next/image';

import { cn } from '@/shared/lib/cn';

import styles from './Avatar.module.scss';

export type AvatarSize = 'sm' | 'md';

const PIXELS: Record<AvatarSize, number> = { sm: 32, md: 40 };

interface AvatarProps {
  name: string;
  src?: string;
  size?: AvatarSize;
  className?: string;
}

export function Avatar({ name, src, size = 'sm', className }: AvatarProps) {
  const classes = cn(styles.avatar, styles[size], className);

  if (src) {
    return <Image src={src} alt="" width={PIXELS[size]} height={PIXELS[size]} className={classes} />;
  }

  return (
    <span className={cn(classes, styles.initials)} aria-hidden="true">
      {name.charAt(0).toUpperCase()}
    </span>
  );
}
