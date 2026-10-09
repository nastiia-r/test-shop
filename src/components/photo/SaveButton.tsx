'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useTransition } from 'react';

import { HeartIcon } from '@/components/icons';
import { setPhotoSaved } from '@/lib/saved-actions';
import type { Photo } from '@/lib/unsplash/types';

import styles from './SaveButton.module.scss';
import { setSavedOverride, useSaved } from './saved-store';

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
    <button
      type="button"
      onClick={toggle}
      className={`btn ${withLabel ? '' : 'btn--icon'} ${styles.button}`}
      data-saved={saved}
      aria-pressed={saved}
      aria-label={withLabel ? undefined : label}
      title={label}
      aria-busy={isPending}
    >
      <HeartIcon size={18} filled={saved} />
      {withLabel && <span>{saved ? 'Saved' : 'Save'}</span>}
    </button>
  );
}
