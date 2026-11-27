import {
  type AnyFormApi,
  type FormValidateOrFn,
  isStandardSchemaValidator,
  type ReactFormExtendedApi,
  type RejectPromiseValidator,
  type StandardSchemaV1,
  useForm,
  useStore,
} from "@tanstack/react-form";
import * as React from "react";
import { useFailureText } from "./components/admin-provider";
import { confirm } from "./components/alert-dialog";
import { Banner } from "./components/banner";
import { Button, type ButtonProps, buttonVariants } from "./components/button";
import { CheckboxField, CheckboxGroup } from "./components/checkbox";
import { DatePicker } from "./components/date-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./components/drawer";
import { toastDone } from "./components/feedback";
import {
  FieldDescription,
  FieldError,
  FieldLegend,
  FieldSet,
  FormField,
} from "./components/field";
import { FileInput, FileInputTrigger } from "./components/file-input";
import { Input } from "./components/input";
import { type Messages, useMessages } from "./components/messages";
import { NumberInput } from "./components/number-input";
import { RadioField, RadioGroup } from "./components/radio";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "./components/select";
import { SwitchField } from "./components/switch";
import { TagInput } from "./components/tag-input";
import { Textarea } from "./components/textarea";
import { cn } from "./lib/cn";
import { errorText, formErrorText, hiddenFieldError } from "./lib/form-errors";
import type { FormResult } from "./lib/form-result";
import { type FileKind, FilePreview } from "./patterns/file-preview";

/**
 * The parts of a TanStack field (from `<form.Field>`) that our fields use.
 * `handleChange` is a property, not a method, so a field whose value type
 * doesn't match the control is a type error.
 */
interface BoundField<T> {
  form: AnyFormApi;
  handleBlur: () => void;
  handleChange: (value: T) => void;
  name: string;
  state: { value: T; meta: { errors: readonly unknown[] } };
}

/** Sets or clears a field's server error, which the next change or submit clears. */
function setServerError(
  field: Pick<BoundField<unknown>, "form" | "name">,
  message: string | undefined
) {
  field.form.setFieldMeta(field.name, (meta) => ({
    ...meta,
    errorMap: { ...meta.errorMap, onServer: message },
  }));
}

/**
 * For your own fields: the field's first error as text, and a change handler
 * that also clears the server's error for it. `toValue` turns what the control
 * reports into the field's value.
 */
function bindField<T, I = T>(field: BoundField<T>, toValue?: (input: I) => T) {
  const onChange = (input: I) => {
    setServerError(field, undefined);
    field.handleChange(toValue ? toValue(input) : (input as unknown as T));
  };
  return { error: errorText(field.state.meta.errors[0]), onChange };
}

/** What every field takes. Give your own fields these props too. */
interface FieldProps<T> {
  description?: React.ReactNode;
  /** The field from `<form.Field name="…">{(field) => …}</form.Field>`. */
  field: BoundField<T>;
  label: React.ReactNode;
}

/** Props of a control, without the ones the field sets. */
type ControlProps<C extends React.ElementType> = Omit<
  React.ComponentProps<C>,
  "value" | "defaultValue" | "onValueChange" | "name" | "onBlur"
>;

function TextField({
  field,
  label,
  description,
  ...props
}: FieldProps<string> & ControlProps<typeof Input>) {
  const { error, onChange } = bindField(field);
  return (
    <FormField description={description} error={error} label={label}>
      <Input
        {...props}
        name={field.name}
        onBlur={field.handleBlur}
        onValueChange={onChange}
        value={field.state.value}
      />
    </FormField>
  );
}

function TextareaField({
  field,
  label,
  description,
  ...props
}: FieldProps<string> & ControlProps<typeof Textarea>) {
  const { error, onChange } = bindField(field);
  return (
    <FormField description={description} error={error} label={label}>
      <Textarea
        {...props}
        name={field.name}
        onBlur={field.handleBlur}
        onValueChange={onChange}
        value={field.state.value}
      />
    </FormField>
  );
}

