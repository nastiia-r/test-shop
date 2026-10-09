import { describe, expect, it } from 'vitest';

import { loginSchema, safeRedirect, signupSchema, toFieldErrors } from '../auth/validation';

describe('signupSchema', () => {
  it('accepts valid input and normalises email', () => {
    const result = signupSchema.safeParse({ name: ' Anna ', email: 'Anna@Mail.com ', password: 'secret123' });
    expect(result.success).toBe(true);
    expect(result.data).toEqual({ name: 'Anna', email: 'anna@mail.com', password: 'secret123' });
  });

  it('reports one message per invalid field', () => {
    const result = signupSchema.safeParse({ name: 'A', email: 'nope', password: 'short' });
    expect(result.success).toBe(false);
    const errors = toFieldErrors(result.error!);
    expect(Object.keys(errors).sort()).toEqual(['email', 'name', 'password']);
  });

  it('requires a letter and a number in the password', () => {
    expect(signupSchema.safeParse({ name: 'Anna', email: 'a@b.co', password: '12345678' }).success).toBe(false);
    expect(signupSchema.safeParse({ name: 'Anna', email: 'a@b.co', password: 'abcdefgh' }).success).toBe(false);
  });
});

describe('loginSchema', () => {
  it('requires a password', () => {
    expect(loginSchema.safeParse({ email: 'a@b.co', password: '' }).success).toBe(false);
  });
});

describe('safeRedirect', () => {
  it.each([
    ['/profile', '/profile'],
    ['/photos/abc?x=1', '/photos/abc?x=1'],
    ['//evil.com', '/'],
    ['/\\evil.com', '/'],
    ['https://evil.com', '/'],
    ['/\t/evil.com', '/'],
    ['/\n/evil.com', '/'],
    ['/foo\\bar', '/'],
    ['/%2F%2Fevil.com', '/%2F%2Fevil.com'],
    [null, '/'],
  ])('%j → %j', (input, expected) => {
    expect(safeRedirect(input)).toBe(expected);
  });
});
