import * as React from "react";
import { cn } from "../lib/cn";
import { AdminScope } from "./admin-scope";
import { ConfirmDialog } from "./alert-dialog";
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
  /** The client's brand colour, any CSS colour. Sets `--au-accent` for everything inside. */
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
 * the rail is a drawer opened from AdminHeaderTitle. It is an AdminScope, so the admin's styles apply inside it only. It
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

  return (
    <AdminScope
      accent={accent}
      className={cn(
        "au:flex au:h-dvh au:flex-col au:bg-gray-50 au:text-gray-950",
        className
      )}
    >
      <ShellContext value={{ collapsed, nav }}>{header}</ShellContext>
      <div className="au:flex au:min-h-0 au:flex-1">
        <aside
          className={cn(
            "au:border-alpha/10 au:ease-fluid au:hidden au:shrink-0 au:flex-col au:overflow-hidden au:border-r au:transition-[width] au:duration-250 au:md:flex",
            collapsed ? "au:w-[4.8125rem]" : "au:w-72 au:lg:w-96"
          )}
          data-collapsed={collapsed ? "" : undefined}
        >
          <RailContext value={{ collapsed }}>
            <nav
              aria-label="Main"
              className={cn(
                "au:scrollbar-hidden au:ease-fluid au:flex au:min-h-0 au:flex-1 au:flex-col au:gap-0.5 au:overflow-y-auto au:py-3 au:transition-[padding] au:duration-250",
                collapsed ? "au:px-4" : "au:px-3"
              )}
            >
              {nav}
            </nav>
          </RailContext>
        </aside>
        <main className="au:@container/page-content au:isolate au:flex au:min-w-0 au:flex-1 au:flex-col au:overflow-y-auto">
          {children}
        </main>
      </div>
      <Toaster />
      <ConfirmDialog />
    </AdminScope>
  );
}

export type { AdminShellProps };
export { AdminShell, RailContext, toggleCollapsed, useRail, useShell };
