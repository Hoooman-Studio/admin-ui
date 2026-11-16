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
        "au:group/switch au:bg-alpha/10 au:focus-visible:outline-accent au:inline-flex au:h-5 au:w-9 au:shrink-0 au:items-center au:rounded-full au:p-0.5 au:transition-colors au:duration-150 au:focus-visible:outline-2 au:focus-visible:outline-offset-2 au:data-checked:bg-gray-950 au:data-disabled:cursor-not-allowed au:data-disabled:opacity-40 au:data-invalid:ring-2 au:data-invalid:ring-red-500/70",
        className
      )}
      {...props}
    >
      <SwitchThumb className="au:ease-fluid au:pointer-events-none au:block au:size-4 au:rounded-full au:bg-gray-50 au:shadow-sm au:transition-transform au:duration-150 au:data-checked:translate-x-4 au:rtl:data-checked:-translate-x-4" />
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