/** A number, or null while empty. */
function NumberField({
  field,
  label,
  description,
  ...props
}: FieldProps<number | null> & ControlProps<typeof NumberInput>) {
  const { error, onChange } = bindField(field);
  return (
    <FormField description={description} error={error} label={label}>
      <NumberInput
        {...props}
        name={field.name}
        onBlur={field.handleBlur}
        onValueChange={onChange}
        value={field.state.value}
      />
    </FormField>
  );
}

type DateValue = NonNullable<React.ComponentProps<typeof DatePicker>["value"]>;

/** An ISO date string like "2026-10-16", or null while empty. */
function DateField({
  field,
  label,
  description,
  ...props
}: FieldProps<string | null> &
  Omit<ControlProps<typeof DatePicker>, "mode" | "endLabel">) {
  const { error, onChange } = bindField(field, (value: DateValue | null) =>
    typeof value === "string" ? value : null
  );
  return (
    <FormField description={description} error={error} label={label}>
      <DatePicker
        {...props}
        name={field.name}
        onBlur={field.handleBlur}
        onValueChange={onChange}
        value={field.state.value as DateValue | null}
      />
    </FormField>
  );
}

interface Option<T extends string> {
  label: React.ReactNode;
  value: T;
}

/** The empty choice's value inside the Select; the field holds null for it. */
const emptyValue = "";

/**
 * One value from a short list. The field holds a string (or a union of
 * strings), or null while nothing is chosen; the options must match it.
 */
function SelectField<T extends string | null>({
  field,
  label,
  description,
  options,
  placeholder,
  emptyLabel,
  disabled,
}: FieldProps<T> & {
  options: readonly Option<NoInfer<NonNullable<T>>>[];
  placeholder?: string;
  /** Adds a first choice, like "None", that sets the field to null, so `placeholder` never shows. Only for fields that can be null. */
  emptyLabel?: null extends T ? string : never;
  disabled?: boolean;
}) {
  const hasEmpty = emptyLabel !== undefined;
  const { error, onChange } = bindField(
    field,
    (value: NonNullable<T> | null) => {
      if (hasEmpty && value === emptyValue) {
        return null as T;
      }
      // Null only comes from a clear button or a native form reset, and we render neither: keep the value.
      return value ?? field.state.value;
    }
  );
  const selected = field.state.value ?? (hasEmpty ? emptyValue : null);
  return (
    <FormField description={description} error={error} label={label}>
      <Select<NonNullable<T>>
        disabled={disabled}
        name={field.name}
        onValueChange={onChange}
        placeholder={placeholder}
        value={selected as NonNullable<T> | null}
      >
        <SelectTrigger onBlur={field.handleBlur} />
        <SelectContent>
          {hasEmpty ? (
            <SelectItem value={emptyValue as NonNullable<T>}>
              {emptyLabel}
            </SelectItem>
          ) : null}
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormField>
  );
}

type ChoiceOption<T extends string> = Option<T> & {
  description?: React.ReactNode;
};

/** The ARIA a radio or checkbox group needs from the fieldset around it. */
interface GroupAria {
  "aria-describedby": string | undefined;
  "aria-invalid": true | undefined;
  "aria-labelledby": string;
}

/** A fieldset with a legend, description and error, around a radio or checkbox group. */
function ChoiceGroup({
  label,
  description,
  error,
  disabled,
  onBlur,
  children,
}: Omit<FieldProps<unknown>, "field"> & {
  error: string | null;
  disabled?: boolean;
  onBlur: () => void;
  children: (aria: GroupAria) => React.ReactNode;
}) {
  const errorId = React.useId();
  const legendId = React.useId();
  const descriptionId = React.useId();
  const describedBy =
    [description && descriptionId, error && errorId]
      .filter(Boolean)
      .join(" ") || undefined;
  return (
    <FieldSet className="au:gap-3" disabled={disabled} onBlur={onBlur}>
      <FieldLegend
        className="au:mb-0 au:px-1 au:text-xs au:font-medium au:text-gray-600"
        id={legendId}
      >
        {label}
      </FieldLegend>
      {description ? (
        <FieldDescription id={descriptionId}>{description}</FieldDescription>
      ) : null}
      {children({
        "aria-describedby": describedBy,
        "aria-invalid": error ? true : undefined,
        "aria-labelledby": legendId,
      })}
      {error ? (
        <FieldError id={errorId} match>
          {error}
        </FieldError>
      ) : null}
    </FieldSet>
  );
}

