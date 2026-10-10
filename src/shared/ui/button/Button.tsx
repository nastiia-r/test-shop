import Link from 'next/link';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ComponentProps, ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';

import styles from './Button.module.scss';

export type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'accent';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonStyleProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconOnly?: boolean;
  fullWidth?: boolean;
  compactOnMobile?: boolean;
}

interface ButtonContentProps {
  icon?: ReactNode;
  iconEnd?: ReactNode;
  children?: ReactNode;
}

export function buttonClassName(
  { variant = 'outline', size = 'sm', iconOnly = false, fullWidth = false, compactOnMobile = false }: ButtonStyleProps,
  className?: string,
): string {
  return cn(
    styles.button,
    styles[variant],
    styles[size],
    iconOnly && styles.iconOnly,
    fullWidth && styles.fullWidth,
    compactOnMobile && styles.compactOnMobile,
    className,
  );
}

function ButtonContent({ icon, iconEnd, children }: ButtonContentProps) {
  return (
    <>
      {icon}
      {children !== undefined && <span className={styles.label}>{children}</span>}
      {iconEnd}
    </>
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & ButtonStyleProps & ButtonContentProps;

export function Button({
  variant,
  size,
  iconOnly,
  fullWidth,
  compactOnMobile,
  icon,
  iconEnd,
  children,
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClassName({ variant, size, iconOnly, fullWidth, compactOnMobile }, className)}
      {...props}
    >
      <ButtonContent icon={icon} iconEnd={iconEnd}>
        {children}
      </ButtonContent>
    </button>
  );
}

type LinkButtonProps = ComponentProps<typeof Link> & ButtonStyleProps & ButtonContentProps;

export function LinkButton({
  variant,
  size,
  iconOnly,
  fullWidth,
  compactOnMobile,
  icon,
  iconEnd,
  children,
  className,
  ...props
}: LinkButtonProps) {
  return (
    <Link className={buttonClassName({ variant, size, iconOnly, fullWidth, compactOnMobile }, className)} {...props}>
      <ButtonContent icon={icon} iconEnd={iconEnd}>
        {children}
      </ButtonContent>
    </Link>
  );
}

type AnchorButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & ButtonStyleProps & ButtonContentProps;

export function AnchorButton({
  variant,
  size,
  iconOnly,
  fullWidth,
  compactOnMobile,
  icon,
  iconEnd,
  children,
  className,
  ...props
}: AnchorButtonProps) {
  return (
    <a className={buttonClassName({ variant, size, iconOnly, fullWidth, compactOnMobile }, className)} {...props}>
      <ButtonContent icon={icon} iconEnd={iconEnd}>
        {children}
      </ButtonContent>
    </a>
  );
}
