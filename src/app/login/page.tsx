import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

import { AuthForm } from '@/components/auth/AuthForm';
import { getSession } from '@/lib/auth/session';
import { safeRedirect } from '@/lib/auth/validation';

export const metadata: Metadata = { title: 'Log in' };

type Props = PageProps<'/login'>;

async function LoginContent({ searchParams }: Props) {
  const next = safeRedirect((await searchParams).next as string | undefined, '');
  if (await getSession()) redirect(next || '/profile');
  return <AuthForm mode="login" next={next || undefined} />;
}

export default function LoginPage(props: Props) {
  return (
    <Suspense fallback={<AuthForm mode="login" />}>
      <LoginContent {...props} />
    </Suspense>
  );
}