/** One value from a few options shown at once, each with an optional description. */
function RadioGroupField<T extends string>({
  field,
  label,
  description,
  options,
  disabled,
}: FieldProps<T> & {
  options: readonly ChoiceOption<NoInfer<T>>[];
  disabled?: boolean;
}) {
  const { error, onChange } = bindField(
    field,
    (value: T | null) => value ?? field.state.value
  );
  return (
    <ChoiceGroup
      description={description}
      disabled={disabled}
      error={error}
      label={label}
      onBlur={field.handleBlur}
    >
      {(aria) => (
        <RadioGroup<T>
          {...aria}
          name={field.name}
          onValueChange={onChange}
          value={field.state.value}
        >
          {options.map((option) => (
            <RadioField
              description={option.description}
              key={option.value}
              label={option.label}
              value={option.value}
            />
          ))}
        </RadioGroup>
      )}
    </ChoiceGroup>
  );
}

/** Any number of values from a few options shown at once, like the IDs of related records. */
function ChecklistField<T extends string>({
  field,
  label,
  description,
  options,
  disabled,
}: FieldProps<T[]> & {
  options: readonly ChoiceOption<NoInfer<T>>[];
  disabled?: boolean;
}) {
  const { error, onChange } = bindField(field);
  return (
    <ChoiceGroup
      description={description}
      disabled={disabled}
      error={error}
      label={label}
      onBlur={field.handleBlur}
    >
      {(aria) => (
        <CheckboxGroup<T>
          {...aria}
          name={field.name}
          onValueChange={onChange}
          value={field.state.value}
        >
          {options.map((option) => (
            <CheckboxField
              description={option.description}
              key={option.value}
              label={option.label}
              value={option.value}
            />
          ))}
        </CheckboxGroup>
      )}
    </ChoiceGroup>
  );
}

/** A checkbox for a boolean. */
function FormCheckboxField({
  field,
  ...props
}: FieldProps<boolean> & { disabled?: boolean }) {
  const { error, onChange } = bindField(
    field,
    (checked: boolean | "indeterminate") => checked === true
  );
  return (
    <CheckboxField
      {...props}
      checked={field.state.value}
      error={error}
      name={field.name}
      onBlur={field.handleBlur}
      onCheckedChange={onChange}
    />
  );
}

/** A switch for a boolean, as a settings row. */
function FormSwitchField({
  field,
  ...props
}: FieldProps<boolean> & { disabled?: boolean }) {
  const { error, onChange } = bindField(field);
  return (
    <SwitchField
      {...props}
      checked={field.state.value}
      error={error}
      name={field.name}
      onBlur={field.handleBlur}
      onCheckedChange={onChange}
    />
  );
}

/** A list of free-text tags. */
function TagsField({
  field,
  label,
  description,
  ...props
}: FieldProps<string[]> & ControlProps<typeof TagInput>) {
  const { error, onChange } = bindField(field);
  return (
    <FormField description={description} error={error} label={label}>
      {/* biome-ignore lint/a11y/noStaticElementInteractions: TagInput takes no onBlur, so a focus-out anywhere in it counts. */}
      {/* biome-ignore lint/a11y/noNoninteractiveElementInteractions: as above. */}
      <div onBlur={field.handleBlur}>
        <TagInput
          {...props}
          name={field.name}
          onValueChange={onChange}
          value={field.state.value}
        />
      </div>
    </FormField>
  );
}

/** FileInput's value: a picked file goes to `upload`, not into the field. */
const noFiles: File[] = [];

/** FileField's own live region speaks for it, so FileInput stays quiet. */
const noAnnouncement = () => null;

type FileChange = NonNullable<
  React.ComponentProps<typeof FileInput>["onValueChange"]
>;

/** Why an upload failed, as the field's error. */
function uploadErrorText(error: unknown, fallback: string) {
  return error instanceof Error && error.message ? error.message : fallback;
}

