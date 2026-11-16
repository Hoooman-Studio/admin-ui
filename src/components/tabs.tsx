import {
  TabsIndicator,
  TabsList as TabsListPart,
  TabsPanel as TabsPanelPart,
  Tabs as TabsPart,
  TabsTab as TabsTabPart,
} from "@ui-sdk/react/tabs";
import type * as React from "react";
import { cn } from "../lib/cn";
import type { WithClass } from "../lib/types";

function Tabs({
  className,
  ...props
}: WithClass<React.ComponentProps<typeof TabsPart>>) {
  return (
    <TabsPart
      className={cn("au:flex au:flex-col au:gap-4", className)}
      {...props}
    />
  );
}

/** The row of tabs, with a line under the selected one. Give it an `aria-label`. */
function TabsList({
  className,
  children,
  ...props
}: Omit<WithClass<React.ComponentProps<typeof TabsListPart>>, "children"> & {
  children?: React.ReactNode;
}) {
  return (
    <TabsListPart
      className={cn(
        "au:border-alpha/10 au:scrollbar-hidden au:relative au:flex au:gap-4 au:overflow-x-auto au:border-b",
        className
      )}
      {...props}
    >
      {children}
      <TabsIndicator className="au:ease-fluid au:absolute au:bottom-0 au:left-(--active-tab-left) au:h-0.5 au:w-(--active-tab-width) au:bg-gray-950 au:transition-[left,width] au:duration-200 au:motion-reduce:transition-none" />
    </TabsListPart>
  );
}

function TabsTab({
  className,
  ...props
}: WithClass<React.ComponentProps<typeof TabsTabPart>>) {
  return (
    <TabsTabPart
      className={cn(
        "au:focus-visible:outline-accent au:inline-flex au:h-10 au:shrink-0 au:items-center au:gap-1.5 au:rounded-sm au:text-sm au:font-medium au:whitespace-nowrap au:text-gray-600 au:transition-colors au:duration-100 au:hover:text-gray-950 au:focus-visible:outline-2 au:focus-visible:-outline-offset-2 au:data-disabled:opacity-40 au:data-disabled:hover:text-gray-600 au:data-selected:text-gray-950 au:[&_svg]:size-4",
        className
      )}
      {...props}
    />
  );
}

function TabsPanel({
  className,
  ...props
}: WithClass<React.ComponentProps<typeof TabsPanelPart>>) {
  return (
    <TabsPanelPart
      className={cn(
        "au:focus-visible:outline-accent au:rounded-sm au:focus-visible:outline-2 au:focus-visible:outline-offset-2",
        className
      )}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsPanel, TabsTab };
