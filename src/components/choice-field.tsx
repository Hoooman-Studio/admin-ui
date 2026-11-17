import type * as React from "react";
import { cn } from "../lib/cn";
import { Field, FieldDescription, FieldError, FieldLabel } from "./field";

interface ChoiceFieldProps {
  className?: string;
  description?: React.ReactNode;
  disabled?: boolean;
  /** An error from your server or form library. Native constraint errors show on their own. */
  error?: string | null;
  label: React.ReactNode;
}

/** A checkbox, switch or radio with its label and description beside it. */
function ChoiceField({
  control,
  controlSide,
  label,
  description,
  error,
  disabled,
  className,
}: ChoiceFieldProps & {
  control: React.ReactNode;
  controlSide: "start" | "end";
}) {
  return (
    <Field
      className={cn(
        "au:flex-row au:items-start au:gap-3",
        controlSide === "end" && "au:justify-between",
        className
      )}
      disabled={disabled}
      invalid={error ? true : undefined}
    >
      {controlSide === "start" ? control : null}
      <div className="au:flex au:min-w-0 au:flex-col au:gap-0.5 au:pt-px">
        <FieldLabel className="au:px-0 au:text-sm au:font-medium au:text-gray-950 au:data-disabled:opacity-40 au:data-invalid:text-gray-950">
          {label}
        </FieldLabel>
        {description ? (
          <FieldDescription className="au:px-0 au:data-disabled:opacity-40">
            {description}
          </FieldDescription>
        ) : null}
        {error ? (
          <FieldError className="au:px-0" match>
            {error}
          </FieldError>
        ) : (
          <FieldError className="au:px-0" />
        )}
      </div>
      {controlSide === "end" ? control : null}
    </Field>
  );
}

export type { ChoiceFieldProps };
export { ChoiceField };
