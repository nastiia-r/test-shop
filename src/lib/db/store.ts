import 'server-only';

import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';

export interface KeyValueStore {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
}

function createMemoryStore(): KeyValueStore {
  const data = new Map<string, unknown>();
  return {
    async get<T>(key: string) {
      return (data.get(key) as T | undefined) ?? null;
    },
    async set<T>(key: string, value: T) {
      data.set(key, structuredClone(value));
    },
  };
}

function createFileStore(file: string): KeyValueStore {
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
    set<T>(key: string, value: T) {
      return exclusive(async () => {
        const data = await load();
        data[key] = value;
        await mkdir(path.dirname(file), { recursive: true });
        const tmp = `${file}.tmp`;
        await writeFile(tmp, JSON.stringify(data, null, 2));
        await rename(tmp, file);
      });
    },
  };
}

async function createNetlifyStore(): Promise<KeyValueStore> {
  const { getStore } = await import('@netlify/blobs');
  const store = getStore({ name: 'picky', consistency: 'strong' });
  return {
    async get<T>(key: string) {
      return ((await store.get(key, { type: 'json' })) as T | null) ?? null;
    },
    async set<T>(key: string, value: T) {
      await store.setJSON(key, value);
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
  return storePromise;
}
