'use client';

import { useSyncExternalStore } from 'react';

const overrides = new Map<string, boolean>();
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setSavedOverride(id: string, saved: boolean) {
  overrides.set(id, saved);
  listeners.forEach((listener) => listener());
}

export function clearSavedOverrides() {
  overrides.clear();
  listeners.forEach((listener) => listener());
}

export function useSaved(id: string, serverValue: boolean): boolean {
  return useSyncExternalStore(
    subscribe,
    () => overrides.get(id) ?? serverValue,
    () => serverValue,
  );
}
