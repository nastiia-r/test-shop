import type { Orientation, SearchOrder } from './unsplash/types';

type RawParam = string | string[] | undefined;

function first(value: RawParam): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export function parsePage(value: RawParam): number {
  const page = Number(first(value));
  return Number.isInteger(page) && page > 0 ? page : 1;
}

const ORIENTATIONS: readonly Orientation[] = ['landscape', 'portrait', 'squarish'];

export function parseOrientation(value: RawParam): Orientation | undefined {
  const raw = first(value);
  return ORIENTATIONS.find((o) => o === raw);
}

export function parseOrder(value: RawParam): SearchOrder {
  return first(value) === 'latest' ? 'latest' : 'relevant';
}

export function normalizeQuery(value: string): string | null {
  const query = value.trim().replace(/\s+/g, ' ').slice(0, 100);
  return query.length > 0 ? query : null;
}

export function queryToSlug(query: string): string {
  return encodeURIComponent(query.toLowerCase().replace(/ /g, '-'));
}

export function slugToQuery(slug: string): string {
  return decodeURIComponent(slug).replace(/-/g, ' ');
}

export function buildHref(
  pathname: string,
  current: Record<string, string | undefined>,
  patch: Record<string, string | number | undefined>,
): string {
  const params = new URLSearchParams();
  const merged: Record<string, string | number | undefined> = { ...current, ...patch };
  for (const [key, value] of Object.entries(merged)) {
    if (value === undefined || value === '') continue;
    if (key === 'page' && Number(value) === 1) continue;
    params.set(key, String(value));
  }
  const qs = params.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}
