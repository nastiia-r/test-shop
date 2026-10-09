import styles from './PhotoSkeleton.module.scss';

export function PhotoSkeleton() {
  return (
    <div className={styles.skeleton} role="status" aria-label="Loading photo">
      <div className={styles.bar}>
        <div className={styles.avatar} />
        <div className={styles.line} />
      </div>
      <div className={styles.image} />
    </div>
  );
}
