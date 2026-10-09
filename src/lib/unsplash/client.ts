import 'server-only';

import { cacheLife } from 'next/cache';

import { toPhoto, toPhotoDetails } from './mappers';
import type {
  ApiPhoto,
  ApiPhotoDetails,
  ApiSearchResponse,
  Orientation,
  PhotoDetails,
  PhotoPage,
  SearchOrder,
} from './types';

const API_URL = process.env.UNSPLASH_API_URL ?? 'https://api.unsplash.com';
export const PER_PAGE = 30;
const MAX_PAGES = 500;

export type UnsplashErrorKind = 'missing-key' | 'unauthorized' | 'rate-limit' | 'not-found' | 'unknown';

export class UnsplashError extends Error {
  constructor(
    readonly kind: UnsplashErrorKind,
    message: string,
  ) {
    super(`[unsplash:${kind}] ${message}`);
    this.name = 'UnsplashError';
  }
}

const KIND_PATTERN = /^\[unsplash:([a-z-]+)\]/;

export function getUnsplashErrorKind(error: unknown): UnsplashErrorKind | null {
  if (error instanceof UnsplashError) return error.kind;
  if (error instanceof Error) {
    const match = KIND_PATTERN.exec(error.message);
    if (match) return match[1] as UnsplashErrorKind;
  }
  return null;
}

function errorKindFor(status: number): UnsplashErrorKind {
  if (status === 401) return 'unauthorized';
  if (status === 403 || status === 429) return 'rate-limit';
  if (status === 404) return 'not-found';
  return 'unknown';
}

async function request<T>(
  path: string,
  params: Record<string, string | number | undefined> = {},
  { cached = true }: { cached?: boolean } = {},
): Promise<{ data: T; headers: Headers }> {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) throw new UnsplashError('missing-key', 'UNSPLASH_ACCESS_KEY is not set');

  const url = new URL(path, API_URL);
  for (const [name, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') url.searchParams.set(name, String(value));
  }

  const res = await fetch(url, {
    headers: { Authorization: `Client-ID ${key}`, 'Accept-Version': 'v1' },
    ...(cached ? { next: { revalidate: 3600 } } : { cache: 'no-store' as const }),
  });

  if (!res.ok) {
    throw new UnsplashError(errorKindFor(res.status), `Unsplash responded ${res.status} for ${url.pathname}`);
  }

  return { data: (await res.json()) as T, headers: res.headers };
}

const emptyPage = (page: number): PhotoPage => ({ photos: [], page, total: 0, totalPages: 0 });

export async function getEditorialPhotos(page: number): Promise<PhotoPage> {
  if (page > MAX_PAGES) return emptyPage(page);
  return fetchEditorialPhotos(page);
}

async function fetchEditorialPhotos(page: number): Promise<PhotoPage> {
  'use cache';
  cacheLife('hours');

  const { data, headers } = await request<ApiPhoto[]>('/photos', { page, per_page: PER_PAGE });
  const total = Number(headers.get('x-total')) || data.length;

  return {
    photos: data.map(toPhoto),
    page,
    total,
    totalPages: Math.min(Math.ceil(total / PER_PAGE), MAX_PAGES),
  };
}

export interface SearchOptions {
  query: string;
  page: number;
  orientation?: Orientation;
  orderBy?: SearchOrder;
  perPage?: number;
}

export async function searchPhotos(options: SearchOptions): Promise<PhotoPage> {
  if (options.page > MAX_PAGES) return emptyPage(options.page);
  return fetchSearchPhotos(options);
}

async function fetchSearchPhotos({
  query,
  page,
  orientation,
  orderBy,
  perPage = PER_PAGE,
}: SearchOptions): Promise<PhotoPage> {
  'use cache';
  cacheLife('hours');

  const { data } = await request<ApiSearchResponse>('/search/photos', {
    query,
    page,
    per_page: perPage,
    orientation,
    order_by: orderBy === 'latest' ? 'latest' : undefined,
  });

  return {
    photos: data.results.map(toPhoto),
    page,
    total: data.total,
    totalPages: Math.min(data.total_pages, MAX_PAGES),
  };
}

export async function getPhoto(id: string): Promise<PhotoDetails> {
  'use cache';
  cacheLife('hours');

  const { data } = await request<ApiPhotoDetails>(`/photos/${encodeURIComponent(id)}`);
  return toPhotoDetails(data);
}

export async function trackDownload(id: string): Promise<string> {
  const { data: photo } = await request<ApiPhoto>(`/photos/${encodeURIComponent(id)}`);
  const location = new URL(photo.links.download_location);
  const { data } = await request<{ url: string }>(location.pathname, Object.fromEntries(location.searchParams), {
    cached: false,
  });
  return data.url;
}
