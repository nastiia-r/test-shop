import '@/styles/globals.scss';

import type { Metadata, Viewport } from 'next';

import { Footer } from '@/components/Footer';
import { Header } from '@/components/header/Header';
import { gridPreferenceScript } from '@/lib/grid-preference';
import { APP_NAME } from '@/lib/unsplash/attribution';

export const metadata: Metadata = {
  title: {
    default: `${APP_NAME} — Beautiful free images & pictures`,
    template: `%s | ${APP_NAME}`,
  },
  description: 'Discover and save beautiful free photos from the Unsplash community.',
  applicationName: APP_NAME,
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
};

export default function RootLayout({ children, modal }: LayoutProps<'/'>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: gridPreferenceScript }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        {modal}
      </body>
    </html>
  );
}
