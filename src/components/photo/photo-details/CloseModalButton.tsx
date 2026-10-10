'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/shared/ui/button';
import { CloseIcon } from '@/shared/ui/icons';

import styles from './CloseModalButton.module.scss';

export function CloseModalButton() {
  const router = useRouter();

  return (
    <Button
      iconOnly
      icon={<CloseIcon size={18} />}
      className={styles.close}
      onClick={() => router.back()}
      aria-label="Close"
      title="Close"
    />
  );
}
