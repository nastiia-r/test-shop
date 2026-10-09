import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

import { AuthForm } from '@/components/auth/AuthForm';
import { getSession } from '@/lib/auth/session';
import { safeRedirect } from '@/lib/auth/validation';

export const metadata: Metadata = { title: 'Sign up' };

type Props = PageProps<'/signup'>;

async function SignupContent({ searchParams }: Props) {
  const next = safeRedirect((await searchParams).next as string | undefined, '');
  if (await getSession()) redirect(next || '/profile');
  return <AuthForm mode="signup" next={next || undefined} />;
}

export default function SignupPage(props: Props) {
  return (
    <Suspense fallback={<AuthForm mode="signup" />}>
      <SignupContent {...props} />
    </Suspense>
  );
}
