import type * as React from "react";
import { useResolvedTheme } from "./theme";

type AdminScopeProps = React.ComponentProps<"div"> & {
  /** The client's brand colour, any CSS colour. */
  accent?: string;
};

/**
 * Where the admin's styles apply: Hooman Studio's font, reset, theme and
 * accent, without touching the rest of the page. AdminShell is one. Use it on
 * its own to put admin components on any other page.
 */
function AdminScope({ accent, style, ...props }: AdminScopeProps) {
  const theme = useResolvedTheme();
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
