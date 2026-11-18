import * as React from "react";
import { ConfirmDialog } from "./alert-dialog";
import { useResolvedTheme } from "./theme";
import { Toaster } from "./toast";

interface AdminProviderProps {
  /** The client's brand colour, any CSS colour. */
  accent?: string;
  children: React.ReactNode;
}

const ProviderContext = React.createContext(false);

/** Throws outside AdminProvider, so a missing provider isn't silent. */
function useAdminProvider(name: string) {
  if (!React.use(ProviderContext)) {
    throw new Error(`${name} must be inside AdminProvider.`);
  }
}

let checkedStyles = false;

/** Warns once when the package's CSS isn't on the page, the most likely setup mistake. */
function useStylesCheck() {
  React.useEffect(() => {
    if (checkedStyles) {
      return;
    }
    checkedStyles = true;
    const loaded = getComputedStyle(document.documentElement)
      .getPropertyValue("--au-gray-50")
      .trim();
    if (!loaded) {
      console.warn(
        '@hooman-studio/admin-ui: its CSS isn\'t loaded, so the admin is unstyled. Import "@hooman-studio/admin-ui/styles.css" in your admin route, or "@hooman-studio/admin-ui/tailwind.css" from your admin CSS on Tailwind v4.'
      );
    }
  }, []);
}

/**
 * Sets up the admin. Put it in the admin's layout route, around every admin
 * page including login. Everything inside gets Hooman Studio's font, reset,
 * theme and accent, and the rest of the page is left alone. It mounts the
 * Toaster and ConfirmDialog, so `toast()` and `confirm()` work anywhere
 * inside. It adds no box of its own (`display: contents`), so pages keep
 * their layout.
 */
function AdminProvider({ accent, children }: AdminProviderProps) {
  const theme = useResolvedTheme();
  useStylesCheck();
  return (
    <div
      className="au:contents"
      data-admin-ui=""
      data-au-theme={theme}
      style={
        accent ? ({ "--au-accent": accent } as React.CSSProperties) : undefined
      }
    >
      <ProviderContext value>
        {children}
        <Toaster />
        <ConfirmDialog />
      </ProviderContext>
    </div>
  );
}

export type { AdminProviderProps };
export { AdminProvider, useAdminProvider };
