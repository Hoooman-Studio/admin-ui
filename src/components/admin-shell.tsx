import {
  ArrowLeftFromLineIcon,
  ArrowRightFromLineIcon,
  MenuIcon,
} from "lucide-react";
import * as React from "react";
import { cn } from "../lib/cn";
import { ConfirmDialog } from "./alert-dialog";
import { Avatar } from "./avatar";
import { Button } from "./button";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./drawer";
import { Menu, MenuContent, MenuSeparator, MenuTrigger } from "./menu";
import { ThemeMenuItems, useApplyTheme } from "./theme";
import { Toaster } from "./toast";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

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
  /** The signed-in user, shown as the avatar that opens the account menu. */
  account?: { name: string; email?: string; image?: string | null };
  /** Menu items under the theme choice in the account menu, like Profile and Sign out. */
  accountMenu?: React.ReactNode;
  /** The page: a PageHeader, PageToolbar and PageBody. */
  children: React.ReactNode;
  className?: string;
  /** The client's name, shown in the header and the phone menu. */
  name: string;
  /** NavSection and NavItem elements. */
  nav: React.ReactNode;
  /** Where the Hooman Studio mark at the right of the header links to. `null` hides it. */
  studioHref?: string | null;
}

const titleClass =
  "truncate py-1 text-2xl leading-none font-semibold tracking-[-0.02em] text-gray-950";

/**
 * The admin's frame: a header bar, a nav rail that collapses to icons (the
 * choice is kept in localStorage) and the scrolling page. On phones the rail
 * is a drawer opened from the header. The avatar on the left opens the
 * account menu with the theme choice; the Hooman mark on the right links to
 * Hooman Studio. It mounts the Toaster and ConfirmDialog, so `toast()` and
 * `confirm()` work anywhere inside.
 */
function AdminShell({
  name,
  accent,
  account,
  accountMenu,
  nav,
  studioHref = "https://hooman.com/dashboard",
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
      <header className="border-alpha/10 flex h-19 shrink-0 border-b">
        <div className="flex w-14 shrink-0 items-center justify-center sm:w-19">
          <AccountMenu account={account} name={name}>
            {accountMenu}
          </AccountMenu>
        </div>
        <div className="border-alpha/10 flex min-w-0 flex-1 items-center gap-4 border-l px-4 sm:px-6">
          <MobileNav name={name} nav={nav} />
          <RailToggle collapsed={collapsed} />
          <span className={titleClass}>{name}</span>
        </div>
        {studioHref ? (
          <a
            aria-label="Open Hooman Studio"
            className="border-alpha/10 hover:bg-alpha/5 focus-visible:outline-accent flex w-14 shrink-0 items-center justify-center border-l text-gray-950 transition-colors duration-100 focus-visible:outline-2 focus-visible:-outline-offset-2 sm:w-19"
            href={studioHref}
          >
            <PixelLogo />
          </a>
        ) : null}
      </header>
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

function DefaultLogo({ name }: { name: string }) {
  return (
    <span
      aria-hidden="true"
      className="bg-accent text-accent-foreground flex size-9 items-center justify-center rounded-xl text-base font-semibold"
    >
      {name.charAt(0)}
    </span>
  );
}

/** The left cell: the user's avatar, or the client's initial without one, opening the account menu. */
function AccountMenu({
  account,
  name,
  children,
}: {
  account: AdminShellProps["account"];
  name: string;
  children: React.ReactNode;
}) {
  return (
    <Menu>
      <MenuTrigger
        aria-label="Open account menu"
        className="touch-target hover:bg-alpha/5 focus-visible:outline-accent flex size-full items-center justify-center focus-visible:outline-2 focus-visible:-outline-offset-2"
      >
        {account ? (
          <Avatar
            className="size-9 sm:size-12"
            name={account.name}
            size="lg"
            src={account.image}
          />
        ) : (
          <DefaultLogo name={name} />
        )}
      </MenuTrigger>
      <MenuContent align="start" className="min-w-60">
        {account ? (
          <>
            <div className="flex flex-col px-2 py-1.5">
              <span className="truncate text-sm font-medium text-gray-950">
                {account.name}
              </span>
              {account.email ? (
                <span className="truncate text-xs text-gray-500">
                  {account.email}
                </span>
              ) : null}
            </div>
            <MenuSeparator />
          </>
        ) : null}
        <ThemeMenuItems />
        {children ? (
          <>
            <MenuSeparator />
            {children}
          </>
        ) : null}
      </MenuContent>
    </Menu>
  );
}

function PixelLogo() {
  return (
    <svg
      aria-hidden="true"
      className="size-14 sm:size-19"
      fill="none"
      viewBox="0 0 96 96"
    >
      <path
        d="M41.4538 30.5454H32.7266V65.4545H41.4538V52.3636H54.5447V65.4545H63.272V52.3636H54.5447V43.6363H41.4538V30.5454Z"
        fill="currentColor"
      />
    </svg>
  );
}

function RailToggle({ collapsed }: { collapsed: boolean }) {
  const label = collapsed ? "Expand menu" : "Collapse menu";
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            aria-label={label}
            className="hidden md:inline-flex"
            onClick={toggleCollapsed}
            rounded
            size="icon"
            variant="outline"
          >
            {collapsed ? <ArrowRightFromLineIcon /> : <ArrowLeftFromLineIcon />}
          </Button>
        }
      />
      <TooltipContent side="bottom">{label}</TooltipContent>
    </Tooltip>
  );
}

function MobileNav({ name, nav }: { name: string; nav: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  return (
    <Drawer onOpenChange={setOpen} open={open} side="left">
      <DrawerTrigger
        render={
          <Button
            aria-label="Open menu"
            className="md:hidden"
            rounded
            size="icon"
            variant="outline"
          >
            <MenuIcon />
          </Button>
        }
      />
      <DrawerContent size="sm">
        <DrawerHeader className="h-19 items-center px-6 py-0">
          <DrawerTitle className={titleClass}>{name}</DrawerTitle>
        </DrawerHeader>
        <DrawerBody className="px-3 py-3">
          <RailContext
            value={{ collapsed: false, onNavigate: () => setOpen(false) }}
          >
            <nav aria-label="Main" className="flex flex-col gap-0.5">
              {nav}
            </nav>
          </RailContext>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

export type { AdminShellProps };
export { AdminShell, useRail };
