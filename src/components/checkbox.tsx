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
        "border-alpha/10 bg-alpha/5 hover:bg-alpha/10 focus-visible:outline-accent data-checked:bg-accent data-checked:text-accent-foreground data-checked:hover:bg-accent/90 flex size-5 shrink-0 items-center justify-center rounded-md border text-gray-950 transition-colors duration-100 focus-visible:outline-2 focus-visible:outline-offset-2 aria-invalid:border-red-500/70 data-checked:border-transparent data-disabled:cursor-not-allowed data-disabled:opacity-40",
        className
      )}
      {...props}
    >
      <CheckboxIndicator className="flex items-center justify-center [&_svg]:size-3.5 [&_svg]:stroke-3">
        <CheckIcon
          aria-hidden="true"
          className="in-data-indeterminate:hidden"
        />
        <MinusIcon
          aria-hidden="true"
          className="hidden in-data-indeterminate:block"
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
      className={cn("flex flex-col gap-3", className)}
      {...props}
    />
  );
}

export type { CheckboxFieldProps, CheckboxProps };
export { Checkbox, CheckboxField, CheckboxGroup };
