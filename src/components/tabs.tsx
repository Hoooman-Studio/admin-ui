import {
  TabsIndicator,
  TabsList as TabsListPart,
  TabsPanel as TabsPanelPart,
  Tabs as TabsPart,
  TabsTab as TabsTabPart,
} from "@ui-sdk/react/tabs";
import type * as React from "react";
import { cn } from "../lib/cn";

type WithClass<T> = Omit<T, "className"> & { className?: string };

function Tabs({
  className,
  ...props
}: WithClass<React.ComponentProps<typeof TabsPart>>) {
  return (
    <TabsPart className={cn("flex flex-col gap-4", className)} {...props} />
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
        "border-alpha/10 scrollbar-hidden relative flex gap-4 overflow-x-auto border-b",
        className
      )}
      {...props}
    >
      {children}
      <TabsIndicator className="ease-fluid absolute bottom-0 left-(--active-tab-left) h-0.5 w-(--active-tab-width) bg-gray-950 transition-[left,width] duration-200 motion-reduce:transition-none" />
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
        "focus-visible:outline-accent inline-flex h-10 shrink-0 items-center gap-1.5 rounded-sm text-sm font-medium whitespace-nowrap text-gray-600 transition-colors duration-100 hover:text-gray-950 focus-visible:outline-2 focus-visible:-outline-offset-2 data-disabled:opacity-40 data-disabled:hover:text-gray-600 data-selected:text-gray-950 [&_svg]:size-4",
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
        "focus-visible:outline-accent rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2",
        className
      )}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsPanel, TabsTab };
