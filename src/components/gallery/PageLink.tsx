'use client';

import Link, { useLinkStatus } from 'next/link';
import type { ComponentProps } from 'react';

function PendingMarker() {
  const { pending } = useLinkStatus();
  return pending ? <span data-pending="" aria-hidden="true" /> : null;
}

export function PageLink({ children, ...props }: ComponentProps<typeof Link>) {
  return (
    <Link {...props}>
      {children}
      <PendingMarker />
    </Link>
  );
}
