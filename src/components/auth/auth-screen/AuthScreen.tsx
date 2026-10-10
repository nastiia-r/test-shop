import { redirect } from 'next/navigation';
import { Suspense } from 'react';

import { AuthForm, type AuthMode } from '@/components/auth/auth-form';
import { getSession } from '@/server/auth/session';
import { safeRedirect } from '@/shared/lib/auth-validation';
import { firstParam, type SearchParamValue } from '@/shared/lib/search-params';

interface AuthScreenProps {
  mode: AuthMode;
  searchParams: Promise<Record<string, SearchParamValue>>;
}

export function AuthScreen({ mode, searchParams }: AuthScreenProps) {
  return (
    <Suspense fallback={<AuthForm mode={mode} />}>
      <AuthScreenContent mode={mode} searchParams={searchParams} />
    </Suspense>
  );
}

async function AuthScreenContent({ mode, searchParams }: AuthScreenProps) {
  const next = safeRedirect(firstParam((await searchParams).next), '');
  if (await getSession()) redirect(next || '/profile');
  return <AuthForm mode={mode} next={next || undefined} />;
}
