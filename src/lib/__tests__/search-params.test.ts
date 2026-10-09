import { describe, expect, it } from 'vitest';

import { buildHref, normalizeQuery, parseOrientation, parsePage, queryToSlug, slugToQuery } from '../search-params';

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

describe('parseOrientation', () => {
  it('accepts known values only', () => {
    expect(parseOrientation('portrait')).toBe('portrait');
    expect(parseOrientation('diagonal')).toBeUndefined();
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
});

describe('buildHref', () => {
  it('merges params and drops page=1', () => {
    expect(buildHref('/s/photos/cat', { orientation: 'portrait', page: '3' }, { page: 1 })).toBe(
      '/s/photos/cat?orientation=portrait',
    );
    expect(buildHref('/', {}, { page: 2 })).toBe('/?page=2');
  });
});
