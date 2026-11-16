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
      className={cn("au:flex au:flex-col au:gap-3", className)}
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
        "au:border-alpha/10 au:bg-alpha/5 au:hover:bg-alpha/10 au:focus-visible:outline-accent au:data-checked:bg-accent au:data-checked:hover:bg-accent/90 au:flex au:size-5 au:shrink-0 au:items-center au:justify-center au:rounded-full au:border au:transition-colors au:duration-100 au:focus-visible:outline-2 au:focus-visible:outline-offset-2 au:aria-invalid:border-red-500/70 au:data-checked:border-transparent au:data-disabled:cursor-not-allowed au:data-disabled:opacity-40",
        className
      )}
      {...props}
    >
      <RadioIndicator className="au:bg-accent-foreground au:size-2 au:rounded-full" />
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
