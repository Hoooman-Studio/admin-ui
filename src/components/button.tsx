import { Button as ButtonPart, type ButtonState } from "@ui-sdk/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "../lib/cn";
import { Loader } from "./loader";

const disabledLook =
  "au:data-disabled:opacity-40 au:data-disabled:bg-alpha/5 au:data-disabled:text-gray-950 au:data-disabled:border-transparent";

const pendingLook =
  "au:data-pending:cursor-progress au:data-pending:bg-alpha/2 au:data-pending:text-gray-950 au:data-pending:border-transparent au:data-pending:[-webkit-text-fill-color:transparent] au:data-pending:*:not-data-[slot=button-loader]:opacity-0 au:data-pending:[&>[data-slot=button-loader]]:flex";

const buttonVariants = cva(
  `au:focus-visible:outline-accent au:relative au:inline-flex au:shrink-0 au:items-center au:justify-center au:font-medium au:whitespace-nowrap au:transition-colors au:duration-100 au:select-none au:focus-visible:outline-2 au:focus-visible:outline-offset-2 au:[&_svg]:pointer-events-none au:[&_svg]:shrink-0 ${pendingLook} ${disabledLook}`,
  {
    variants: {
      variant: {
        primary: "au:bg-gray-950 au:text-gray-50 au:hover:bg-gray-900",
        accent: "au:bg-accent au:text-accent-foreground au:hover:bg-accent/90",
        subtle: "au:bg-alpha/5 au:hover:bg-alpha/10 au:text-gray-950",
        // The hover tint sits on the button's own surface, so it stays readable on a site page in another theme.
        outline:
          "au:border-alpha/10 au:hover:bg-[color-mix(in_srgb,var(--au-alpha)_5%,var(--au-gray-50))] au:border au:bg-gray-50 au:text-gray-950",
        ghost: "au:hover:bg-alpha/5 au:bg-transparent au:text-gray-950",
        danger: "au:bg-red-500 au:text-gray-50 au:hover:bg-red-600",
        "danger-subtle":
          "au:bg-red-500/10 au:text-red-500 au:hover:bg-red-500/20",
      },
      size: {
        xs: "au:h-6 au:gap-0.5 au:rounded-md au:px-1 au:text-sm au:[&_svg]:size-4",
        sm: "au:h-7 au:gap-1 au:rounded-lg au:px-2 au:text-sm au:[&_svg]:size-4",
        md: "au:h-8 au:gap-1 au:rounded-lg au:px-3 au:text-sm au:[&_svg]:size-4",
        lg: "au:h-10 au:gap-2 au:rounded-[10px] au:px-4 au:text-base au:font-semibold au:[&_svg]:size-4",
        "icon-xs":
          "au:touch-target au:size-6 au:rounded-md au:[&_svg]:size-3.5",
        "icon-sm":
          "au:touch-target au:size-7 au:rounded-lg au:[&_svg]:size-3.5",
        icon: "au:touch-target au:size-8 au:rounded-lg au:[&_svg]:size-4",
        "icon-lg": "au:size-10 au:rounded-[10px] au:[&_svg]:size-4",
      },
      rounded: { true: "au:rounded-full", false: "" },
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
function Button({
  className,
  variant,
  size,
  rounded,
  children,
  ...props
}: ButtonProps) {
  const small = size === "icon-xs" || size === "icon-sm";
  const content = (state: ButtonState) =>
    typeof children === "function" ? children(state) : children;
  return (
    <ButtonPart
      className={cn(buttonVariants({ variant, size, rounded }), className)}
      {...props}
    >
      {(state) => (
        <>
          {content(state)}
          <span
            aria-hidden="true"
            className="au:absolute au:inset-0 au:hidden au:items-center au:justify-center"
            data-slot="button-loader"
          >
            <Loader
              className={cn(
                "au:[&>span]:bg-current",
                small && "au:gap-0.5 au:[&>span]:size-1"
              )}
              size={size === "lg" || size === "icon-lg" ? "md" : "sm"}
            />
          </span>
        </>
      )}
    </ButtonPart>
  );
}

export type { ButtonProps };
export { Button, buttonVariants };
