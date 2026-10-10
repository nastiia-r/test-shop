import { describe, expect, it } from 'vitest';

import { buildHref, normalizeQuery, parsePage, queryToSlug, slugToQuery } from './search-params';

describe('parsePage', () => {
  it.each([
    [undefined, 1],
    ['3', 3],
    [['4', '5'], 4],
    ['0', 1],
    ['-2', 1],
    ['2.5', 1],
    ['abc', 1],
  ])('parses %j as %i', (input, expected) => {
    expect(parsePage(input)).toBe(expected);
  });
});

describe('query helpers', () => {
  it('normalises whitespace and rejects empty input', () => {
    expect(normalizeQuery('  dark   forest ')).toBe('dark forest');
    expect(normalizeQuery('   ')).toBeNull();
  });

  it('round-trips a query through a URL slug', () => {
    const slug = queryToSlug('Black Cat');
    expect(slug).toBe('black-cat');
    expect(slugToQuery(slug)).toBe('black cat');
    expect(slugToQuery(queryToSlug('café & tea'))).toBe('café & tea');
  });

  it('survives malformed percent-encoding', () => {
    expect(slugToQuery('%E0%A4%A')).toBe('%E0%A4%A');
    expect(slugToQuery('%')).toBe('%');
  });

  it('limits the query length', () => {
    expect(slugToQuery('a'.repeat(500))).toHaveLength(100);
  });
});

describe('buildHref', () => {
  it('merges params and drops page=1', () => {
    expect(buildHref('/s/photos/cat', { orientation: 'portrait', page: '3' }, { page: 1 })).toBe(
      '/s/photos/cat?orientation=portrait',
    );
    expect(buildHref('/', {}, { page: 2 })).toBe('/?page=2');
  });
});
