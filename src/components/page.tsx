import { ArrowLeftIcon } from "lucide-react";
import type * as React from "react";
import { cn } from "../lib/cn";
import { Button } from "./button";

type PageHeaderProps = Omit<React.ComponentProps<"header">, "title"> & {
  title: React.ReactNode;
  /** Shown before the title, like "12 Listings". */
  count?: number;
  description?: React.ReactNode;
  /** A link back, like `<a href="/admin/listings" />` or your router's Link. Shows as an arrow button. */
  back?: React.ReactElement<Record<string, unknown>>;
  backLabel?: string;
  actions?: React.ReactNode;
};

/** The page's title bar, the same height as the shell's header. Stays on top while the page scrolls. */
function PageHeader({
  title,
  count,
  description,
  back,
  backLabel = "Back",
  actions,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "border-alpha/10 sticky top-0 z-10 flex h-19 shrink-0 items-center gap-4 border-b bg-gray-50 px-4 sm:px-6",
        className
      )}
      {...props}
    >
      {back ? (
        <Button
          aria-label={backLabel}
          className="touch-target"
          render={back}
          rounded
          size="icon"
          variant="outline"
        >
          <ArrowLeftIcon />
        </Button>
      ) : null}
      <div className="flex min-w-0 flex-1 flex-col">
        <h1 className="truncate py-1 text-lg leading-none font-semibold tracking-[-0.02em] text-gray-950 sm:text-2xl sm:leading-none">
          {count === undefined ? null : (
            <span className="tabular text-gray-500">{count} </span>
          )}
          {title}
        </h1>
        {description ? (
          <p className="truncate text-sm font-medium text-gray-500">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 items-center gap-3">{actions}</div>
      ) : null}
    </header>
  );
}

type PageToolbarProps = React.ComponentProps<"div"> & {
  actions?: React.ReactNode;
};

/** The bar under the PageHeader for search, filters and view switches; `actions` sit at the right. */
function PageToolbar({
  actions,
  children,
  className,
  ...props
}: PageToolbarProps) {
  return (
    <div
      className={cn(
        "border-alpha/10 flex min-h-14 flex-wrap items-center gap-3 border-b bg-gray-50 px-4 py-2 sm:min-h-19 sm:px-6",
        className
      )}
      {...props}
    >
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3">
        {children}
      </div>
      {actions ? (
        <div className="flex shrink-0 items-center gap-3">{actions}</div>
      ) : null}
    </div>
  );
}

const widths = {
  full: "",
  /** Forms and settings. */
  narrow: "mx-auto max-w-3xl",
};

type PageBodyProps = React.ComponentProps<"div"> & {
  width?: keyof typeof widths;
};

function PageBody({ width = "full", className, ...props }: PageBodyProps) {
  return (
    <div
      className={cn(
        "flex w-full flex-col gap-10 px-4 py-6 @md/page-content:p-6 @md/page-content:pb-16",
        widths[width],
        className
      )}
      {...props}
    />
  );
}

type PageSectionProps = Omit<React.ComponentProps<"section">, "title"> & {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
};

/** A titled part of a page, like "Recent bookings", with its actions beside the heading. */
function PageSection({
  title,
  description,
  actions,
  children,
  className,
  ...props
}: PageSectionProps) {
  return (
    <section className={cn("flex flex-col gap-4", className)} {...props}>
      <div className="flex items-end gap-4">
        <div className="flex min-w-0 flex-1 flex-col">
          <h2 className="text-lg leading-8 font-semibold text-gray-950">
            {title}
          </h2>
          {description ? (
            <p className="text-base leading-6 font-medium text-gray-600">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex shrink-0 items-center gap-3">{actions}</div>
        ) : null}
      </div>
      {children}
    </section>
  );
}

type DetailLayoutProps = React.ComponentProps<"div"> & {
  /** The side panel: key facts, status, related records. Moves under the main content on narrow pages. */
  side: React.ReactNode;
};

/** A record page: the main content beside a side panel. Put a PageBody in each. */
function DetailLayout({
  side,
  children,
  className,
  ...props
}: DetailLayoutProps) {
  return (
    <div
      className={cn(
        "flex flex-1 flex-col @4xl/page-content:flex-row",
        className
      )}
      {...props}
    >
      <div className="min-w-0 flex-1">{children}</div>
      <aside className="border-alpha/10 shrink-0 border-t @4xl/page-content:w-96 @4xl/page-content:border-t-0 @4xl/page-content:border-l">
        {side}
      </aside>
    </div>
  );
}

export type {
  DetailLayoutProps,
  PageBodyProps,
  PageHeaderProps,
  PageSectionProps,
  PageToolbarProps,
};
export { DetailLayout, PageBody, PageHeader, PageSection, PageToolbar };
