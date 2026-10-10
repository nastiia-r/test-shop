'use client';

import { type ReactNode, useEffect, useRef } from 'react';

import { cn } from '@/shared/lib/cn';
import { CloseIcon } from '@/shared/ui/icons';

import styles from './Dialog.module.scss';

export type DialogCloseButton = 'always' | 'tablet-up';

interface DialogProps {
  label: string;
  onClose: () => void;
  closeButton?: DialogCloseButton;
  children: ReactNode;
}

export function Dialog({ label, onClose, closeButton = 'always', children }: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();
    return () => dialog.close();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-label={label}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className={styles.panel}>
        <div className={cn(styles.toolbar, closeButton === 'tablet-up' && styles.tabletUp)}>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
            <CloseIcon size={24} />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
