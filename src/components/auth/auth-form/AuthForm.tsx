'use client';

import type { Route } from 'next';
import Link from 'next/link';
import { useActionState } from 'react';

import { login, signup } from '@/server/actions/auth';
import { APP_NAME } from '@/shared/config';
import type { AuthFormState } from '@/shared/lib/auth-validation';
import { Button } from '@/shared/ui/button';
import { TextField } from '@/shared/ui/text-field';

import styles from './AuthForm.module.scss';

export type AuthMode = 'login' | 'signup';

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
    title: `Join ${APP_NAME}`,
    subtitle: 'Create an account to save photos into your own collection.',
    submit: 'Join',
    switchText: 'Already have an account?',
    switchLink: 'Login',
    switchHref: '/login',
  },
} as const;

interface AuthFormProps {
  mode: AuthMode;
  next?: string;
}

export function AuthForm({ mode, next }: AuthFormProps) {
  const [state, action, pending] = useActionState<AuthFormState, FormData>(mode === 'login' ? login : signup, {});
  const copy = COPY[mode];
  const errors = state.fieldErrors ?? {};
  const switchHref = (next ? `${copy.switchHref}?next=${encodeURIComponent(next)}` : copy.switchHref) as Route;

  return (
    <section className={styles.card}>
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
          <TextField
            key={`name-${state.values?.name}`}
            label="Name"
            name="name"
            autoComplete="name"
            defaultValue={state.values?.name}
            error={errors.name}
            required
          />
        )}
        <TextField
          key={`email-${state.values?.email}`}
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={state.values?.email}
          error={errors.email}
          required
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          error={errors.password}
          hint={mode === 'signup' ? 'At least 8 characters, with a letter and a number.' : undefined}
          required
        />

        <Button type="submit" variant="primary" size="lg" fullWidth disabled={pending} className={styles.submit}>
          {pending ? 'Please wait…' : copy.submit}
        </Button>
      </form>

      <p className={styles.switch}>
        {copy.switchText}{' '}
        <Link href={switchHref} className={styles.switchLink}>
          {copy.switchLink}
        </Link>
      </p>
    </section>
  );
}