/** The tile for a file's MIME type, like "audio/mpeg". */
function fileKind(type: string): FileKind {
  const [group] = type.split("/");
  return group === "image" || group === "video" || group === "audio"
    ? group
    : "file";
}

/** A file picked in this field, shown from the browser's copy while it uploads and after. */
interface Picked<T> {
  id: T | null;
  kind: FileKind;
  name: string;
  progress: number | null;
  status: "uploading" | "error" | "ready";
  url: string;
}

function PickedPreview<T>({ picked }: { picked: Picked<T> }) {
  const { url, name, kind } = picked;
  if (picked.status === "uploading") {
    return (
      <FilePreview
        kind={kind}
        name={name}
        progress={picked.progress}
        status="uploading"
        url={url}
      />
    );
  }
  return (
    <FilePreview kind={kind} name={name} status={picked.status} url={url} />
  );
}

/** What FileField tells screen readers, which don't follow the progress bar. */
function uploadStatus<T>(
  picked: Picked<T> | null,
  error: string | null,
  value: T,
  messages: Messages
) {
  if (picked?.status === "uploading") {
    return messages.uploading({ name: picked.name });
  }
  if (error) {
    return error;
  }
  return picked?.status === "ready" && picked.id === value
    ? messages.uploaded({ name: picked.name })
    : "";
}

/**
 * One file, uploaded as soon as it's picked. The field holds the ID `upload`
 * returns, or null while empty. A picked file shows at once, with its
 * progress; `preview` shows a saved one. Inside an AdminForm, the form
 * doesn't submit while it uploads.
 */
