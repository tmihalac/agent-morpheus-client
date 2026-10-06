// SPDX-FileCopyrightText: Copyright (c) 2026, Red Hat Inc. & AFFILIATES. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import { createContext, useContext, useSyncExternalStore } from "react";

export type LiveUpdatesStore = {
  subscribe: (onChange: () => void) => () => void;
  getSnapshot: () => number;
};

export const LiveUpdatesContext = createContext<LiveUpdatesStore | null>(null);

/**
 * Monotonic counter incremented on each SSE message from the live-updates stream.
 * When {@code enabled} is false, does not subscribe (no subscription churn for hooks that opted out).
 */
export function useLiveUpdatesRevision(enabled: boolean): number {
  const store = useContext(LiveUpdatesContext);
  return useSyncExternalStore(
    (onChange) => {
      if (!enabled || !store) {
        return () => {};
      }
      return store.subscribe(onChange);
    },
    () => (enabled && store ? store.getSnapshot() : 0),
    () => 0
  );
}
