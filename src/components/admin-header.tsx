import {
  ArrowLeftFromLineIcon,
  ArrowRightFromLineIcon,
  MenuIcon,
} from "lucide-react";
import * as React from "react";
import { cn } from "../lib/cn";
import { RailContext, toggleCollapsed, useShell } from "./admin-shell";
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
import { ThemeMenuItems } from "./theme";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

/** Each part is a cell; cells after the first get a hairline on their left. */
const cellClass = "border-alpha/10 flex shrink-0 border-l first:border-l-0";
const squareClass = "w-14 items-center justify-center sm:w-19";
const titleClass =
  "truncate py-1 text-2xl leading-none font-semibold tracking-[-0.02em] text-gray-950";
const focusClass =
  "focus-visible:outline-accent focus-visible:outline-2 focus-visible:-outline-offset-2";

/**
 * The header bar of AdminShell. Compose it from its parts:
 * `<AdminHeader><AdminHeaderAccount … /><AdminHeaderTitle>Porta Europa</AdminHeaderTitle><AdminHeaderStudioLink /></AdminHeader>`.
 */
function AdminHeader({ className, ...props }: React.ComponentProps<"header">) {
  return (
    <header
      className={cn("border-alpha/10 flex h-19 shrink-0 border-b", className)}
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
            "touch-target hover:bg-alpha/5 flex size-full items-center justify-center",
            focusClass
          )}
        >
          <Avatar className="sm:size-9" name={name} src={image} />
        </MenuTrigger>
        <MenuContent align="start" className="min-w-60">
          <div className="flex flex-col px-2 py-1.5">
            <span className="truncate text-sm font-medium text-gray-950">
              {name}
            </span>
            {email ? (
              <span className="truncate text-xs text-gray-500">{email}</span>
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
        "min-w-0 flex-1 items-center gap-4 px-4 sm:px-6"
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
      className={cn(cellClass, "items-center gap-2 px-4 sm:px-6", className)}
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
        "hover:bg-alpha/5 text-gray-950 transition-colors duration-100",
        focusClass
      )}
      href={href}
    >
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
      <span className="sr-only">Open Hooman Studio</span>
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
          <DrawerTitle className={titleClass}>{title}</DrawerTitle>
        </DrawerHeader>
        <DrawerBody className="px-3 py-3">
          <RailContext value={{ collapsed: false, onNavigate: close }}>
            <nav aria-label="Main" className="flex flex-col gap-0.5">
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
