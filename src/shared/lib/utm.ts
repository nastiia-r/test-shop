import { APP_NAME } from '@/shared/config';

export function withUtm(href: string): string {
  const url = new URL(href);
  url.searchParams.set('utm_source', APP_NAME.toLowerCase());
  url.searchParams.set('utm_medium', 'referral');
  return url.toString();
}
