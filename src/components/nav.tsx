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
import { useRail } from "./admin-shell";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

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
      <div className={cn("flex flex-col gap-0.5", className)}>
        <div className="bg-alpha/10 mx-auto my-3 h-px w-7 shrink-0" />
        {children}
      </div>
    );
  }

  return (
    <Collapsible
      className={cn("flex flex-col", className)}
      defaultOpen={defaultOpen}
    >
      <CollapsibleTrigger className="group focus-visible:outline-accent mx-3 mt-3 flex items-center gap-3 rounded-md py-1.5 text-gray-500 hover:text-gray-950 focus-visible:outline-2">
        <span className="truncate py-0.5 text-sm leading-5 font-medium">
          {title}
        </span>
        <span className="bg-alpha/10 h-px flex-1" />
        <ChevronDownIcon className="ease-fluid size-4 shrink-0 transition-transform duration-250 group-data-open:rotate-180" />
      </CollapsibleTrigger>
      <CollapsiblePanel className="ease-fluid flex h-(--collapsible-panel-height) flex-col gap-0.5 overflow-hidden transition-[height] duration-250 data-ending-style:h-0 data-starting-style:h-0">
        {children}
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
      "touch-target ease-fluid hover:bg-alpha/3 focus-visible:outline-accent data-active:bg-alpha/5 flex w-full items-center gap-3 overflow-hidden rounded-xl py-2 text-left text-gray-600 transition-[background-color,color,padding] duration-250 hover:text-gray-950 focus-visible:outline-2 focus-visible:-outline-offset-2 data-active:text-gray-950",
      collapsed ? "px-2" : "px-3",
      className
    ),
    children: (
      <>
        <span className="flex size-7 shrink-0 items-center justify-center [&_svg]:size-5">
          {icon}
        </span>
        <span
          className={cn(
            "ease-fluid min-w-0 truncate text-lg font-medium transition-[opacity,width,flex-grow] duration-250",
            collapsed ? "w-0 flex-none opacity-0" : "flex-1 opacity-100"
          )}
        >
          {label}
        </span>
        {count !== undefined && !collapsed ? (
          <span className="tabular shrink-0 text-sm font-medium text-gray-500">
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
export { NavItem, NavSection };
