import { Button as ButtonPart } from "@ui-sdk/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "../lib/cn";

const disabledLook =
  "data-disabled:opacity-40 data-disabled:bg-alpha/5 data-disabled:text-gray-950 data-disabled:border-transparent";

const buttonVariants = cva(
  `focus-visible:outline-accent relative inline-flex shrink-0 items-center justify-center font-medium whitespace-nowrap transition-colors duration-100 select-none focus-visible:outline-2 focus-visible:outline-offset-2 data-pending:cursor-progress [&_svg]:pointer-events-none [&_svg]:shrink-0 ${disabledLook}`,
  {
    variants: {
      variant: {
        primary: "bg-gray-950 text-gray-50 hover:bg-gray-900",
        accent: "bg-accent text-accent-foreground hover:bg-accent/90",
        subtle: "bg-alpha/5 hover:bg-alpha/10 text-gray-950",
        outline:
          "border-alpha/10 hover:bg-alpha/5 border bg-gray-50 text-gray-950",
        ghost: "hover:bg-alpha/5 bg-transparent text-gray-950",
        danger: "bg-red-500 text-gray-50 hover:bg-red-600",
        "danger-subtle": "bg-red-500/10 text-red-500 hover:bg-red-500/20",
      },
      size: {
        xs: "h-6 gap-0.5 rounded-md px-1 text-sm [&_svg]:size-4",
        sm: "h-7 gap-1 rounded-lg px-2 text-sm [&_svg]:size-4",
        md: "h-8 gap-1 rounded-lg px-3 text-sm [&_svg]:size-4",
        lg: "h-10 gap-2 rounded-[10px] px-4 text-base font-semibold [&_svg]:size-4",
        "icon-xs": "touch-target size-6 rounded-md [&_svg]:size-3.5",
        "icon-sm": "touch-target size-7 rounded-lg [&_svg]:size-3.5",
        icon: "touch-target size-8 rounded-lg [&_svg]:size-4",
        "icon-lg": "size-10 rounded-[10px] [&_svg]:size-4",
      },
      rounded: { true: "rounded-full", false: "" },
    },
    defaultVariants: { variant: "primary", size: "md", rounded: false },
  }
);

type ButtonVariants = VariantProps<typeof buttonVariants>;
type ButtonSize = NonNullable<ButtonVariants["size"]>;
type IconSize = Extract<ButtonSize, `icon${string}`>;

type BaseProps = Omit<React.ComponentProps<typeof ButtonPart>, "className"> &
  Omit<ButtonVariants, "size"> & { className?: string };

/** Icon-only buttons have no text, so the type requires an `aria-label`. */
type ButtonProps =
  | (BaseProps & { size?: Exclude<ButtonSize, IconSize> })
  | (BaseProps & { size: IconSize; "aria-label": string });

/**
 * A button, or a link through `render={<a href="…" />}`.
 * Return a Promise from `onClick` and it shows as pending until it settles.
 */
function Button({ className, variant, size, rounded, ...props }: ButtonProps) {
  return (
    <ButtonPart
      className={cn(buttonVariants({ variant, size, rounded }), className)}
      {...props}
    />
  );
}

export type { ButtonProps };
export { Button, buttonVariants };
