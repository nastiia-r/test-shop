import '@/shared/styles/globals.scss';

import type { Metadata, Viewport } from 'next';

import { GridDensityProvider } from '@/components/feed/grid-density';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { APP_DESCRIPTION, APP_NAME, APP_TITLE } from '@/shared/config';

export const metadata: Metadata = {
  title: {
    default: APP_TITLE,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  applicationName: APP_NAME,
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
};

export default function RootLayout({ children, modal }: LayoutProps<'/'>) {
  return (
    <html lang="en">
      <body>
        <GridDensityProvider>
          <a href="#main" className="skip-link">
            Skip to content
          </a>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          {modal}
        </GridDensityProvider>
      </body>
    </html>
  );
}
