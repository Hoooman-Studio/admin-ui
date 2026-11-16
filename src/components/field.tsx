import {
  FieldDescription as FieldDescriptionPart,
  FieldError as FieldErrorPart,
  FieldGroup as FieldGroupPart,
  FieldLabel as FieldLabelPart,
  FieldLegend as FieldLegendPart,
  Field as FieldPart,
  FieldSet as FieldSetPart,
} from "@ui-sdk/react/field";
import type * as React from "react";
import { cn } from "../lib/cn";

type WithClass<T> = Omit<T, "className"> & { className?: string };

function Field({
  className,
  ...props
}: WithClass<React.ComponentProps<typeof FieldPart>>) {
  return (
    <FieldPart
      className={cn("flex w-full flex-col gap-2", className)}
      {...props}
    />
  );
}

function FieldLabel({
  className,
  ...props
}: WithClass<React.ComponentProps<typeof FieldLabelPart>>) {
  return (
    <FieldLabelPart
      className={cn(
        "px-1 text-xs font-medium text-gray-600 data-invalid:text-red-500 data-required:after:ml-0.5 data-required:after:text-red-500 data-required:after:content-['*']",
        className
      )}
      {...props}
    />
  );
}

function FieldDescription({
  className,
  ...props
}: WithClass<React.ComponentProps<typeof FieldDescriptionPart>>) {
  return (
    <FieldDescriptionPart
      className={cn("px-1 text-sm text-gray-600", className)}
      {...props}
    />
  );
}

function FieldError({
  className,
  ...props
}: WithClass<React.ComponentProps<typeof FieldErrorPart>>) {
  return (
    <FieldErrorPart
      className={cn("px-1 text-sm font-medium text-red-500", className)}
      {...props}
    />
  );
}

function FieldSet({
  className,
  ...props
}: WithClass<React.ComponentProps<typeof FieldSetPart>>) {
  return (
    <FieldSetPart
      className={cn("flex min-w-0 flex-col gap-4", className)}
      {...props}
    />
  );
}

function FieldLegend({
  className,
  ...props
}: WithClass<React.ComponentProps<typeof FieldLegendPart>>) {
  return (
    <FieldLegendPart
      className={cn("mb-1 text-lg font-semibold text-gray-950", className)}
      {...props}
    />
  );
}

function FieldGroup({
  className,
  ...props
}: WithClass<React.ComponentProps<typeof FieldGroupPart>>) {
  return (
    <FieldGroupPart
      className={cn("flex flex-col gap-4", className)}
      {...props}
    />
  );
}

interface FormFieldProps {
  /** The control: an Input, Textarea, Select, Combobox, NumberInput or DateInput. */
  children: React.ReactNode;
  className?: string;
  description?: React.ReactNode;
  disabled?: boolean;
  /** An error from your server or form library. Native constraint errors show on their own. */
  error?: string | null;
  label: React.ReactNode;
  name?: string;
}

/**
 * The Hooman Studio field: label and control in one bordered card, then the
 * description and error under it. Mark the control `required` and the label shows an asterisk.
 */
function FormField({
  label,
  children,
  name,
  description,
  error,
  disabled,
  className,
}: FormFieldProps) {
  return (
    <Field
      className={className}
      disabled={disabled}
      invalid={error ? true : undefined}
      name={name}
    >
      <div
        className="group border-alpha/10 focus-within:border-accent/70 focus-within:ring-accent/10 hover:border-alpha/20 hover:focus-within:border-accent/70 flex flex-col gap-1 rounded-lg border bg-gray-50 p-1.5 transition-colors focus-within:ring-4 in-data-disabled:opacity-60 in-data-invalid:border-red-500/70"
        data-slot="form-field-box"
      >
        <FieldLabel>{label}</FieldLabel>
        {children}
      </div>
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      {error ? <FieldError match>{error}</FieldError> : <FieldError />}
    </Field>
  );
}

export type { FormFieldProps };
export {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FormField,
};
