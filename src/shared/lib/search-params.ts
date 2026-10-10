export type SearchParamValue = string | string[] | undefined;

export function firstParam(value: SearchParamValue): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export function parsePage(value: SearchParamValue): number {
  const page = Number(firstParam(value));
  return Number.isInteger(page) && page > 0 ? page : 1;
}

const MAX_QUERY_LENGTH = 100;

export function normalizeQuery(value: string): string | null {
  const query = value.trim().replace(/\s+/g, ' ').slice(0, MAX_QUERY_LENGTH);
  return query.length > 0 ? query : null;
}

export function queryToSlug(query: string): string {
  return encodeURIComponent(query.toLowerCase().replace(/ /g, '-'));
}

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function slugToQuery(slug: string): string {
  return normalizeQuery(safeDecode(slug).replace(/-/g, ' ')) ?? '';
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
