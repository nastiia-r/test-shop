'use client';

import { useRouter } from 'next/navigation';
import { type ReactNode, useEffect, useRef } from 'react';

import { CloseIcon } from '@/components/icons';

import styles from './Modal.module.scss';

export function Modal({ children, label }: { children: ReactNode; label: string }) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();
    document.documentElement.classList.add('modal-open');
    return () => {
      dialog.close();
      document.documentElement.classList.remove('modal-open');
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-label={label}
      onCancel={(event) => {
        event.preventDefault();
        router.back();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) router.back();
      }}
    >
      <button type="button" className={styles.close} onClick={() => router.back()} aria-label="Close">
        <CloseIcon size={24} />
      </button>
      <div className={styles.panel}>{children}</div>
    </dialog>
  );
}
