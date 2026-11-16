import { LaptopIcon, MoonIcon, SunIcon } from "lucide-react";
import * as React from "react";
import { MenuGroupLabel, MenuRadioGroup, MenuRadioItem } from "./menu";

const themes = ["system", "light", "dark"] as const;
type Theme = (typeof themes)[number];

const storageKey = "admin-ui:theme";
const darkQuery = "(prefers-color-scheme: dark)";
const listeners = new Set<() => void>();

function isTheme(value: string | null): value is Theme {
  return themes.some((theme) => theme === value);
}

function readTheme(): Theme {
  const stored = localStorage.getItem(storageKey);
  return isTheme(stored) ? stored : "system";
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

/** The stored theme choice, "system" until someone picks one. Shared by every caller. */
function useTheme() {
  const theme = React.useSyncExternalStore(
    subscribe,
    readTheme,
    () => "system" as const
  );
  return { theme, setTheme };
}

/** Sets `data-theme` on `<html>` from the stored choice, following the system while it's "system". AdminShell calls it. */
function useApplyTheme() {
  const { theme } = useTheme();
  React.useEffect(() => {
    const query = matchMedia(darkQuery);
    const apply = () => {
      const dark = theme === "dark" || (theme === "system" && query.matches);
      document.documentElement.dataset.theme = dark ? "dark" : "light";
    };
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, [theme]);
}

const options = [
  { value: "system", label: "System", icon: <LaptopIcon /> },
  { value: "light", label: "Light", icon: <SunIcon /> },
  { value: "dark", label: "Dark", icon: <MoonIcon /> },
] satisfies { value: Theme; label: string; icon: React.ReactNode }[];

/** The theme choice as menu items. AdminShell puts it in the account menu. */
function ThemeMenuItems() {
  const { theme } = useTheme();
  const change = React.useCallback((value: string) => {
    if (isTheme(value)) {
      setTheme(value);
    }
  }, []);
  return (
    <MenuRadioGroup onValueChange={change} value={theme}>
      <MenuGroupLabel>Theme</MenuGroupLabel>
      {options.map((option) => (
        <MenuRadioItem key={option.value} value={option.value}>
          {option.icon}
          {option.label}
        </MenuRadioItem>
      ))}
    </MenuRadioGroup>
  );
}

export type { Theme };
export { ThemeMenuItems, useApplyTheme, useTheme };
