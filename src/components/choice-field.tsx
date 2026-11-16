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
        "flex-row items-start gap-3",
        controlSide === "end" && "justify-between",
        className
      )}
      disabled={disabled}
      invalid={error ? true : undefined}
    >
      {controlSide === "start" ? control : null}
      <div className="flex min-w-0 flex-col gap-0.5 pt-px">
        <FieldLabel className="px-0 text-sm font-medium text-gray-950 data-disabled:opacity-40 data-invalid:text-gray-950">
          {label}
        </FieldLabel>
        {description ? (
          <FieldDescription className="px-0 data-disabled:opacity-40">
            {description}
          </FieldDescription>
        ) : null}
        {error ? (
          <FieldError className="px-0" match>
            {error}
          </FieldError>
        ) : (
          <FieldError className="px-0" />
        )}
      </div>
      {controlSide === "end" ? control : null}
    </Field>
  );
}

export type { ChoiceFieldProps };
export { ChoiceField };
