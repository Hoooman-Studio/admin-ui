import type * as React from "react";
import { cn } from "../lib/cn";

const variants = {
  default: "au:gap-6 au:p-6",
  /** Rows split by hairlines, each padded: settings lists, recent items. */
  list: "au:gap-0 au:[&>*+*]:border-t au:[&>*+*]:border-alpha/10 au:overflow-hidden au:*:px-6 au:*:py-4",
  /** No padding, for content that brings its own: a List of ListRows, a DataTable. */
  flush: "au:gap-0 au:overflow-hidden",
};

type CardProps = React.ComponentProps<"section"> & {
  variant?: keyof typeof variants;
};

function Card({ variant = "default", className, ...props }: CardProps) {
  return (
    <section
      className={cn(
        "au:border-alpha/10 au:shadow-card au:flex au:min-w-0 au:flex-col au:rounded-3xl au:border au:bg-gray-50",
        variants[variant],
        className
      )}
      data-variant={variant}
      {...props}
    />
  );
}

type CardHeaderProps = React.ComponentProps<"div"> & {
  actions?: React.ReactNode;
};

/** A CardTitle and CardDescription, with `actions` at the right. */
function CardHeader({
  actions,
  children,
  className,
  ...props
}: CardHeaderProps) {
  return (
    <div
      className={cn("au:flex au:items-start au:gap-4", className)}
      {...props}
    >
      <div className="au:flex au:min-w-0 au:flex-1 au:flex-col">{children}</div>
      {actions ? (
        <div className="au:flex au:shrink-0 au:items-center au:gap-3">
          {actions}
        </div>
      ) : null}
    </div>
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      className={cn(
        "au:text-lg au:leading-8 au:font-semibold au:text-gray-950",
        className
      )}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "au:text-base au:leading-6 au:font-medium au:text-gray-600",
        className
      )}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "au:flex au:flex-wrap au:items-center au:justify-end au:gap-3",
        className
      )}
      {...props}
    />
  );
}

export type { CardHeaderProps, CardProps };
export { Card, CardDescription, CardFooter, CardHeader, CardTitle };
