export const APP_NAME = 'Picky';

export function withUtm(href: string): string {
  const url = new URL(href);
  url.searchParams.set('utm_source', APP_NAME.toLowerCase());
  url.searchParams.set('utm_medium', 'referral');
  return url.toString();
}

export const UNSPLASH_HOME = withUtm('https://unsplash.com');
