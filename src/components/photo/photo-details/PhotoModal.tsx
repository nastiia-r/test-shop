'use client';

import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';

import { Dialog } from '@/shared/ui/dialog';

export function PhotoModal({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <Dialog label="Photo details" onClose={() => router.back()} closeButton="tablet-up">
      {children}
    </Dialog>
  );
}
