import 'server-only';

import { cache } from 'react';

import { getSession, type Session } from '@/lib/auth/session';
import { getSavedIds } from '@/lib/db/saved';

export interface Viewer {
  session: Session | null;
  savedIds: ReadonlySet<string>;
}

export const getViewer = cache(async (): Promise<Viewer> => {
  const session = await getSession();
  const savedIds = session ? await getSavedIds(session.userId) : new Set<string>();
  return { session, savedIds };
});
