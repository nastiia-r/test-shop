import 'server-only';

import { getStore } from './store';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

const userKey = (email: string) => `users/${email.toLowerCase()}`;

export async function findUserByEmail(email: string): Promise<User | null> {
  const store = await getStore();
  return store.get<User>(userKey(email));
}

export async function createUser(input: Pick<User, 'name' | 'email' | 'passwordHash'>): Promise<User> {
  const store = await getStore();
  const user: User = {
    id: crypto.randomUUID(),
    name: input.name,
    email: input.email.toLowerCase(),
    passwordHash: input.passwordHash,
    createdAt: new Date().toISOString(),
  };
  await store.set(userKey(user.email), user);
  return user;
}