function FileField<T extends string | null>({
  field,
  label,
  description,
  upload,
  preview,
  accept,
  removable,
  disabled,
}: FieldProps<T> & {
  /** Uploads the file and returns its ID. Call `onProgress` with 0 to 1 as it goes. A rejection's message shows as the field's error. */
  upload: (
    file: File,
    onProgress: (fraction: number) => void
  ) => Promise<NonNullable<NoInfer<T>>>;
  /** Shows the saved file with this ID, usually as a `<FilePreview>`. Without it, a saved file shows as "Current file". */
  preview?: (id: NonNullable<NoInfer<T>>) => React.ReactNode;
  /** MIME types and extensions, like `"image/*"` or `[".mp3", ".wav"]`. */
  accept?: React.ComponentProps<typeof FileInput>["accept"];
  /** Adds a Remove button that sets the field to null. Only for fields that can be null. */
  removable?: null extends T ? boolean : never;
  disabled?: boolean;
}) {
  const { error, onChange } = bindField(field);
  const [picked, setPicked] = React.useState<Picked<T> | null>(null);
  const pickedUrl = picked?.url;
  React.useEffect(
    () => () => {
      if (pickedUrl) {
        URL.revokeObjectURL(pickedUrl);
      }
    },
    [pickedUrl]
  );
  // Only the latest pick counts: picking again while one uploads replaces it, and unmounting drops it.
  const latest = React.useRef(0);
  React.useEffect(
    () => () => {
      latest.current += 1;
    },
    []
  );
  const trigger = React.useRef<HTMLButtonElement>(null);
  const formContext = React.use(FormContext);
  const startUpload = formContext?.startUpload;
  const holdFailed = formContext?.holdFailed;
  const failureText = useFailureText();
  const messages = useMessages();
  const uploading = picked?.status === "uploading";
  const failed = picked?.status === "error";
  React.useEffect(
    () => (uploading ? startUpload?.() : undefined),
    [uploading, startUpload]
  );
  React.useEffect(
    () => (failed ? holdFailed?.(() => trigger.current?.focus()) : undefined),
    [failed, holdFailed]
  );

  const pick = React.useCallback<FileChange>(
    async ([file], details) => {
      details.cancel();
      if (!file) {
        return;
      }
      latest.current += 1;
      const run = latest.current;
      setServerError(field, undefined);
      setPicked({
        url: URL.createObjectURL(file),
        name: file.name,
        kind: fileKind(file.type),
        status: "uploading",
        progress: null,
        id: null,
      });
      try {
        const id = await upload(file, (progress) => {
          if (run === latest.current) {
            setPicked((prev) => prev && { ...prev, progress });
          }
        });
        if (run === latest.current) {
          setPicked((prev) => prev && { ...prev, status: "ready", id });
          onChange(id);
        }
      } catch (reason) {
        if (run === latest.current) {
          setPicked((prev) => prev && { ...prev, status: "error" });
          setServerError(
            field,
            failureText(reason, uploadErrorText(reason, messages.uploadFailed))
          );
        }
      }
    },
    [field, upload, onChange, failureText, messages]
  );
  const reject = React.useCallback(
    () => setServerError(field, messages.fileNotAccepted),
    [field, messages]
  );
  const remove = React.useCallback(() => {
    setPicked(null);
    onChange(null as T);
    // The Remove button goes away, so keep focus in the field.
    trigger.current?.focus();
  }, [onChange]);

  const { value } = field.state;
  // A picked file shows while it uploads and once saved. A failed one shows only
  // when there's no saved file, which stays visible otherwise, next to the error.
  const showPicked =
    picked !== null &&
    (picked.status === "uploading" ||
      (picked.status === "error" && value === null) ||
      (picked.status === "ready" && picked.id === value));
  let tile: React.ReactNode = null;
  if (showPicked) {
    tile = <PickedPreview picked={picked} />;
  } else if (value !== null) {
    tile = preview ? (
      preview(value)
    ) : (
      <FilePreview kind="file" name={messages.currentFile} />
    );
  }
  return (
    <FormField description={description} error={error} label={label}>
      <FileInput
        accept={accept}
        announcement={noAnnouncement}
        className="au:gap-3 au:px-1 au:pb-0.5"
        disabled={disabled}
        onReject={reject}
        onValueChange={pick}
        value={noFiles}
      >
        {tile}
        <div className="au:flex au:min-h-8 au:items-center au:gap-3">
          <FileInputTrigger
            className={buttonVariants({ variant: "outline", size: "sm" })}
            onBlur={field.handleBlur}
            ref={trigger}
          >
            {value === null ? messages.chooseFile : messages.replaceFile}
          </FileInputTrigger>
          <span className="au:min-w-0 au:flex-1 au:truncate au:text-sm au:text-gray-600">
            {tile ? null : messages.noFile}
          </span>
          {removable && (value !== null || failed) && !uploading ? (
            <Button
              disabled={disabled}
              onClick={remove}
              size="sm"
              variant="ghost"
            >
              {messages.remove}
            </Button>
          ) : null}
        </div>
        <span aria-live="polite" className="au:sr-only">
          {uploadStatus(picked, error, value, messages)}
        </span>
      </FileInput>
    </FormField>
  );
}

/** Shows a refused submit on the form: its message above the submit button, its field errors under the fields. */
function refuse(
  form: AnyFormApi,
  result: Extract<FormResult, { ok: false }>,
  failed: string
) {
  // An empty message would mark its field invalid without saying why.
  const fieldErrors = Object.fromEntries(
    Object.entries(result.fieldErrors ?? {}).filter(([, text]) => text)
  );
  const isRendered = (path: string) => Boolean(form.fieldInfo[path]?.instance);
  // Without a message, an error for a field the form doesn't render, or the generic one.
  const message =
    result.message ||
    hiddenFieldError(fieldErrors, isRendered) ||
    (Object.keys(fieldErrors).length > 0 ? undefined : failed);
  form.setErrorMap({ onServer: { form: message, fields: fieldErrors } });
}

/** What onSubmit receives: the schema's output when `validators.onSubmit` is a Standard Schema, else the form values. */
type SubmitValue<TFormData, TOnSubmit> =
  TOnSubmit extends StandardSchemaV1<unknown, infer TOutput>
    ? TOutput
    : TFormData;

type Validator<TFormData> = undefined | FormValidateOrFn<TFormData>;

interface AdminFormOptions<
  TFormData,
  TOnChange extends Validator<TFormData>,
  TOnBlur extends Validator<TFormData>,
  TOnSubmit extends Validator<TFormData>,
