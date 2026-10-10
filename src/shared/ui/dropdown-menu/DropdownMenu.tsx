'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  type ButtonHTMLAttributes,
  type ComponentProps,
  type ReactNode,
  type ToggleEvent,
  useEffect,
  useId,
  useRef,
} from 'react';

import { cn } from '@/shared/lib/cn';

import styles from './DropdownMenu.module.scss';

const MENU_OFFSET = 10;

interface DropdownMenuProps {
  label: string;
  trigger: ReactNode;
  children: ReactNode;
}

export function DropdownMenu({ label, trigger, children }: DropdownMenuProps) {
  const menuId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const menu = menuRef.current;
    if (menu?.matches(':popover-open')) menu.hidePopover();
  }, [pathname]);

  function placeUnderTrigger(event: ToggleEvent<HTMLDivElement>) {
    const anchor = triggerRef.current?.getBoundingClientRect();
    if (event.newState !== 'open' || !anchor) return;

    event.currentTarget.style.top = `${anchor.bottom + MENU_OFFSET}px`;
    event.currentTarget.style.left = `${anchor.right}px`;
  }

  return (
    <div className={styles.root}>
      <button ref={triggerRef} type="button" className={styles.trigger} aria-label={label} popoverTarget={menuId}>
        {trigger}
      </button>
      <div ref={menuRef} id={menuId} popover="auto" className={styles.menu} onBeforeToggle={placeUnderTrigger}>
        {children}
      </div>
    </div>
  );
}

export function MenuHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className={styles.header}>
      <strong>{title}</strong>
      {subtitle && <span>{subtitle}</span>}
    </div>
  );
}

export function MenuLink({ className, ...props }: ComponentProps<typeof Link>) {
  return <Link className={cn(styles.item, className)} {...props} />;
}

export function MenuButton({ className, type = 'button', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type={type} className={cn(styles.item, className)} {...props} />;
}
