import {
  CheckboxGroup as CheckboxGroupPart,
  CheckboxIndicator,
  Checkbox as CheckboxPart,
} from "@ui-sdk/react/checkbox";
import { CheckIcon, MinusIcon } from "lucide-react";
import type * as React from "react";
import { cn } from "../lib/cn";
import { ChoiceField, type ChoiceFieldProps } from "./choice-field";

type CheckboxProps = Omit<
  React.ComponentProps<typeof CheckboxPart>,
  "className" | "children"
> & { className?: string };

/** A checkbox on its own. Name it with `aria-label`, or use CheckboxField for a visible label. */
function Checkbox({ className, ...props }: CheckboxProps) {
  return (
    <CheckboxPart
      className={cn(
        "au:border-alpha/10 au:bg-alpha/5 au:hover:bg-alpha/10 au:focus-visible:outline-accent au:data-checked:bg-accent au:data-checked:text-accent-foreground au:data-checked:hover:bg-accent/90 au:flex au:size-5 au:shrink-0 au:items-center au:justify-center au:rounded-md au:border au:text-gray-950 au:transition-colors au:duration-100 au:focus-visible:outline-2 au:focus-visible:outline-offset-2 au:aria-invalid:border-red-500/70 au:data-checked:border-transparent au:data-disabled:cursor-not-allowed au:data-disabled:opacity-40",
        className
      )}
      {...props}
    >
      <CheckboxIndicator className="au:flex au:items-center au:justify-center au:[&_svg]:size-3.5 au:[&_svg]:stroke-3">
        <CheckIcon
          aria-hidden="true"
          className="au:in-data-indeterminate:hidden"
        />
        <MinusIcon
          aria-hidden="true"
          className="au:hidden au:in-data-indeterminate:block"
        />
      </CheckboxIndicator>
    </CheckboxPart>
  );
}

type CheckboxFieldProps = Omit<CheckboxProps, "disabled"> & ChoiceFieldProps;

/** A checkbox with its label, and an optional description, to the right of it. */
function CheckboxField({
  label,
  description,
  error,
  disabled,
  className,
  ...props
}: CheckboxFieldProps) {
  return (
    <ChoiceField
      className={className}
      control={<Checkbox {...props} />}
      controlSide="start"
      description={description}
      disabled={disabled}
      error={error}
      label={label}
    />
  );
}

/** Keeps the checked values of the CheckboxFields inside it in one array. */
function CheckboxGroup<T extends string = string>({
  className,
  ...props
}: Omit<React.ComponentProps<typeof CheckboxGroupPart<T>>, "className"> & {
  className?: string;
}) {
  return (
    <CheckboxGroupPart<T>
      className={cn("au:flex au:flex-col au:gap-3", className)}
      {...props}
    />
  );
}

export type { CheckboxFieldProps, CheckboxProps };
export { Checkbox, CheckboxField, CheckboxGroup };
