import * as React from "react";
import { cn } from "../lib/cn";
import { ConfirmDialog } from "./alert-dialog";
import { useApplyTheme } from "./theme";
import { Toaster } from "./toast";

interface RailState {
  collapsed: boolean;
  /** Closes the phone drawer once a nav item is pressed. */
  onNavigate?: () => void;
}

const RailContext = React.createContext<RailState>({ collapsed: false });

/** What the nav inside AdminShell needs to know about the rail it sits in. */
function useRail() {
  return React.use(RailContext);
}

/** The shell's nav and rail state, for AdminHeaderTitle's rail toggle and phone menu. */
const ShellContext = React.createContext<{
  collapsed: boolean;
  nav: React.ReactNode;
} | null>(null);

function useShell() {
  const shell = React.use(ShellContext);
  if (!shell) {
    throw new Error("AdminHeader parts must be inside AdminShell's header.");
  }
  return shell;
}

const storageKey = "admin-ui:rail-collapsed";
const listeners = new Set<() => void>();

function subscribeCollapsed(onChange: () => void) {
  listeners.add(onChange);
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

const readCollapsed = () => localStorage.getItem(storageKey) === "true";

function toggleCollapsed() {
  localStorage.setItem(storageKey, String(!readCollapsed()));
  for (const listener of listeners) {
    listener();
  }
}

/** The server always renders the rail expanded; the stored choice applies once hydrated. */
const useCollapsed = () =>
  React.useSyncExternalStore(subscribeCollapsed, readCollapsed, () => false);

interface AdminShellProps {
  /** The client's brand colour, any CSS colour. Sets `--accent` for everything inside. */
  accent?: string;
  /** The page: a PageHeader, PageToolbar and PageBody. */
  children: React.ReactNode;
  className?: string;
  /** An AdminHeader with its parts, like AdminHeaderAccount, AdminHeaderTitle and AdminHeaderStudioLink. */
  header: React.ReactNode;
  /** NavSection and NavItem elements. */
  nav: React.ReactNode;
}

/**
 * The admin's frame: the header you compose, a nav rail that collapses to
 * icons (the choice is kept in localStorage) and the scrolling page. On phones
 * the rail is a drawer opened from AdminHeaderTitle. It applies the theme and
 * mounts the Toaster and ConfirmDialog, so `toast()` and `confirm()` work
 * anywhere inside.
 */
function AdminShell({
  accent,
  header,
  nav,
  children,
  className,
}: AdminShellProps) {
  const collapsed = useCollapsed();
  useApplyTheme();
  const accentStyle = accent
    ? ({ "--accent": accent } as React.CSSProperties)
    : undefined;

  return (
    <div
      className={cn("flex h-dvh flex-col bg-gray-50 text-gray-950", className)}
      style={accentStyle}
    >
      <ShellContext value={{ collapsed, nav }}>{header}</ShellContext>
      <div className="flex min-h-0 flex-1">
        <aside
          className={cn(
            "border-alpha/10 ease-fluid hidden shrink-0 flex-col overflow-hidden border-r transition-[width] duration-250 md:flex",
            collapsed ? "w-[4.8125rem]" : "w-72 lg:w-96"
          )}
          data-collapsed={collapsed ? "" : undefined}
        >
          <RailContext value={{ collapsed }}>
            <nav
              aria-label="Main"
              className={cn(
                "scrollbar-hidden ease-fluid flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto py-3 transition-[padding] duration-250",
                collapsed ? "px-4" : "px-3"
              )}
            >
              {nav}
            </nav>
          </RailContext>
        </aside>
        <main className="@container/page-content isolate flex min-w-0 flex-1 flex-col overflow-y-auto">
          {children}
        </main>
      </div>
      <Toaster />
      <ConfirmDialog />
    </div>
  );
}

export type { AdminShellProps };
export { AdminShell, RailContext, toggleCollapsed, useRail, useShell };
