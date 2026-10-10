import { Skeleton } from '@/shared/ui/skeleton';

import { CloseModalButton } from './CloseModalButton';
import styles from './PhotoDetailsSkeleton.module.scss';

export function PhotoDetailsSkeleton({ inModal = false }: { inModal?: boolean }) {
  return (
    <div className={styles.skeleton} role="status" aria-label="Loading photo">
      <div className={styles.bar}>
        <Skeleton shape="circle" width={40} height={40} />
        <Skeleton width={160} height={16} />
        {inModal && (
          <div className={styles.actions}>
            <CloseModalButton />
          </div>
        )}
      </div>
      <Skeleton shape="rect" className={styles.image} />
    </div>
  );
}
