import {
  NumberInputControl,
  NumberInputDecrement,
  NumberInputGroup,
  NumberInputIncrement,
  NumberInput as NumberInputPart,
} from "@ui-sdk/react/number-input";
import { MinusIcon, PlusIcon } from "lucide-react";
import type * as React from "react";
import { cn } from "../lib/cn";
import { controlBoxClass } from "./select";

type NumberInputProps = Omit<
  React.ComponentProps<typeof NumberInputPart>,
  "className" | "children"
> & {
  className?: string;
  placeholder?: string;
  /** Names the step buttons. */
  decrementLabel?: string;
  incrementLabel?: string;
};

const stepClass =
  "touch-target hover:bg-alpha/5 flex size-6 shrink-0 in-data-[slot=form-field-box]:size-5 items-center justify-center rounded-md text-gray-500 hover:text-gray-950 data-disabled:pointer-events-none data-disabled:opacity-40 [&_svg]:size-3.5";

/**
 * A number field with − and + buttons. Arrow keys step it too, and `format`
 * shows it as currency or percent. The value is a number, or null when empty.
 */
function NumberInput({
  className,
  placeholder,
  decrementLabel = "Decrease",
  incrementLabel = "Increase",
  ...props
}: NumberInputProps) {
  return (
    <NumberInputPart className={cn("w-full", className)} {...props}>
      <NumberInputGroup
        className={cn(
          controlBoxClass,
          "gap-1 pe-1 data-disabled:cursor-not-allowed"
        )}
      >
        <NumberInputControl
          className="text-input tabular h-full min-w-0 flex-1 bg-transparent outline-none placeholder:text-gray-500 disabled:cursor-not-allowed"
          placeholder={placeholder}
        />
        <NumberInputDecrement aria-label={decrementLabel} className={stepClass}>
          <MinusIcon aria-hidden="true" />
        </NumberInputDecrement>
        <NumberInputIncrement aria-label={incrementLabel} className={stepClass}>
          <PlusIcon aria-hidden="true" />
        </NumberInputIncrement>
      </NumberInputGroup>
    </NumberInputPart>
  );
}

export type { NumberInputProps };
export { NumberInput };
