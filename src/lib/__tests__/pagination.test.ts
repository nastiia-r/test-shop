import { describe, expect, it } from 'vitest';

import { getPageItems } from '../pagination';

describe('getPageItems', () => {
  it('lists every page when there are only a few', () => {
    expect(getPageItems(1, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(getPageItems(3, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('collapses the end near the start', () => {
    expect(getPageItems(1, 20)).toEqual([1, 2, 3, 4, 5, 'ellipsis-end', 20]);
    expect(getPageItems(3, 20)).toEqual([1, 2, 3, 4, 5, 'ellipsis-end', 20]);
  });

  it('collapses both sides in the middle', () => {
    expect(getPageItems(10, 20)).toEqual([1, 'ellipsis-start', 9, 10, 11, 'ellipsis-end', 20]);
  });

  it('collapses the start near the end', () => {
    expect(getPageItems(20, 20)).toEqual([1, 'ellipsis-start', 16, 17, 18, 19, 20]);
  });

  it('keeps a constant number of items for long ranges', () => {
    for (let page = 1; page <= 50; page++) {
      expect(getPageItems(page, 50)).toHaveLength(7);
    }
  });
});
