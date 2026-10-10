import type { Orientation, SearchOrder } from '@/shared/types/photo';

import { firstParam, type SearchParamValue } from './search-params';

export const ORIENTATIONS: readonly Orientation[] = ['landscape', 'portrait', 'squarish'];

export function parseOrientation(value: SearchParamValue): Orientation | undefined {
  const raw = firstParam(value);
  return ORIENTATIONS.find((orientation) => orientation === raw);
}

export function parseOrder(value: SearchParamValue): SearchOrder {
  return firstParam(value) === 'latest' ? 'latest' : 'relevant';
}

export function toSearchQuery(orientation: Orientation | undefined, order: SearchOrder) {
  return { orientation, order_by: order === 'latest' ? 'latest' : undefined };
}
