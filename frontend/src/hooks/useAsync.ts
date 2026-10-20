import { useCallback, useEffect, useRef, useState } from "react";
import { ApiError } from "../api/client";

export interface AsyncState<T> { data: T | null; error: ApiError | null; loading: boolean; reload: () => void }

/** Runs `fn` on mount and whenever `key` changes; cancels stale requests. */
export function useAsync<T>(fn: (signal: AbortSignal) => Promise<T>, key: string): AsyncState<T> {
  const [state, setState] = useState<{ data: T | null; error: ApiError | null; loading: boolean }>({ data: null, error: null, loading: true });
  const [tick, setTick] = useState(0);
  const fnRef = useRef(fn);
  fnRef.current = fn;

  useEffect(() => {
    const ctrl = new AbortController();
    setState((s) => ({ ...s, error: null, loading: true }));
    fnRef.current(ctrl.signal)
      .then((data) => setState({ data, error: null, loading: false }))
      .catch((e: unknown) => {
        if (ctrl.signal.aborted) return;
        setState({ data: null, error: e instanceof ApiError ? e : new ApiError("server", 0), loading: false });
      });
    return () => ctrl.abort();
  }, [key, tick]);

  return { ...state, reload: useCallback(() => setTick((t) => t + 1), []) };
}
