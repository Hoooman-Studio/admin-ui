import {
  RadioGroup as RadioGroupPart,
  RadioIndicator,
  Radio as RadioPart,
} from "@ui-sdk/react/radio";
import type * as React from "react";
import { cn } from "../lib/cn";
import { ChoiceField, type ChoiceFieldProps } from "./choice-field";

type RadioGroupProps<T extends string> = Omit<
  React.ComponentProps<typeof RadioGroupPart<T>>,
  "className"
> & { className?: string };

/** Name it with a Field's FieldLabel around it, or `aria-label`. Put RadioFields inside. */
function RadioGroup<T extends string = string>({
  className,
  ...props
}: RadioGroupProps<T>) {
  return (
    <RadioGroupPart<T>
      className={cn("flex flex-col gap-3", className)}
      {...props}
    />
  );
}

type RadioProps = Omit<
  React.ComponentProps<typeof RadioPart>,
  "className" | "children"
> & { className?: string };

function Radio({ className, ...props }: RadioProps) {
  return (
    <RadioPart
      className={cn(
        "border-alpha/10 bg-alpha/5 hover:bg-alpha/10 focus-visible:outline-accent data-checked:bg-accent data-checked:hover:bg-accent/90 flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors duration-100 focus-visible:outline-2 focus-visible:outline-offset-2 aria-invalid:border-red-500/70 data-checked:border-transparent data-disabled:cursor-not-allowed data-disabled:opacity-40",
        className
      )}
      {...props}
    >
      <RadioIndicator className="bg-accent-foreground size-2 rounded-full" />
    </RadioPart>
  );
}

type RadioFieldProps = Omit<RadioProps, "disabled"> &
  Omit<ChoiceFieldProps, "error">;

/** One option of a RadioGroup, with its label and an optional description. */
function RadioField({
  label,
  description,
  disabled,
  className,
  ...props
}: RadioFieldProps) {
  return (
    <ChoiceField
      className={className}
      control={<Radio {...props} />}
      controlSide="start"
      description={description}
      disabled={disabled}
      label={label}
    />
  );
}

export type { RadioFieldProps, RadioGroupProps, RadioProps };
export { Radio, RadioField, RadioGroup };
