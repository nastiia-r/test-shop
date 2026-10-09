'use client';

import Link from 'next/link';
import { useActionState } from 'react';

import { login, signup } from '@/lib/auth/actions';
import type { AuthFormState } from '@/lib/auth/validation';

import styles from './AuthForm.module.scss';

interface AuthFormProps {
  mode: 'login' | 'signup';
  next?: string;
}

const COPY = {
  login: {
    title: 'Login',
    subtitle: 'Welcome back.',
    submit: 'Login',
    switchText: 'Don’t have an account?',
    switchLink: 'Join',
    switchHref: '/signup',
  },
  signup: {
    title: 'Join Picky',
    subtitle: 'Create an account to save photos into your own collection.',
    submit: 'Join',
    switchText: 'Already have an account?',
    switchLink: 'Login',
    switchHref: '/login',
  },
} as const;

export function AuthForm({ mode, next }: AuthFormProps) {
  const [state, action, pending] = useActionState<AuthFormState, FormData>(mode === 'login' ? login : signup, {});
  const copy = COPY[mode];
  const errors = state.fieldErrors ?? {};
  const switchHref = next ? `${copy.switchHref}?next=${encodeURIComponent(next)}` : copy.switchHref;

  return (
    <div className={styles.card}>
      <h1 className={styles.title}>{copy.title}</h1>
      <p className={styles.subtitle}>{copy.subtitle}</p>

      <form action={action} className={styles.form} noValidate>
        {next && <input type="hidden" name="next" value={next} />}

        {state.error && (
          <p className={styles.formError} role="alert">
            {state.error}
          </p>
        )}

        {mode === 'signup' && (
          <Field label="Name" name="name" autoComplete="name" defaultValue={state.values?.name} error={errors.name} />
        )}
        <Field
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={state.values?.email}
          error={errors.email}
        />
        <Field
          label="Password"
          name="password"
          type="password"
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          error={errors.password}
          hint={mode === 'signup' ? 'At least 8 characters, with a letter and a number.' : undefined}
        />

        <button type="submit" className={`btn btn--primary btn--lg ${styles.submit}`} disabled={pending}>
          {pending ? 'Please wait…' : copy.submit}
        </button>
      </form>

      <p className={styles.switch}>
        {copy.switchText}{' '}
        <Link href={switchHref as '/login' | '/signup'} className={styles.switchLink}>
          {copy.switchLink}
        </Link>
      </p>
    </div>
  );
}

interface FieldProps {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  defaultValue?: string;
  error?: string;
  hint?: string;
}

function Field({ label, name, type = 'text', autoComplete, defaultValue, error, hint }: FieldProps) {
  const describedBy = error ? `${name}-error` : hint ? `${name}-hint` : undefined;
  return (
    <div className={styles.field}>
      <label htmlFor={name}>{label}</label>
      <input
        key={defaultValue}
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        required
      />
      {error ? (
        <p id={`${name}-error`} className={styles.error}>
          {error}
        </p>
      ) : hint ? (
        <p id={`${name}-hint`} className={styles.hint}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}
