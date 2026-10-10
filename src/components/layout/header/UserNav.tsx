import Link from 'next/link';

import { UserMenu } from '@/components/auth/user-menu';
import { getSession } from '@/server/auth/session';
import { LinkButton } from '@/shared/ui/button';

import styles from './UserNav.module.scss';

export async function UserNav() {
  const session = await getSession();

  if (session) {
    return <UserMenu name={session.name} email={session.email} />;
  }

  return (
    <nav className={styles.nav} aria-label="Account">
      <Link href="/login" className={styles.login}>
        Log in
      </Link>
      <LinkButton href="/signup" variant="primary">
        Sign up
      </LinkButton>
    </nav>
  );
}
