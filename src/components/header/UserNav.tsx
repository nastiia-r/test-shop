import Link from 'next/link';

import { getSession } from '@/lib/auth/session';

import styles from './UserNav.module.scss';
import { UserMenu } from './UserMenu';

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
      <Link href="/signup" className="btn btn--primary">
        Sign up
      </Link>
    </nav>
  );
}
