import * as React from "react";
import { useResolvedTheme } from "./theme";

type AdminScopeProps = React.ComponentProps<"div"> & {
  /** The client's brand colour, any CSS colour. */
  accent?: string;
};

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
 * Where the admin's styles apply: Hooman Studio's font, reset, theme and
 * accent, without touching the rest of the page. AdminShell is one. Use it on
 * its own to put admin components on any other page.
 */
function AdminScope({ accent, style, ...props }: AdminScopeProps) {
  const theme = useResolvedTheme();
  useStylesCheck();
  return (
    <div
      data-admin-ui=""
      data-au-theme={theme}
      style={
        accent
          ? ({ ...style, "--au-accent": accent } as React.CSSProperties)
          : style
      }
      {...props}
    />
  );
}

export type { AdminScopeProps };
export { AdminScope };
