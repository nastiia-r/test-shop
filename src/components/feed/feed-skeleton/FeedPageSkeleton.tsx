import { Container } from '@/shared/ui/container';
import { Skeleton } from '@/shared/ui/skeleton';

import { GridSkeleton } from './GridSkeleton';
import styles from './FeedPageSkeleton.module.scss';

export function FeedPageSkeleton() {
  return (
    <Container>
      <div className={styles.heading}>
        <Skeleton className={styles.title} />
        <Skeleton className={styles.subtitle} />
      </div>
      <GridSkeleton />
    </Container>
  );
}
