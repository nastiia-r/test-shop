import { NextResponse } from 'next/server';

import { getUnsplashErrorKind, trackDownload } from '@/lib/unsplash/client';

export async function GET(_request: Request, { params }: RouteContext<'/photos/[id]/download'>) {
  const { id } = await params;

  try {
    const fileUrl = new URL(await trackDownload(id));
    fileUrl.searchParams.set('dl', `picky-${id}.jpg`);
    return NextResponse.redirect(fileUrl, 302);
  } catch (error) {
    const kind = getUnsplashErrorKind(error);
    if (kind === 'not-found') return new NextResponse('Photo not found', { status: 404 });
    if (kind === 'rate-limit') return new NextResponse('Unsplash rate limit reached, try again later', { status: 429 });
    throw error;
  }
}
