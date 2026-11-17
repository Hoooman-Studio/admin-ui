import { PlusIcon } from "lucide-react";
import { z } from "zod";
import {
  Button,
  DialogBody,
  DialogFooter,
  PageBody,
  PageHeader,
  PageSection,
} from "../../../src";
import {
  AdminForm,
  DateField,
  FormDialog,
  FormError,
  type FormResult,
  FormSwitchField,
  NumberField,
  RadioGroupField,
  SelectField,
  SubmitButton,
  TagsField,
  TextareaField,
  TextField,
  useAdminForm,
} from "../../../src/form";
import { required } from "../../../src/lib/required";

const titleSchema = z.string().min(3, "Use at least 3 characters.");

const listingSchema = z
  .object({
    title: titleSchema,
    status: z.enum(["draft", "live"], "Choose a status."),
    rent: required(
      z.number().int().positive("Rent must be above 0."),
      "Enter the rent."
    ),
    availableFrom: required(z.string(), "Choose a date."),
    tags: z.array(z.string()),
    billing: z.enum(["monthly", "yearly"]),
    featured: z.boolean(),
    notes: z.string(),
  })
  .refine((listing) => !listing.featured || listing.tags.length > 0, {
    message: "Featured listings need at least one tag.",
  });

type Listing = z.output<typeof listingSchema>;

const statusOptions = [
  { value: "draft", label: "Draft" },
  { value: "live", label: "Live" },
] as const;

const billingOptions = [
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly", description: "Two months free." },
] as const;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Stands in for the app's backend, like a Convex mutation. */
async function saveListing(value: Listing): Promise<FormResult> {
  await wait(800);
  if (value.title.toLowerCase().includes("taken")) {
    return {
      ok: false,
      message: "The listing wasn't saved.",
      fieldErrors: { title: "Another listing already uses this title." },
    };
  }
  if (value.title.toLowerCase().includes("crash")) {
    throw new Error("The backend crashed.");
  }
  if (value.status === "live" && value.rent > 5000) {
    return {
      ok: false,
      message: "Listings above €5,000 need a manager's approval to go live.",
    };
  }
  return { ok: true, message: `Saved ${value.title}.` };
}

const emptyListing: z.input<typeof listingSchema> = {
  title: "",
  status: "draft",
  rent: null,
  availableFrom: null,
  tags: [],
  billing: "monthly",
  featured: false,
  notes: "",
};

const sunnyLoft: z.input<typeof listingSchema> = {
  ...emptyListing,
  title: "Sunny loft by the Spree",
  rent: 1850,
  availableFrom: "2026-12-01",
  tags: ["balcony"],
};

function EditListingForm() {
  const form = useAdminForm({
    defaultValues: sunnyLoft,
    validators: { onSubmit: listingSchema },
    onSubmit: saveListing,
  });

  return (
    <AdminForm form={form}>
      <form.Field name="title" validators={{ onBlur: titleSchema }}>
        {(field) => (
          <TextField
            description="Checked when you leave it. Try a title with “taken” or “crash”, or Live above €5,000."
            field={field}
            label="Title"
          />
        )}
      </form.Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <form.Field name="status">
          {(field) => (
            <SelectField field={field} label="Status" options={statusOptions} />
          )}
        </form.Field>
        <form.Field name="rent">
          {(field) => (
            <NumberField
              field={field}
              format={{ style: "currency", currency: "EUR" }}
              label="Monthly rent"
            />
          )}
        </form.Field>
      </div>
      <form.Field name="availableFrom">
        {(field) => <DateField field={field} label="Available from" />}
      </form.Field>
      <form.Field name="tags">
        {(field) => (
          <TagsField
            field={field}
            label="Tags"
            suggestions={["balcony", "garden", "pets allowed"]}
          />
        )}
      </form.Field>
      <form.Field name="billing">
        {(field) => (
          <RadioGroupField
            field={field}
            label="Billing"
            options={billingOptions}
          />
        )}
      </form.Field>
      <form.Field name="featured">
        {(field) => (
          <FormSwitchField
            description="Shown first on the homepage."
            field={field}
            label="Featured"
          />
        )}
      </form.Field>
      <form.Field name="notes">
        {(field) => <TextareaField field={field} label="Internal notes" />}
      </form.Field>
      <FormError />
      <div>
        <SubmitButton>Save listing</SubmitButton>
      </div>
    </AdminForm>
  );
}

function NewListingForm() {
  const form = useAdminForm({
    defaultValues: emptyListing,
    validators: { onSubmit: listingSchema },
    onSubmit: saveListing,
  });

  return (
    <AdminForm form={form}>
      <DialogBody>
        <form.Field name="title">
          {(field) => <TextField autoFocus field={field} label="Title" />}
        </form.Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <form.Field name="status">
            {(field) => (
              <SelectField
                field={field}
                label="Status"
                options={statusOptions}
                placeholder="Choose a status"
              />
            )}
          </form.Field>
          <form.Field name="rent">
            {(field) => (
              <NumberField
                field={field}
                format={{ style: "currency", currency: "EUR" }}
                label="Monthly rent"
              />
            )}
          </form.Field>
        </div>
        <form.Field name="availableFrom">
          {(field) => <DateField field={field} label="Available from" />}
        </form.Field>
        <FormError />
      </DialogBody>
      <DialogFooter>
        <SubmitButton>Create listing</SubmitButton>
      </DialogFooter>
    </AdminForm>
  );
}

function TypedFormsPage() {
  return (
    <>
      <PageHeader
        actions={
          <FormDialog
            description="It starts empty each time it opens, and closes once saved."
            title="New listing"
            trigger={
              <Button variant="accent">
                <PlusIcon />
                New listing
              </Button>
            }
          >
            <NewListingForm />
          </FormDialog>
        }
        title="Typed forms"
      />
      <PageBody width="narrow">
        <PageSection
          description="useAdminForm with a Zod schema. The save receives the schema's output and returns ok or refused."
          title="Edit listing"
        >
          <EditListingForm />
        </PageSection>
      </PageBody>
    </>
  );
}

export { TypedFormsPage };
