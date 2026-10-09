'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';

import { clearSavedOverrides } from '@/components/photo/saved-store';
import { logout } from '@/lib/auth/actions';

import styles from './UserNav.module.scss';

export function UserMenu({ name, email }: { name: string; email: string }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const pathname = usePathname();

  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div className={styles.menuWrapper} ref={containerRef}>
      <button
        type="button"
        className={styles.avatar}
        aria-label="Account menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
      >
        {name.charAt(0).toUpperCase()}
      </button>

      <div id={menuId} className={styles.menu} hidden={!open}>
        <div className={styles.menuHeader}>
          <strong>{name}</strong>
          <span>{email}</span>
        </div>
        <Link href="/profile" className={styles.menuItem}>
          Your collection
        </Link>
        <form action={logout} onSubmit={clearSavedOverrides}>
          <button type="submit" className={styles.menuItem}>
            Log out
          </button>
        </form>
      </div>
    </div>
  );
}
