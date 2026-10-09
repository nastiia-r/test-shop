export type PageItem = number | 'ellipsis-start' | 'ellipsis-end';

export function getPageItems(current: number, total: number, siblings = 1): PageItem[] {
  const slots = siblings * 2 + 5;
  if (total <= slots) return Array.from({ length: total }, (_, i) => i + 1);

  const left = Math.max(current - siblings, 1);
  const right = Math.min(current + siblings, total);
  const showStartEllipsis = left > 3;
  const showEndEllipsis = right < total - 2;

  if (!showStartEllipsis) {
    const count = siblings * 2 + 3;
    return [...Array.from({ length: count }, (_, i) => i + 1), 'ellipsis-end', total];
  }

  if (!showEndEllipsis) {
    const count = siblings * 2 + 3;
    return [1, 'ellipsis-start', ...Array.from({ length: count }, (_, i) => total - count + 1 + i)];
  }

  return [1, 'ellipsis-start', ...Array.from({ length: right - left + 1 }, (_, i) => left + i), 'ellipsis-end', total];
}