> {
  defaultValues: TFormData;
  /** Runs once the form is valid. Return a FormResult to show the outcome on the form. */
  onSubmit: (
    value: SubmitValue<TFormData, TOnSubmit>
    // biome-ignore lint/suspicious/noConfusingVoidType: a submit may return nothing.
  ) => FormResult | void | Promise<FormResult | void>;
  /** Each a Standard Schema (like Zod) or a function, as in TanStack Form. */
  validators?: {
    onChange?: RejectPromiseValidator<TOnChange>;
    onBlur?: RejectPromiseValidator<TOnBlur>;
    onSubmit?: RejectPromiseValidator<TOnSubmit>;
  };
}

/**
 * TanStack Form's `useForm`, with our submit handling. `onSubmit` receives
 * the parsed output of the `validators.onSubmit` schema and may return a
 * FormResult. A thrown error is logged and shown as a generic form error, or
 * a session one (see AdminProvider).
 * Inside a FormDialog or FormDrawer, `ok: true` closes it. The onSubmit schema runs
 * twice per submit (TanStack's check, then the parse), so keep slow async
 * checks, like a uniqueness lookup, in the save itself.
 */
function useAdminForm<
  TFormData,
  TOnChange extends Validator<TFormData> = undefined,
  TOnBlur extends Validator<TFormData> = undefined,
  TOnSubmit extends Validator<TFormData> = undefined,
>({
  defaultValues,
  validators,
  onSubmit,
}: AdminFormOptions<
  TFormData,
  TOnChange,
  TOnBlur,
  TOnSubmit
>): ReactFormExtendedApi<
  TFormData,
  undefined,
  TOnChange,
  undefined,
  TOnBlur,
  undefined,
  TOnSubmit,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined
> {
  const overlay = React.use(FormOverlayContext);
  const failureText = useFailureText();
  const messages = useMessages();
  return useForm<
    TFormData,
    undefined,
    TOnChange,
    undefined,
    TOnBlur,
    undefined,
    TOnSubmit,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined
  >({
    defaultValues,
    validators,
    // TanStack stops at the first invalid step: a field's own validator hides
    // the form schema's errors. Check both, so one submit shows every error.
    onSubmitInvalid: ({ formApi }) => {
      formApi
        .validateAllFields("submit")
        .then(() => formApi.validate("submit"))
        .catch(console.error);
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        const schema = validators?.onSubmit;
        let input: unknown = value;
        if (isStandardSchemaValidator(schema)) {
          const parsed = await schema["~standard"].validate(value);
          // TanStack already validated; issues here mean there is nothing to submit.
          if (parsed.issues) {
            return;
          }
          input = parsed.value;
        }
        const result = await onSubmit(
          input as SubmitValue<TFormData, TOnSubmit>
        );
        if (!result) {
          return;
        }
        if (!result.ok) {
          refuse(formApi, result, messages.failed);
          return;
        }
        toastDone(result);
        overlay?.close();
      } catch (error) {
        console.error(error);
        refuse(
          formApi,
          { ok: false, message: failureText(error) },
          messages.failed
        );
      }
    },
  });
}

const FormContext = React.createContext<{
  form: AnyFormApi;
  /** True while a FileField uploads. The form doesn't submit then. */
  uploading: boolean;
  /** Counts an upload as running; call what it returns once it's done. */
  startUpload: () => () => void;
  /** Marks a failed upload, which blocks the submit; `focus` shows it. Call what it returns once it's resolved. */
  holdFailed: (focus: () => void) => () => void;
} | null>(null);

function useFormContext() {
  const context = React.use(FormContext);
  if (!context) {
    throw new Error("SubmitButton and FormError go inside an AdminForm.");
  }
  return context;
}

