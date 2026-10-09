import type { Route } from 'next';
import { z } from 'zod';

const email = z.string().trim().toLowerCase().pipe(z.email('Enter a valid email address'));

export const signupSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(50, 'Name is too long'),
  email,
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .refine((value) => new TextEncoder().encode(value).length <= 72, 'Password is too long')
    .regex(/[a-zA-Z]/, 'Password must contain a letter')
    .regex(/[0-9]/, 'Password must contain a number'),
});

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Enter your password'),
});

export type FieldErrors = Partial<Record<'name' | 'email' | 'password', string>>;

export interface AuthFormState {
  error?: string;
  fieldErrors?: FieldErrors;
  values?: { name?: string; email?: string };
}

export function toFieldErrors(error: z.ZodError): FieldErrors {
  const result: FieldErrors = {};
  for (const issue of error.issues) {
    const field = issue.path[0] as keyof FieldErrors;
    result[field] ??= issue.message;
  }
  return result;
}

const REDIRECT_BASE = 'http://localhost';

const isUnsafeChar = (char: string) => char === '\\' || char.charCodeAt(0) < 0x20 || char.charCodeAt(0) === 0x7f;

export function safeRedirect(target: FormDataEntryValue | string | null | undefined, fallback = '/'): Route {
  if (typeof target !== 'string' || !target.startsWith('/')) return fallback as Route;
  if ([...target].some(isUnsafeChar)) return fallback as Route;

  const url = new URL(target, REDIRECT_BASE);
  if (url.origin !== REDIRECT_BASE) return fallback as Route;
  return `${url.pathname}${url.search}${url.hash}` as Route;
}
