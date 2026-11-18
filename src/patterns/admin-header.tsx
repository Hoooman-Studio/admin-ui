import {
  ArrowLeftFromLineIcon,
  ArrowRightFromLineIcon,
  MenuIcon,
} from "lucide-react";
import * as React from "react";
import { Avatar } from "../components/avatar";
import { Button } from "../components/button";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../components/drawer";
import {
  Menu,
  MenuContent,
  MenuSeparator,
  MenuTrigger,
} from "../components/menu";
import { RailContext } from "../components/nav";
import { ThemeMenuItems } from "../components/theme";
import { Tooltip, TooltipContent, TooltipTrigger } from "../components/tooltip";
import { cn } from "../lib/cn";
import { toggleCollapsed, useShell } from "./admin-shell";

/** Each part is a cell; cells after the first get a hairline on their left. */
const cellClass =
  "au:border-alpha/10 au:flex au:shrink-0 au:border-l au:first:border-l-0";
const squareClass = "au:w-14 au:items-center au:justify-center au:sm:w-19";
const titleClass =
  "au:truncate au:py-1 au:text-2xl au:leading-none au:font-semibold au:tracking-[-0.02em] au:text-gray-950";
const focusClass =
  "au:focus-visible:outline-accent au:focus-visible:outline-2 au:focus-visible:-outline-offset-2";

/**
 * The header bar of AdminShell. Compose it from its parts:
 * `<AdminHeader><AdminHeaderAccount … /><AdminHeaderTitle>Porta Europa</AdminHeaderTitle><AdminHeaderStudioLink /></AdminHeader>`.
 */
function AdminHeader({ className, ...props }: React.ComponentProps<"header">) {
  return (
    <header
      className={cn(
        "au:border-alpha/10 au:flex au:h-19 au:shrink-0 au:border-b",
        className
      )}
      {...props}
    />
  );
}

interface AdminHeaderAccountProps {
  /** Menu items under the theme choice, like Profile and Sign out. */
  children?: React.ReactNode;
  email?: string;
  image?: string | null;
  name: string;
}

/** The signed-in user's avatar, opening the account menu with the theme choice and your items. */
function AdminHeaderAccount({
  name,
  email,
  image,
  children,
}: AdminHeaderAccountProps) {
  return (
    <div className={cn(cellClass, squareClass)}>
      <Menu>
        <MenuTrigger
          aria-label="Open account menu"
          className={cn(
            "au:touch-target au:hover:bg-alpha/5 au:flex au:size-full au:items-center au:justify-center",
            focusClass
          )}
        >
          <Avatar className="au:sm:size-9" name={name} src={image} />
        </MenuTrigger>
        <MenuContent align="start" className="au:min-w-60">
          <div className="au:flex au:flex-col au:px-2 au:py-1.5">
            <span className="au:truncate au:text-sm au:font-medium au:text-gray-950">
              {name}
            </span>
            {email ? (
              <span className="au:truncate au:text-xs au:text-gray-500">
                {email}
              </span>
            ) : null}
          </div>
          <MenuSeparator />
          <ThemeMenuItems />
          {children ? (
            <>
              <MenuSeparator />
              {children}
            </>
          ) : null}
        </MenuContent>
      </Menu>
    </div>
  );
}

/** The client's name, with the rail toggle before it, and on phones the button that opens the nav. Takes the free width. */
function AdminHeaderTitle({ children }: { children: React.ReactNode }) {
  const { collapsed, nav } = useShell();
  return (
    <div
      className={cn(
        cellClass,
        "au:min-w-0 au:flex-1 au:items-center au:gap-4 au:px-4 au:sm:px-6"
      )}
    >
      <MobileNav nav={nav} title={children} />
      <RailToggle collapsed={collapsed} />
      <span className={titleClass}>{children}</span>
    </div>
  );
}

/** A cell for your own controls, like search or notifications. */
function AdminHeaderActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        cellClass,
        "au:items-center au:gap-2 au:px-3 au:sm:px-6",
        className
      )}
      {...props}
    />
  );
}

/** The Hooman mark, linking back to Hooman Studio. */
function AdminHeaderStudioLink({
  href = "https://hooman.com/dashboard",
}: {
  href?: string;
}) {
  return (
    <a
      className={cn(
        cellClass,
        squareClass,
        "au:hover:bg-alpha/5 au:text-gray-950 au:transition-colors au:duration-100",
        focusClass
      )}
      href={href}
    >
      <svg
        aria-hidden="true"
        className="au:size-14 au:sm:size-19"
        fill="none"
        viewBox="0 0 96 96"
      >
        <path
          d="M41.4538 30.5454H32.7266V65.4545H41.4538V52.3636H54.5447V65.4545H63.272V52.3636H54.5447V43.6363H41.4538V30.5454Z"
          fill="currentColor"
        />
      </svg>
      <span className="au:sr-only">Open Hooman Studio</span>
    </a>
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
            className="au:hidden au:md:inline-flex"
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

function MobileNav({
  nav,
  title,
}: {
  nav: React.ReactNode;
  title: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const close = React.useCallback(() => setOpen(false), []);
  return (
    <Drawer onOpenChange={setOpen} open={open} side="left">
      <DrawerTrigger
        render={
          <Button
            aria-label="Open menu"
            className="au:md:hidden"
            rounded
            size="icon"
            variant="outline"
          >
            <MenuIcon />
          </Button>
        }
      />
      <DrawerContent size="sm">
        <DrawerHeader className="au:h-19 au:items-center au:px-6 au:py-0">
          <DrawerTitle className={titleClass}>{title}</DrawerTitle>
        </DrawerHeader>
        <DrawerBody className="au:px-3 au:py-3">
          <RailContext value={{ collapsed: false, onNavigate: close }}>
            <nav aria-label="Main" className="au:flex au:flex-col au:gap-0.5">
              {nav}
            </nav>
          </RailContext>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

export type { AdminHeaderAccountProps };
export {
  AdminHeader,
  AdminHeaderAccount,
  AdminHeaderActions,
  AdminHeaderStudioLink,
  AdminHeaderTitle,
};
