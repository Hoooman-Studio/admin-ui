import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "../lib/cn";

const badgeVariants = cva(
  "inline-flex h-6 shrink-0 items-center gap-1.5 rounded-md px-2 text-xs font-medium whitespace-nowrap [&_svg]:size-3.5 [&_svg]:shrink-0",
  {
    variants: {
      tone: {
        neutral: "bg-alpha/5 text-gray-950",
        accent: "bg-accent/10 text-accent",
        success: "bg-green-500/10 text-green-600 dark:text-green-500",
        warning: "bg-orange-500/10 text-orange-600 dark:text-orange-500",
        danger: "bg-red-500/10 text-red-600 dark:text-red-500",
        info: "bg-blue-500/10 text-blue-600 dark:text-blue-500",
      },
    },
    defaultVariants: { tone: "neutral" },
  }
);

type BadgeProps = React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    /** A small dot before the text, for statuses like "Live". */
    dot?: boolean;
  };

/** A short label, like a status in a list: `<Badge tone="success" dot>Published</Badge>`. */
function Badge({ className, tone, dot, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ tone }), className)} {...props}>
      {dot ? (
        <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      ) : null}
      {children}
    </span>
  );
}

export type { BadgeProps };
export { Badge };
