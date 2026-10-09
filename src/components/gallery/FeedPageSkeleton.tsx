import { GridSkeleton } from './GridSkeleton';
import styles from './FeedPageSkeleton.module.scss';

export function FeedPageSkeleton() {
  return (
    <div className="container">
      <div className="page-head">
        <div className={styles.heading}>
          <div className={styles.title} />
          <div className={styles.subtitle} />
        </div>
      </div>
      <GridSkeleton />
    </div>
  );
}
