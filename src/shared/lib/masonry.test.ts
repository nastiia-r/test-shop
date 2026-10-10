import { describe, expect, it } from 'vitest';

import { distributeIntoColumns } from './masonry';

const square = (id: number) => ({ id, width: 100, height: 100 });
const tall = (id: number) => ({ id, width: 100, height: 300 });

describe('distributeIntoColumns', () => {
  it('keeps the original order when every item has the same size', () => {
    const items = [1, 2, 3, 4, 5, 6].map(square);
    const columns = distributeIntoColumns(items, 3);
    expect(columns.map((col) => col.map((item) => item.id))).toEqual([
      [1, 4],
      [2, 5],
      [3, 6],
    ]);
  });

  it('places the next item into the shortest column', () => {
    const columns = distributeIntoColumns([tall(1), square(2), square(3), square(4)], 2);
    expect(columns.map((col) => col.map((item) => item.id))).toEqual([[1], [2, 3, 4]]);
  });

  it('never loses or duplicates items', () => {
    const items = Array.from({ length: 30 }, (_, i) => ({ id: i, width: 100 + i * 7, height: 80 + i * 13 }));
    for (const count of [1, 2, 3, 5]) {
      const ids = distributeIntoColumns(items, count)
        .flat()
        .map((item) => item.id)
        .sort((a, b) => a - b);
      expect(ids).toEqual(items.map((item) => item.id));
    }
  });

  it('falls back to a single column for invalid counts', () => {
    expect(distributeIntoColumns([square(1)], 0)).toHaveLength(1);
  });
});
