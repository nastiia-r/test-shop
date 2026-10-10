'use server';

import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';

import { createSession, deleteSession } from '@/server/auth/session';
import { createUser, findUserByEmail } from '@/server/db/users';
import {
  type AuthFormState,
  loginSchema,
  safeRedirect,
  signupSchema,
  toFieldErrors,
} from '@/shared/lib/auth-validation';

const EMAIL_TAKEN = 'An account with this email already exists';

let dummyHash: Promise<string> | undefined;
const getDummyHash = () => (dummyHash ??= bcrypt.hash('picky-timing-equaliser', 10));

export async function signup(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const values = { name: String(formData.get('name') ?? ''), email: String(formData.get('email') ?? '') };
  const parsed = signupSchema.safeParse({ ...values, password: formData.get('password') });
  if (!parsed.success) return { fieldErrors: toFieldErrors(parsed.error), values };

  const { name, email, password } = parsed.data;
  if (await findUserByEmail(email)) {
    return { fieldErrors: { email: EMAIL_TAKEN }, values };
  }

  const user = await createUser({ name, email, passwordHash: await bcrypt.hash(password, 10) });
  if (!user) return { fieldErrors: { email: EMAIL_TAKEN }, values };

  await createSession({ userId: user.id, name: user.name, email: user.email });
  redirect(safeRedirect(formData.get('next')));
}

export async function login(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const values = { email: String(formData.get('email') ?? '') };
  const parsed = loginSchema.safeParse({ ...values, password: formData.get('password') });
  if (!parsed.success) return { fieldErrors: toFieldErrors(parsed.error), values };

  const user = await findUserByEmail(parsed.data.email);
  const valid = await bcrypt.compare(parsed.data.password, user?.passwordHash ?? (await getDummyHash()));
  if (!user || !valid) return { error: 'Incorrect email or password', values };

  await createSession({ userId: user.id, name: user.name, email: user.email });
  redirect(safeRedirect(formData.get('next')));
}

export async function logout(): Promise<void> {
  await deleteSession();
  redirect('/');
}
