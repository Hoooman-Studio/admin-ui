import type * as React from "react";
import { cn } from "../lib/cn";

const variants = {
  default: "gap-6 p-6",
  /** Rows split by hairlines, each padded: settings lists, recent items. */
  list: "divide-alpha/10 gap-0 divide-y overflow-hidden *:px-6 *:py-4",
};

type CardProps = React.ComponentProps<"section"> & {
  variant?: keyof typeof variants;
};

function Card({ variant = "default", className, ...props }: CardProps) {
  return (
    <section
      className={cn(
        "border-alpha/10 shadow-card flex min-w-0 flex-col rounded-3xl border bg-gray-50",
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
    <div className={cn("flex items-start gap-4", className)} {...props}>
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
      {actions ? (
        <div className="flex shrink-0 items-center gap-3">{actions}</div>
      ) : null}
    </div>
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      className={cn("text-lg leading-8 font-semibold text-gray-950", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      className={cn("text-base leading-6 font-medium text-gray-600", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-wrap items-center justify-end gap-3", className)}
      {...props}
    />
  );
}

export type { CardHeaderProps, CardProps };
export { Card, CardDescription, CardFooter, CardHeader, CardTitle };
