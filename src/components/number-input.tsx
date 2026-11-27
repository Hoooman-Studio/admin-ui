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
import { useMessages } from "./messages";
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
  "au:touch-target au:hover:bg-alpha/5 au:flex au:size-6 au:shrink-0 au:in-data-[slot=form-field-box]:size-5 au:items-center au:justify-center au:rounded-md au:text-gray-500 au:hover:text-gray-950 au:data-disabled:pointer-events-none au:data-disabled:opacity-40 au:[&_svg]:size-3.5";

/**
 * A number field with − and + buttons. Arrow keys step it too, and `format`
 * shows it as currency or percent. The value is a number, or null when empty.
 */
function NumberInput({
  className,
  placeholder,
  decrementLabel,
  incrementLabel,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  ...props
}: NumberInputProps) {
  const messages = useMessages();
  return (
    <NumberInputPart className={cn("au:w-full", className)} {...props}>
      <NumberInputGroup
        className={cn(
          controlBoxClass,
          "au:gap-1 au:pe-1 au:data-disabled:cursor-not-allowed"
        )}
      >
        <NumberInputControl
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
          className="au:text-input au:tabular au:h-full au:min-w-0 au:flex-1 au:bg-transparent au:outline-none au:placeholder:text-gray-500 au:disabled:cursor-not-allowed"
          placeholder={placeholder}
        />
        <NumberInputDecrement
          aria-label={decrementLabel ?? messages.decrease}
          className={stepClass}
        >
          <MinusIcon aria-hidden="true" />
        </NumberInputDecrement>
        <NumberInputIncrement
          aria-label={incrementLabel ?? messages.increase}
          className={stepClass}
        >
          <PlusIcon aria-hidden="true" />
        </NumberInputIncrement>
      </NumberInputGroup>
    </NumberInputPart>
  );
}

export type { NumberInputProps };
export { NumberInput };
