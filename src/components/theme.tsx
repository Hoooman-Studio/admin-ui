import { LaptopIcon, MoonIcon, SunIcon } from "lucide-react";
import * as React from "react";
import { readStorage, writeStorage } from "../lib/storage";
import { MenuGroupLabel, MenuRadioGroup, MenuRadioItem } from "./menu";
import { useMessages } from "./messages";

const themes = ["system", "light", "dark"] as const;
type Theme = (typeof themes)[number];

const storageKey = "admin-ui:theme";
const darkQuery = "(prefers-color-scheme: dark)";
const listeners = new Set<() => void>();

function isTheme(value: string | null): value is Theme {
  return themes.some((theme) => theme === value);
}

function readTheme(): Theme {
  const stored = readStorage(storageKey);
  return isTheme(stored) ? stored : "system";
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Another tab changed the theme.
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function setTheme(theme: Theme) {
  writeStorage(storageKey, theme);
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

function subscribeSystem(listener: () => void) {
  const query = matchMedia(darkQuery);
  query.addEventListener("change", listener);
  const unsubscribe = subscribe(listener);
  return () => {
    query.removeEventListener("change", listener);
    unsubscribe();
  };
}

function readResolved() {
  const theme = readTheme();
  const dark =
    theme === "dark" || (theme === "system" && matchMedia(darkQuery).matches);
  return dark ? "dark" : "light";
}

/** "light" or "dark": the stored choice, or the system's while it's "system". Undefined on the server. */
function useResolvedTheme() {
  return React.useSyncExternalStore(
    subscribeSystem,
    readResolved,
    () => undefined
  );
}

const options = [
  { value: "system", icon: <LaptopIcon /> },
  { value: "light", icon: <SunIcon /> },
  { value: "dark", icon: <MoonIcon /> },
] satisfies { value: Theme; icon: React.ReactNode }[];

/** The theme choice as menu items. AdminShell puts it in the account menu. */
function ThemeMenuItems() {
  const { theme } = useTheme();
  const messages = useMessages();
  const labels = {
    system: messages.themeSystem,
    light: messages.themeLight,
    dark: messages.themeDark,
  };
  const change = React.useCallback((value: string) => {
    if (isTheme(value)) {
      setTheme(value);
    }
  }, []);
  return (
    <MenuRadioGroup onValueChange={change} value={theme}>
      <MenuGroupLabel>{messages.theme}</MenuGroupLabel>
      {options.map((option) => (
        <MenuRadioItem key={option.value} value={option.value}>
          {option.icon}
          {labels[option.value]}
        </MenuRadioItem>
      ))}
    </MenuRadioGroup>
  );
}

export type { Theme };
export { ThemeMenuItems, useResolvedTheme, useTheme };
