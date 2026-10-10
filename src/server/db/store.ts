import 'server-only';

import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';

export type Updater<T> = (current: T | null) => T | null;

export interface KeyValueStore {
  get<T>(key: string): Promise<T | null>;
  update<T>(key: string, updater: Updater<T>): Promise<T | null>;
}

export function createMemoryStore(): KeyValueStore {
  const data = new Map<string, unknown>();
  return {
    async get<T>(key: string) {
      return structuredClone((data.get(key) as T | undefined) ?? null);
    },
    async update<T>(key: string, updater: Updater<T>) {
      const next = updater(structuredClone((data.get(key) as T | undefined) ?? null));
      if (next !== null) data.set(key, structuredClone(next));
      return next;
    },
  };
}

export function createFileStore(file: string): KeyValueStore {
  let queue: Promise<unknown> = Promise.resolve();

  async function load(): Promise<Record<string, unknown>> {
    try {
      return JSON.parse(await readFile(file, 'utf8')) as Record<string, unknown>;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return {};
      throw error;
    }
  }

  function exclusive<T>(task: () => Promise<T>): Promise<T> {
    const run = queue.then(task, task);
    queue = run.catch(() => undefined);
    return run;
  }

  return {
    async get<T>(key: string) {
      const data = await load();
      return (data[key] as T | undefined) ?? null;
    },
    update<T>(key: string, updater: Updater<T>) {
      return exclusive(async () => {
        const data = await load();
        const next = updater((data[key] as T | undefined) ?? null);
        if (next === null) return null;
        data[key] = next;
        await mkdir(path.dirname(file), { recursive: true });
        const tmp = `${file}.tmp`;
        await writeFile(tmp, JSON.stringify(data, null, 2));
        await rename(tmp, file);
        return next;
      });
    },
  };
}

const MAX_WRITE_ATTEMPTS = 5;

async function createNetlifyStore(): Promise<KeyValueStore> {
  const { getStore } = await import('@netlify/blobs');
  const store = getStore({ name: 'picky', consistency: 'strong' });
  return {
    async get<T>(key: string) {
      return ((await store.get(key, { type: 'json' })) as T | null) ?? null;
    },
    async update<T>(key: string, updater: Updater<T>) {
      for (let attempt = 0; attempt < MAX_WRITE_ATTEMPTS; attempt++) {
        const entry = await store.getWithMetadata(key, { type: 'json' });
        const next = updater((entry?.data as T | undefined) ?? null);
        if (next === null) return null;

        const { modified } = entry
          ? await store.setJSON(key, next, entry.etag ? { onlyIfMatch: entry.etag } : {})
          : await store.setJSON(key, next, { onlyIfNew: true });
        if (modified) return next;
      }
      throw new Error(`[store] Too many concurrent writes to "${key}"`);
    },
  };
}

type Driver = 'netlify' | 'file' | 'memory';

function resolveDriver(): Driver {
  const explicit = process.env.STORAGE_DRIVER;
  if (explicit === 'netlify' || explicit === 'file' || explicit === 'memory') return explicit;
  if (process.env.NETLIFY || process.env.NETLIFY_BLOBS_CONTEXT) return 'netlify';
  if (process.env.VERCEL) return 'memory';
  return 'file';
}

let storePromise: Promise<KeyValueStore> | undefined;

export function getStore(): Promise<KeyValueStore> {
  storePromise ??= (async () => {
    const driver = resolveDriver();
    if (driver === 'netlify') return createNetlifyStore();
    if (driver === 'memory') {
      console.warn('[store] Using in-memory storage: accounts reset when the server restarts.');
      return createMemoryStore();
    }
    return createFileStore(path.join(process.cwd(), '.data', 'store.json'));
  })();
  storePromise.catch(() => {
    storePromise = undefined;
  });
  return storePromise;
}
