import { Switch as SwitchPart, SwitchThumb } from "@ui-sdk/react/switch";
import type * as React from "react";
import { cn } from "../lib/cn";
import { ChoiceField, type ChoiceFieldProps } from "./choice-field";

type SwitchProps = Omit<
  React.ComponentProps<typeof SwitchPart>,
  "className" | "children"
> & { className?: string };

/** An on/off switch on its own. Name it with `aria-label`, or use SwitchField for a visible label. */
function Switch({ className, ...props }: SwitchProps) {
  return (
    <SwitchPart
      className={cn(
        "group/switch bg-alpha/10 focus-visible:outline-accent inline-flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 data-checked:bg-gray-950 data-disabled:cursor-not-allowed data-disabled:opacity-40 data-invalid:ring-2 data-invalid:ring-red-500/70",
        className
      )}
      {...props}
    >
      <SwitchThumb className="ease-fluid pointer-events-none block size-4 rounded-full bg-gray-50 shadow-sm transition-transform duration-150 data-checked:translate-x-4 rtl:data-checked:-translate-x-4" />
    </SwitchPart>
  );
}

type SwitchFieldProps = Omit<SwitchProps, "disabled"> & ChoiceFieldProps;

/** A settings row: label and optional description, with the switch at the end. */
function SwitchField({
  label,
  description,
  error,
  disabled,
  className,
  ...props
}: SwitchFieldProps) {
  return (
    <ChoiceField
      className={className}
      control={<Switch {...props} />}
      controlSide="end"
      description={description}
      disabled={disabled}
      error={error}
      label={label}
    />
  );
}

export type { SwitchFieldProps, SwitchProps };
export { Switch, SwitchField };