/** The `<form>` for a form from useAdminForm: submits it, and gives SubmitButton and FormError their form. */
function AdminForm({
  form,
  className,
  children,
}: {
  form: AnyFormApi;
  className?: string;
  children: React.ReactNode;
}) {
  const [uploads, setUploads] = React.useState(0);
  const failureText = useFailureText();
  const messages = useMessages();
  const startUpload = React.useCallback(() => {
    setUploads((count) => count + 1);
    return () => setUploads((count) => count - 1);
  }, []);
  // Focus callbacks of FileFields whose upload failed.
  const failed = React.useRef(new Set<() => void>());
  const holdFailed = React.useCallback((focus: () => void) => {
    failed.current.add(focus);
    return () => {
      failed.current.delete(focus);
    };
  }, []);
  const submit = React.useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      // Saving now would keep the file the upload replaces.
      if (uploads > 0) {
        return;
      }
      // Saving would drop the failed file silently, and its error with it.
      const [focusFailed] = failed.current;
      if (focusFailed) {
        focusFailed();
        return;
      }
      // The last submit's errors shouldn't block this one. TanStack skips the
      // form schema while a field still holds its error, so new errors wouldn't show.
      form.setErrorMap({
        onSubmit: { form: undefined, fields: {} },
        onServer: { form: undefined, fields: {} },
      });
      form.handleSubmit().catch((error: unknown) => {
        console.error(error);
        refuse(
          form,
          { ok: false, message: failureText(error) },
          messages.failed
        );
      });
    },
    [form, uploads, failureText, messages]
  );
  const context = React.useMemo(
    () => ({ form, uploading: uploads > 0, startUpload, holdFailed }),
    [form, uploads, startUpload, holdFailed]
  );
  const overlay = React.use(FormOverlayContext);
  React.useLayoutEffect(() => {
    if (overlay) {
      overlay.hasChanges.current = () =>
        uploads > 0 || !form.state.isDefaultValue;
    }
  }, [overlay, form, uploads]);
  // In a FormDialog or FormDrawer the form holds a scrolling body and a footer, which bring their own spacing; in a drawer it fills the height.
  const inOverlay = overlay !== null;
  return (
    <FormContext value={context}>
      <form
        className={cn(
          "au:flex au:min-h-0 au:flex-col",
          inOverlay ? "au:grow" : "au:gap-4",
          className
        )}
        noValidate
        onSubmit={submit}
      >
        {children}
      </form>
    </FormContext>
  );
}

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown
  ? Omit<T, K>
  : never;

/** Pending while the submit runs or a FileField uploads, and pressable once at a time. */
function SubmitButton(
  props: DistributiveOmit<ButtonProps, "type" | "onClick">
) {
  const { form, uploading } = useFormContext();
  const submitting = useStore(
    form.store,
    (state: AnyFormApi["state"]) => state.isSubmitting
  );
  return (
    <Button
      {...props}
      aria-busy={submitting || uploading || undefined}
      disabled={props.disabled || submitting || uploading}
      // Keeps keyboard focus on the button while it submits.
      focusableWhenDisabled
      type="submit"
    />
  );
}

/** The form-wide error: a refused submit's message, or a schema issue that names no field or a field the form doesn't render. */
function FormError({ className }: { className?: string }) {
  const { form } = useFormContext();
  const error = useStore(form.store, (state: AnyFormApi["state"]) => {
    const isRendered = (path: string) =>
      Boolean(form.fieldInfo[path]?.instance);
    // `state.errors` includes the server's error too; listing it first gives it priority.
    for (const value of [state.errorMap.onServer, ...state.errors]) {
      const text = formErrorText(value, isRendered);
      if (text) {
        return text;
      }
    }
    return null;
  });
  if (!error) {
    return null;
  }
  return <Banner className={className} title={error} tone="danger" />;
}

const FormOverlayContext = React.createContext<{
  /** Closes the FormDialog or FormDrawer, but only for the opening its form belongs to. */
  close: () => void;
  /** Whether the form inside has unsaved changes, which closing asks about. Set by its AdminForm. */
  hasChanges: React.RefObject<(() => boolean) | null>;
} | null>(null);

/** Either a `trigger` that opens it, or `open` and `onOpenChange` from your own state, like the URL. */
type FormOverlayProps = {
  children: React.ReactNode;
  description?: React.ReactNode;
  title: React.ReactNode;
} & (
  | {
      /** The element that opens it, like `<Button>New listing</Button>`. */
      trigger: React.ReactElement<Record<string, unknown>>;
      open?: never;
      onOpenChange?: never;
    }
  | {
      trigger?: never;
      open: boolean;
      /** Called with `false` on Escape, Cancel or a submit that returns `ok: true`. With unsaved changes, only once the person agrees to discard them. */
      onOpenChange: (open: boolean) => void;
    }
);

