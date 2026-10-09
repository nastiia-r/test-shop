import styles from './GridSkeleton.module.scss';

const RATIOS = [1.5, 0.67, 1.25, 0.8, 1.4, 1, 0.75, 1.5, 0.67, 1.2, 1.33, 0.9, 1.5, 0.7, 1.1];

export function GridSkeleton({ label = 'Loading photos' }: { label?: string }) {
  return (
    <div className={styles.skeleton} role="status" aria-label={label}>
      {Array.from({ length: 5 }, (_, column) => (
        <div key={column} className={styles.column}>
          {RATIOS.slice(column * 3, column * 3 + 3).map((ratio, index) => (
            <div key={index} className={styles.tile} style={{ aspectRatio: `1 / ${ratio}` }} />
          ))}
        </div>
      ))}
    </div>
  );
}
