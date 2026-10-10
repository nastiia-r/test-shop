'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useTransition } from 'react';

import { setSavedOverride, useSaved } from '@/hooks/use-saved-photo';
import { setPhotoSaved } from '@/server/actions/collection';
import type { Photo } from '@/shared/types/photo';
import { Button } from '@/shared/ui/button';
import { HeartIcon } from '@/shared/ui/icons';

import styles from './SaveButton.module.scss';

interface SaveButtonProps {
  photo: Photo;
  initialSaved: boolean;
  isAuthenticated: boolean;
  withLabel?: boolean;
}

export function SaveButton({ photo, initialSaved, isAuthenticated, withLabel = false }: SaveButtonProps) {
  const saved = useSaved(photo.id, initialSaved);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();

  function toggle() {
    if (!isAuthenticated) {
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    const next = !saved;
    setSavedOverride(photo.id, next);
    startTransition(async () => {
      const result = await setPhotoSaved(photo, next);
      if (!result.ok) setSavedOverride(photo.id, !next);
    });
  }

  const label = saved ? 'Remove from your collection' : 'Save to your collection';

  return (
    <Button
      variant={saved ? 'accent' : 'outline'}
      iconOnly={!withLabel}
      compactOnMobile={withLabel}
      icon={<HeartIcon size={18} filled={saved} />}
      className={styles.button}
      onClick={toggle}
      aria-pressed={saved}
      aria-label={withLabel ? undefined : label}
      aria-busy={isPending}
      title={label}
    >
      {withLabel ? (saved ? 'Saved' : 'Save') : undefined}
    </Button>
  );
}
