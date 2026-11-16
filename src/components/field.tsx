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
import type { WithClass } from "../lib/types";

function Field({
  className,
  ...props
}: WithClass<React.ComponentProps<typeof FieldPart>>) {
  return (
    <FieldPart
      className={cn("au:flex au:w-full au:flex-col au:gap-2", className)}
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
        "au:px-1 au:text-xs au:font-medium au:text-gray-600 au:data-invalid:text-red-500 au:data-required:after:ml-0.5 au:data-required:after:text-red-500 au:data-required:after:content-['*']",
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
      className={cn("au:px-1 au:text-sm au:text-gray-600", className)}
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
      className={cn(
        "au:px-1 au:text-sm au:font-medium au:text-red-500",
        className
      )}
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
      className={cn("au:flex au:min-w-0 au:flex-col au:gap-4", className)}
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
      className={cn(
        "au:mb-1 au:text-lg au:font-semibold au:text-gray-950",
        className
      )}
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
      className={cn("au:flex au:flex-col au:gap-4", className)}
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
        className="au:group au:border-alpha/10 au:focus-within:border-accent/70 au:focus-within:ring-accent/10 au:hover:border-alpha/20 au:hover:focus-within:border-accent/70 au:flex au:flex-col au:gap-1 au:rounded-lg au:border au:bg-gray-50 au:p-1.5 au:transition-colors au:focus-within:ring-4 au:in-data-invalid:border-red-500/70"
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
