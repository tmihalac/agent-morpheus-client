// SPDX-FileCopyrightText: Copyright (c) 2026, Red Hat Inc. & AFFILIATES. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { REPORTS_LIVE_UPDATES_SSE_PATH } from "../constants/sse";
import { LiveUpdatesContext, type LiveUpdatesStore } from "./liveUpdates";

/**
 * Owns one {@link EventSource} for the server-sent events stream at {@link REPORTS_LIVE_UPDATES_SSE_PATH}.
 *
 * The server emits two kinds of frames:
 *  - `event: update` - report or product data may have changed; triggers a revision bump so hooks re-fetch.
 *  - SSE comment lines (`: keepalive`) - sent periodically to prevent proxy idle-timeout disconnects;
 *    the browser discards them and they never reach this listener.
 *
 * Hooks opt in with `liveUpdatesRefresh` on `useApi` / `usePaginatedApi` and observe bumps via `useLiveUpdatesRevision`.
 */
export function LiveUpdatesProvider({ children }: { children: ReactNode }) {
  const stateRef = useRef({ revision: 0, listeners: new Set<() => void>() });

  const bump = useCallback(() => {
    stateRef.current.revision += 1;
    stateRef.current.listeners.forEach((fn) => {
      fn();
    });
  }, []);

  useEffect(() => {
    const url = `${window.location.origin}${REPORTS_LIVE_UPDATES_SSE_PATH}`;
    const es = new EventSource(url, { withCredentials: true });
    es.addEventListener("update", () => {
      bump();
    });
    es.onerror = (event) => {
      console.error(
        "[LiveUpdates] EventSource error",
        { url, readyState: es.readyState },
        event
      );
    };
    return () => {
      es.close();
    };
  }, [bump]);

  const store = useMemo<LiveUpdatesStore>(
    () => ({
      subscribe: (onChange) => {
        const wrapped = () => {
          onChange();
        };
        stateRef.current.listeners.add(wrapped);
        return () => {
          stateRef.current.listeners.delete(wrapped);
        };
      },
      getSnapshot: () => stateRef.current.revision,
    }),
    []
  );

  return <LiveUpdatesContext.Provider value={store}>{children}</LiveUpdatesContext.Provider>;
}
