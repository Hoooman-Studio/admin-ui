import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "../lib/cn";

const badgeVariants = cva(
  "au:inline-flex au:h-6 au:shrink-0 au:items-center au:gap-1.5 au:rounded-md au:px-2 au:text-xs au:font-medium au:whitespace-nowrap au:[&_svg]:size-3.5 au:[&_svg]:shrink-0",
  {
    variants: {
      tone: {
        neutral: "au:bg-alpha/5 au:text-gray-950",
        accent: "au:bg-accent/10 au:text-accent",
        success: "au:bg-green-500/10 au:text-green-600 au:dark:text-green-500",
        warning:
          "au:bg-orange-500/10 au:text-orange-600 au:dark:text-orange-500",
        danger: "au:bg-red-500/10 au:text-red-600 au:dark:text-red-500",
        info: "au:bg-blue-500/10 au:text-blue-600 au:dark:text-blue-500",
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
        <span
          aria-hidden="true"
          className="au:size-1.5 au:rounded-full au:bg-current"
        />
      ) : null}
      {children}
    </span>
  );
}

export type { BadgeProps };
export { Badge };
