import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { ThemeMode } from "../types";

const KEY = "aurelle-theme";

function readMode(): ThemeMode {
  try {
    const s = localStorage.getItem(KEY);
    return s === "light" || s === "dark" ? s : "system";
  } catch {
    return "system";
  }
}

const ThemeContext = createContext<{ mode: ThemeMode; setMode: (m: ThemeMode) => void } | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(readMode);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const dark = mode === "dark" || (mode === "system" && mq.matches);
      document.documentElement.dataset.theme = dark ? "dark" : "light";
      document.documentElement.dataset.mode = mode;
    };
    apply();
    if (mode !== "system") return;
    mq.addEventListener("change", apply); // follow device changes live
    return () => mq.removeEventListener("change", apply);
  }, [mode]);

  const setMode = useCallback((m: ThemeMode) => {
    setModeState(m);
    try {
      if (m === "system") localStorage.removeItem(KEY);
      else localStorage.setItem(KEY, m);
    } catch { /* storage unavailable */ }
  }, []);

  const value = useMemo(() => ({ mode, setMode }), [mode, setMode]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
