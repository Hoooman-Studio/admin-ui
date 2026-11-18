import { ArrowLeftIcon } from "lucide-react";
import type * as React from "react";
import { Button } from "../components/button";
import { cn } from "../lib/cn";

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
        "au:border-alpha/10 au:sticky au:top-0 au:z-10 au:flex au:min-h-19 au:shrink-0 au:flex-wrap au:items-center au:gap-x-4 au:gap-y-2 au:border-b au:bg-gray-50 au:px-4 au:py-3 au:sm:px-6",
        className
      )}
      {...props}
    >
      {back ? (
        <Button
          aria-label={backLabel}
          className="au:touch-target"
          render={back}
          rounded
          size="icon"
          variant="outline"
        >
          <ArrowLeftIcon />
        </Button>
      ) : null}
      <div className="au:flex au:min-w-48 au:flex-1 au:flex-col">
        <h1 className="au:truncate au:py-1 au:text-lg au:leading-none au:font-semibold au:tracking-[-0.02em] au:text-gray-950 au:sm:text-2xl au:sm:leading-none">
          {count === undefined ? null : (
            <span className="au:tabular au:text-gray-500">{count} </span>
          )}
          {title}
        </h1>
        {description ? (
          <p className="au:text-sm au:font-medium au:text-gray-500 au:sm:truncate">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="au:flex au:flex-wrap au:items-center au:gap-3">
          {actions}
        </div>
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
        "au:border-alpha/10 au:flex au:min-h-14 au:shrink-0 au:flex-wrap au:items-center au:gap-3 au:border-b au:bg-gray-50 au:px-4 au:py-2 au:sm:min-h-19 au:sm:px-6",
        className
      )}
      {...props}
    >
      <div className="au:flex au:min-w-0 au:flex-1 au:flex-wrap au:items-center au:gap-3">
        {children}
      </div>
      {actions ? (
        <div className="au:flex au:shrink-0 au:items-center au:gap-3">
          {actions}
        </div>
      ) : null}
    </div>
  );
}

const widths = {
  full: "",
  /** Forms and settings. */
  narrow: "au:mx-auto au:max-w-3xl",
};

type PageBodyProps = React.ComponentProps<"div"> & {
  width?: keyof typeof widths;
};

function PageBody({ width = "full", className, ...props }: PageBodyProps) {
  return (
    <div
      className={cn(
        "au:flex au:w-full au:flex-col au:gap-10 au:px-4 au:py-6 au:@md/page-content:p-6 au:@md/page-content:pb-16",
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
    <section
      className={cn("au:flex au:flex-col au:gap-4", className)}
      {...props}
    >
      <div className="au:flex au:flex-wrap au:items-end au:gap-x-4 au:gap-y-3">
        <div className="au:flex au:min-w-48 au:flex-1 au:flex-col">
          <h2 className="au:text-lg au:leading-8 au:font-semibold au:text-gray-950">
            {title}
          </h2>
          {description ? (
            <p className="au:text-base au:leading-6 au:font-medium au:text-gray-600">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? (
          <div className="au:flex au:flex-wrap au:items-center au:gap-3">
            {actions}
          </div>
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
        "au:flex au:flex-1 au:flex-col au:@4xl/page-content:flex-row",
        className
      )}
      {...props}
    >
      <div className="au:min-w-0 au:flex-1">{children}</div>
      <aside className="au:border-alpha/10 au:shrink-0 au:border-t au:@4xl/page-content:w-96 au:@4xl/page-content:border-t-0 au:@4xl/page-content:border-l">
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
