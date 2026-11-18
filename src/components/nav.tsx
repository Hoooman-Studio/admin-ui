import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from "@ui-sdk/react/collapsible";
import {
  mergeProps,
  type PartProps,
  renderElement,
} from "@ui-sdk/react/primitive";
import { ChevronDownIcon } from "lucide-react";
import * as React from "react";
import { cn } from "../lib/cn";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

interface RailState {
  collapsed: boolean;
  /** Closes the phone drawer once a nav item is pressed. */
  onNavigate?: () => void;
}

/** The rail the nav sits in. AdminShell and the phone menu provide it. */
const RailContext = React.createContext<RailState>({ collapsed: false });

function useRail() {
  return React.use(RailContext);
}

interface NavSectionProps {
  children: React.ReactNode;
  className?: string;
  /** Starts closed when false. A collapsed rail always shows its items. */
  defaultOpen?: boolean;
  title: string;
}

/** A group of nav items under a small heading that opens and closes it. */
function NavSection({
  title,
  defaultOpen = true,
  children,
  className,
}: NavSectionProps) {
  const { collapsed } = useRail();

  if (collapsed) {
    return (
      <div className={cn("au:flex au:flex-col au:gap-0.5", className)}>
        <div className="au:bg-alpha/10 au:mx-auto au:my-3 au:h-px au:w-7 au:shrink-0" />
        {children}
      </div>
    );
  }

  return (
    <Collapsible
      className={cn("au:flex au:flex-col", className)}
      defaultOpen={defaultOpen}
    >
      <CollapsibleTrigger className="au:group au:focus-visible:outline-accent au:mx-3 au:mt-3 au:flex au:items-center au:gap-3 au:rounded-md au:py-1.5 au:text-gray-500 au:hover:text-gray-950 au:focus-visible:outline-2">
        <span className="au:truncate au:py-0.5 au:text-sm au:leading-5 au:font-medium">
          {title}
        </span>
        <span className="au:bg-alpha/10 au:h-px au:flex-1" />
        <ChevronDownIcon className="au:ease-fluid au:size-4 au:shrink-0 au:transition-transform au:duration-250 au:group-data-open:rotate-180" />
      </CollapsibleTrigger>
      {/* The panel only clips: as a flex column its rows would shrink while its height animates. */}
      <CollapsiblePanel className="au:ease-fluid au:h-(--collapsible-panel-height) au:overflow-hidden au:transition-[height] au:duration-250 au:data-ending-style:h-0 au:data-starting-style:h-0">
        <div className="au:flex au:flex-col au:gap-0.5">{children}</div>
      </CollapsiblePanel>
    </Collapsible>
  );
}

/** The tooltip trigger's element when no `render` is given; it gets `href` from the item. */
const anchor = React.createElement("a");

type NavItemProps = Omit<PartProps<"a">, "children" | "className"> & {
  /** Shown alone, with the label as a tooltip, when the rail is collapsed. */
  icon: React.ReactNode;
  label: string;
  /** A count or a Badge at the end of the row. Hidden in the collapsed rail. */
  count?: React.ReactNode;
  /** The current page. */
  active?: boolean;
  className?: string;
};

/**
 * A nav link. Pass `href`, or your router's link as `render={<Link to="/admin/clients" />}`.
 * Mark the current page `active`.
 */
function NavItem({
  icon,
  label,
  count,
  active = false,
  className,
  render,
  ...props
}: NavItemProps) {
  const { collapsed, onNavigate } = useRail();

  const own = {
    "aria-current": active ? "page" : undefined,
    "data-active": active ? "" : undefined,
    onClick: onNavigate,
    className: cn(
      "au:touch-target au:ease-fluid au:hover:bg-alpha/3 au:focus-visible:outline-accent au:data-active:bg-alpha/5 au:flex au:w-full au:shrink-0 au:items-center au:gap-3 au:overflow-hidden au:rounded-xl au:py-2 au:text-left au:text-gray-600 au:transition-[background-color,color,padding] au:duration-250 au:hover:text-gray-950 au:focus-visible:outline-2 au:focus-visible:-outline-offset-2 au:data-active:text-gray-950",
      collapsed ? "au:px-2" : "au:px-3",
      className
    ),
    children: (
      <>
        <span className="au:flex au:size-7 au:shrink-0 au:items-center au:justify-center au:[&_svg]:size-5">
          {icon}
        </span>
        <span
          className={cn(
            "au:ease-fluid au:min-w-0 au:truncate au:text-lg au:font-medium au:transition-[opacity,width,flex-grow] au:duration-250",
            collapsed
              ? "au:w-0 au:flex-none au:opacity-0"
              : "au:flex-1 au:opacity-100"
          )}
        >
          {label}
        </span>
        {count !== undefined && !collapsed ? (
          <span className="au:tabular au:shrink-0 au:text-sm au:font-medium au:text-gray-500">
            {count}
          </span>
        ) : null}
      </>
    ),
  };

  const linkProps = mergeProps(own, props);
  if (!collapsed) {
    return renderElement("a", linkProps, render);
  }

  return (
    <Tooltip>
      <TooltipTrigger {...linkProps} render={render ?? anchor} />
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}

export type { NavItemProps, NavSectionProps };
export { NavItem, NavSection, RailContext };