/** Open state for a FormDialog or FormDrawer, and `content` to wrap the form so it starts fresh on each opening. */
function useFormOverlay(props: FormOverlayProps) {
  const messages = useMessages();
  const [ownOpen, setOwnOpen] = React.useState(false);
  const open = props.open ?? ownOpen;
  const onOpenChange = props.onOpenChange ?? setOwnOpen;
  // A new opening number starts the form fresh, and the old form stays visible while the overlay animates out.
  const [state, setState] = React.useState({ opening: 0, open });
  if (state.open !== open) {
    setState({ opening: open ? state.opening + 1 : state.opening, open });
  }
  const { opening } = state;
  // Only the form of the opening that is open now may close it: not a slow submit from an earlier opening, nor one that ends after Escape.
  const live = React.useRef({ opening: open ? opening : -1, onOpenChange });
  React.useLayoutEffect(() => {
    live.current = { opening: open ? opening : -1, onOpenChange };
  });
  const context = React.useMemo(
    () => ({
      close: () => {
        if (live.current.opening === opening) {
          live.current.onOpenChange(false);
        }
      },
      hasChanges: React.createRef<() => boolean>(),
    }),
    [opening]
  );
  // A submit closes through `context.close`; every other way of closing comes here.
  const requestOpenChange = (
    next: boolean,
    details: { cancel: () => void }
  ) => {
    if (next || !context.hasChanges.current?.()) {
      onOpenChange(next);
      return;
    }
    details.cancel();
    confirm({
      title: messages.discardChanges,
      cancelLabel: messages.keepEditing,
      confirmLabel: messages.discard,
      tone: "danger",
    })
      .then((discard) => {
        if (discard) {
          context.close();
        }
      })
      .catch(console.error);
  };
  const content = (children: React.ReactNode) => (
    <FormOverlayContext key={opening} value={context}>
      {children}
    </FormOverlayContext>
  );
  return { open, onOpenChange: requestOpenChange, content };
}

/**
 * A dialog holding a form. The form mounts fresh each time it opens, and a
 * submit that returns `{ ok: true }` closes it. Put a component that calls
 * useAdminForm inside, rendering DialogBody and DialogFooter in its AdminForm.
 */
function FormDialog({
  size,
  ...props
}: FormOverlayProps & {
  size?: React.ComponentProps<typeof DialogContent>["size"];
}) {
  const { title, description, trigger, children } = props;
  const { content, ...root } = useFormOverlay(props);
  return (
    <Dialog {...root}>
      {trigger ? <DialogTrigger render={trigger} /> : null}
      <DialogContent size={size}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : null}
        </DialogHeader>
        {content(children)}
      </DialogContent>
    </Dialog>
  );
}

/**
 * FormDialog as a side sheet, for longer forms. Render DrawerBody and
 * DrawerFooter in its AdminForm, with other buttons before the SubmitButton.
 */
function FormDrawer({
  size,
  ...props
}: FormOverlayProps & {
  size?: React.ComponentProps<typeof DrawerContent>["size"];
}) {
  const { title, description, trigger, children } = props;
  const { content, ...root } = useFormOverlay(props);
  return (
    <Drawer {...root}>
      {trigger ? <DrawerTrigger render={trigger} /> : null}
      <DrawerContent size={size}>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          {description ? (
            <DrawerDescription>{description}</DrawerDescription>
          ) : null}
        </DrawerHeader>
        {content(children)}
      </DrawerContent>
    </Drawer>
  );
}

export type { FieldProps, FormResult };
export {
  AdminForm,
  bindField,
  ChecklistField,
  DateField,
  FileField,
  FormCheckboxField,
  FormDialog,
  FormDrawer,
  FormError,
  FormSwitchField,
  NumberField,
  RadioGroupField,
  SelectField,
  SubmitButton,
  TagsField,
  TextareaField,
  TextField,
  useAdminForm,
};
