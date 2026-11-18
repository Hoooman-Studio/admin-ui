// Type tests for ./form: each @ts-expect-error is a misuse that must not compile.
// Checked by `tsc --noEmit`; not built or run.

import { Progress } from "./components/progress";
import {
  AdminForm,
  FileField,
  FormCheckboxField,
  NumberField,
  SubmitButton,
  TextField,
  useAdminForm,
} from "./form";
import { FilePreview } from "./patterns/file-preview";

type StorageId = string & { __table: "_storage" };

const listing: {
  title: string;
  rent: number | null;
  coverId: StorageId | null;
} = {
  title: "",
  rent: null,
  coverId: null,
};

declare function uploadToStorage(file: File): Promise<StorageId>;
declare function uploadAnywhere(file: File): Promise<string>;

// biome-ignore lint/correctness/noUnusedVariables: only type-checked.
function Misuses() {
  const form = useAdminForm({
    defaultValues: listing,
    onSubmit: () => undefined,
  });
  useAdminForm({
    defaultValues: listing,
    // @ts-expect-error onSubmit returns a FormResult or nothing.
    onSubmit: () => ({ ok: "yes" }),
  });
  return (
    <AdminForm form={form}>
      <form.Field name="rent">
        {/* @ts-expect-error A number field needs a NumberField. */}
        {(field) => <TextField field={field} label="Rent" />}
      </form.Field>
      <form.Field name="title">
        {/* @ts-expect-error A string field can't use a NumberField. */}
        {(field) => <NumberField field={field} label="Title" />}
      </form.Field>
      <form.Field name="title">
        {/* @ts-expect-error A checkbox needs a boolean field. */}
        {(field) => <FormCheckboxField field={field} label="Title" />}
      </form.Field>
      <form.Field name="coverId">
        {(field) => (
          <FileField
            field={field}
            label="Cover"
            removable
            upload={uploadToStorage}
          />
        )}
      </form.Field>
      <form.Field name="coverId">
        {(field) => (
          <FileField
            field={field}
            label="Cover"
            // @ts-expect-error upload returns the field's ID type.
            upload={uploadAnywhere}
          />
        )}
      </form.Field>
      <form.Field name="title">
        {(field) => (
          <FileField
            field={field}
            label="Title"
            // @ts-expect-error A field that can't be null has no Remove.
            removable
            upload={uploadAnywhere}
          />
        )}
      </form.Field>
      <form.Field name="rent">
        {(field) => (
          <FileField
            // @ts-expect-error A file field holds a string ID.
            field={field}
            label="Rent"
            upload={uploadAnywhere}
          />
        )}
      </form.Field>
      <Progress aria-label="Uploading" value={40} />
      {/* @ts-expect-error A progress bar needs a label or an aria-label. */}
      <Progress value={40} />
      <FilePreview kind="audio" progress={0.4} status="uploading" />
      {/* @ts-expect-error An uploading tile needs its progress. */}
      <FilePreview kind="audio" status="uploading" />
      {/* @ts-expect-error Only an uploading tile has progress. */}
      <FilePreview kind="audio" progress={0.4} />
      <SubmitButton aria-label="Save" size="icon" />
      {/* @ts-expect-error An icon-only button needs an aria-label. */}
      <SubmitButton size="icon" />
    </AdminForm>
  );
}
