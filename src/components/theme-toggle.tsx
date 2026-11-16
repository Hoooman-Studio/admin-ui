import * as React from "react";
import { cn } from "../lib/cn";
import { Button } from "./button";

type Theme = "light" | "dark";

const storageKey = "admin-ui:theme";
const listeners = new Set<() => void>();

function readTheme(): Theme {
  const stored = localStorage.getItem(storageKey);
  if (stored === "light" || stored === "dark") {
    return stored;
  }
  return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function setTheme(theme: Theme) {
  localStorage.setItem(storageKey, theme);
  for (const listener of listeners) {
    listener();
  }
}

/**
 * Switches between light and dark, sets `data-theme` on `<html>` and keeps
 * the choice in localStorage. Without a stored choice it follows the system.
 * AdminShell shows one in its header.
 */
function ThemeToggle({ className }: { className?: string }) {
  const theme = React.useSyncExternalStore<Theme | null>(
    subscribe,
    readTheme,
    () => null
  );
  const [turns, setTurns] = React.useState(0);

  React.useEffect(() => {
    if (theme) {
      document.documentElement.dataset.theme = theme;
    }
  }, [theme]);

  const toggle = React.useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
    setTurns((count) => count + 1);
  }, [theme]);

  return (
    <Button
      aria-label={theme === "dark" ? "Use light theme" : "Use dark theme"}
      className={cn("group", className)}
      onClick={toggle}
      rounded
      size="icon"
      variant="ghost"
    >
      <svg
        aria-hidden="true"
        className="ease-fluid transition-[rotate,transform] duration-300 group-hover:rotate-45"
        fill="none"
        style={{ transform: `rotate(${turns * 180}deg)` }}
        viewBox="0 0 225 225"
      >
        <path
          clipRule="evenodd"
          d="M112.938 224.256C51.0826 224.256 0.938477 174.112 0.938477 112.256C0.938477 50.4005 51.0826 0.256348 112.938 0.256348C174.794 0.256348 224.938 50.4005 224.938 112.256C224.938 174.112 174.794 224.256 112.938 224.256ZM112.938 207.456C165.516 207.456 208.138 164.834 208.138 112.256C208.138 59.6788 165.516 17.0563 112.938 17.0563V207.456Z"
          fill="currentColor"
          fillRule="evenodd"
        />
      </svg>
    </Button>
  );
}

export { ThemeToggle };
