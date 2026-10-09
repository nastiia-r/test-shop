'use client';

import { useSyncExternalStore } from 'react';

import { GridComfortIcon, GridDenseIcon } from '@/components/icons';
import { GRID_STORAGE_KEY, type GridDensity } from '@/lib/grid-preference';

import styles from './LayoutToggle.module.scss';

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const getDensity = (): GridDensity => (document.documentElement.dataset.grid === 'dense' ? 'dense' : 'comfortable');

function setDensity(density: GridDensity) {
  document.documentElement.dataset.grid = density;
  try {
    localStorage.setItem(GRID_STORAGE_KEY, density);
  } catch {}
  listeners.forEach((listener) => listener());
}

const OPTIONS = [
  { density: 'comfortable', label: '3 columns', Icon: GridComfortIcon },
  { density: 'dense', label: '5 columns', Icon: GridDenseIcon },
] as const;

export function LayoutToggle() {
  const current = useSyncExternalStore(subscribe, getDensity, () => 'comfortable' as const);

  return (
    <div className={styles.toggle} role="group" aria-label="Grid layout">
      {OPTIONS.map(({ density, label, Icon }) => (
        <button
          key={density}
          type="button"
          className={styles.option}
          data-density={density}
          aria-pressed={current === density}
          onClick={() => setDensity(density)}
          title={label}
        >
          <Icon size={18} />
          <span className={styles.label}>{label}</span>
        </button>
      ))}
    </div>
  );
}
