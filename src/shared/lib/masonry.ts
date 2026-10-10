export interface Sized {
  width: number;
  height: number;
}

export function distributeIntoColumns<T extends Sized>(items: readonly T[], count: number): T[][] {
  const columns = Array.from({ length: Math.max(1, count) }, () => [] as T[]);
  const heights = new Array<number>(columns.length).fill(0);

  for (const item of items) {
    let shortest = 0;
    for (let i = 1; i < heights.length; i++) {
      if (heights[i] < heights[shortest]) shortest = i;
    }
    columns[shortest].push(item);
    heights[shortest] += item.width > 0 ? item.height / item.width : 1;
  }

  return columns;
}
