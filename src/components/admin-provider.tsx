import * as React from "react";
import { ConfirmDialog } from "./alert-dialog";
import { useResolvedTheme } from "./theme";
import { Toaster } from "./toast";

interface AdminProviderProps {
  /** The client's brand colour, any CSS colour. */
  accent?: string;
  children: React.ReactNode;
  /** Spacing and layout for the admin's box on a site page, like `mt-8`. */
  className?: string;
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
 * theme and accent, and the rest of the page is left alone. It shows what
 * `toast()` and `confirm()` ask for; a provider inside another leaves that to
 * the outer one. It's a block with the admin's background and text colour,
 * so admin pieces stay readable on a site page in either theme.
 */
function AdminProvider({ accent, children, className }: AdminProviderProps) {
  const nested = React.use(ProviderContext);
  const theme = useResolvedTheme();
  useStylesCheck();
  return (
    <div
      className={className}
      data-admin-ui=""
      data-au-theme={theme}
      // A provider inside another adds no box, so it keeps the page's layout.
      style={
        {
          display: nested ? "contents" : undefined,
          "--au-accent": accent,
        } as React.CSSProperties
      }
    >
      <ProviderContext value>
        {children}
        {nested ? null : (
          <>
            <Toaster />
            <ConfirmDialog />
          </>
        )}
      </ProviderContext>
    </div>
  );
}

export type { AdminProviderProps };
export { AdminProvider, useAdminProvider };
