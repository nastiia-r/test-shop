import { describe, expect, it } from 'vitest';

import { parseOrder, parseOrientation } from './search-filters';

describe('parseOrientation', () => {
  it('accepts known values only', () => {
    expect(parseOrientation('portrait')).toBe('portrait');
    expect(parseOrientation(['squarish', 'portrait'])).toBe('squarish');
    expect(parseOrientation('diagonal')).toBeUndefined();
  });
});

describe('parseOrder', () => {
  it('defaults to relevance', () => {
    expect(parseOrder('latest')).toBe('latest');
    expect(parseOrder('oldest')).toBe('relevant');
    expect(parseOrder(undefined)).toBe('relevant');
  });
});
