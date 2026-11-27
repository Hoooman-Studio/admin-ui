import * as React from "react";
import { useAdminProvider } from "../components/admin-provider";
import { useMessages } from "../components/messages";
import { RailContext } from "../components/nav";
import { cn } from "../lib/cn";
import { readStorage, writeStorage } from "../lib/storage";
import { ErrorBoundary } from "./error-boundary";

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

const readCollapsed = () => readStorage(storageKey) === "true";

function toggleCollapsed() {
  writeStorage(storageKey, String(!readCollapsed()));
  for (const listener of listeners) {
    listener();
  }
}

/** The server always renders the rail expanded; the stored choice applies once hydrated. */
const useCollapsed = () =>
  React.useSyncExternalStore(subscribeCollapsed, readCollapsed, () => false);

interface AdminShellProps {
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
 * icons (the choice is kept in localStorage) and the scrolling page. It covers
 * the viewport, whatever the site's body and wrappers do. On phones
 * the rail is a drawer opened from AdminHeaderTitle. A page that throws shows
 * an ErrorBoundary in its place. It must be inside AdminProvider.
 */
function AdminShell({ header, nav, children, className }: AdminShellProps) {
  useAdminProvider("AdminShell");
  const collapsed = useCollapsed();
  const { mainNav } = useMessages();

  return (
    <div
      className={cn(
        "au:fixed au:inset-0 au:flex au:flex-col au:bg-gray-50 au:text-gray-950",
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
              aria-label={mainNav}
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
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>
      </div>
    </div>
  );
}

export type { AdminShellProps };
export { AdminShell, toggleCollapsed, useShell };
