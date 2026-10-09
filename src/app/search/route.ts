import { type NextRequest, NextResponse } from 'next/server';

import { normalizeQuery, queryToSlug } from '@/lib/search-params';

export function GET(request: NextRequest) {
  const query = normalizeQuery(request.nextUrl.searchParams.get('q') ?? '');
  const target = query ? `/s/photos/${queryToSlug(query)}` : '/';
  return NextResponse.redirect(new URL(target, request.url), 303);
}
