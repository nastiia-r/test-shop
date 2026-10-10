import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';

import { createFileStore, createMemoryStore, type KeyValueStore } from './store';

let dir: string;

afterAll(async () => {
  if (dir) await rm(dir, { recursive: true, force: true });
});

const drivers: [string, () => Promise<KeyValueStore>][] = [
  ['memory', async () => createMemoryStore()],
  [
    'file',
    async () => {
      dir ??= await mkdtemp(path.join(tmpdir(), 'picky-store-'));
      return createFileStore(path.join(dir, `${crypto.randomUUID()}.json`));
    },
  ],
];

describe.each(drivers)('%s store', (_name, create) => {
  it('returns null for missing keys', async () => {
    const store = await create();
    expect(await store.get('missing')).toBeNull();
  });

  it('writes the value returned by the updater', async () => {
    const store = await create();
    expect(await store.update<number>('n', (current) => (current ?? 0) + 1)).toBe(1);
    expect(await store.get('n')).toBe(1);
  });

  it('leaves the entry untouched when the updater returns null', async () => {
    const store = await create();
    await store.update('user', () => ({ name: 'first' }));
    expect(await store.update('user', (current) => (current ? null : { name: 'second' }))).toBeNull();
    expect(await store.get('user')).toEqual({ name: 'first' });
  });

  it('does not lose concurrent updates', async () => {
    const store = await create();
    await Promise.all(
      Array.from({ length: 20 }, (_, i) => store.update<number[]>('list', (current) => [...(current ?? []), i])),
    );
    expect((await store.get<number[]>('list'))?.toSorted((a, b) => a - b)).toEqual(
      Array.from({ length: 20 }, (_, i) => i),
    );
  });
});
