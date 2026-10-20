import { Monitor, Moon, Sun, type LucideIcon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import type { ThemeMode } from "../../types";

const options: { mode: ThemeMode; label: string; Icon: LucideIcon }[] = [
  { mode: "light", label: "Light", Icon: Sun },
  { mode: "system", label: "System", Icon: Monitor },
  { mode: "dark", label: "Dark", Icon: Moon },
];

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { mode, setMode } = useTheme();
  return (
    <div role="radiogroup" aria-label="Colour theme" className={`inline-flex border border-line ${className}`}>
      {options.map(({ mode: m, label, Icon }) => (
        <button
          key={m}
          role="radio"
          aria-checked={mode === m}
          aria-label={label}
          title={label}
          onClick={() => setMode(m)}
          className={`grid h-12 w-12 place-items-center transition-colors duration-300 ${mode === m ? "bg-fg text-bg" : "text-muted hover:text-fg"}`}
        >
          <Icon size={18} strokeWidth={1.5} />
        </button>
      ))}
    </div>
  );
}
