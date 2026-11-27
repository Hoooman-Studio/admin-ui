import { CalendarIcon, ListChecksIcon, PlusIcon } from "lucide-react";
import * as React from "react";
import { z } from "zod";
import {
  Button,
  DialogBody,
  DialogFooter,
  DrawerBody,
  DrawerClose,
  DrawerFooter,
  FieldLegend,
  FieldSet,
  type FileKind,
  FilePreview,
  FormField,
  PageBody,
  PageHeader,
  PageSection,
  SegmentedControl,
  SegmentedControlItem,
} from "../../../src";
import {
  AdminForm,
  bindField,
  ChecklistField,
  DateField,
  type FieldProps,
  FileField,
  FormCheckboxField,
  FormDialog,
  FormDrawer,
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
import { required } from "../../../src/zod";

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
    coverId: z.string().nullable(),
    audioTourId: z.string().nullable(),
    videoId: z.string().nullable(),
    tags: z.array(z.string()),
    billing: z.enum(["monthly", "yearly"]),
    featured: z.boolean(),
    furnished: z.boolean(),
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

const loftPhoto = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400"><defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fde68a"/><stop offset="1" stop-color="#f97316"/></linearGradient></defs><rect width="640" height="400" fill="url(#sky)"/><circle cx="470" cy="130" r="54" fill="#fff7ed"/><path d="M0 300 L120 220 L230 290 L360 190 L520 300 L640 240 L640 400 L0 400 Z" fill="#7c2d12"/></svg>'
)}`;

const mdnMedia = "https://interactive-examples.mdn.mozilla.net/media";

/** The fake storage: each saved file's URL and name, by ID. Public-domain samples from MDN. */
const storage = new Map([
  ["photo_loft", { url: loftPhoto, name: "Loft.svg" }],
  [
    "audio_tour",
    { url: `${mdnMedia}/cc0-audio/t-rex-roar.mp3`, name: "Audio tour.mp3" },
  ],
  [
    "video_walkthrough",
    { url: `${mdnMedia}/cc0-videos/flower.mp4`, name: "Walkthrough.mp4" },
  ],
]);

/** Like an app's own component that loads a saved file's URL, say with Convex `useQuery`. */
function StoredFile({ id, kind }: { id: string; kind: FileKind }) {
  const [url, setUrl] = React.useState<string>();
  React.useEffect(() => {
    const timer = setTimeout(() => setUrl(storage.get(id)?.url), 500);
    return () => clearTimeout(timer);
  }, [id]);
  return <FilePreview kind={kind} name={storage.get(id)?.name} url={url} />;
}

/** Stands in for the app's upload, like an upload URL and XMLHttpRequest. A file with "fail" in its name fails halfway. */
function fakeUpload(file: File, onProgress: (fraction: number) => void) {
  return new Promise<string>((resolve, reject) => {
    let step = 0;
    const timer = setInterval(() => {
      step += 1;
      onProgress(step / 10);
      if (step === 5 && file.name.includes("fail")) {
        clearInterval(timer);
        reject(new Error("The storage server refused the file."));
      } else if (step === 10) {
        clearInterval(timer);
        const id = `file_${crypto.randomUUID()}`;
        storage.set(id, { url: URL.createObjectURL(file), name: file.name });
        resolve(id);
      }
    }, 300);
  });
}

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
  if (value.title.toLowerCase().includes("email")) {
    return {
      ok: true,
      message: `Saved ${value.title}.`,
      warning: "The owner wasn't emailed: their address bounced.",
    };
  }
  return { ok: true, message: `Saved ${value.title}.` };
}

const emptyListing: z.input<typeof listingSchema> = {
  title: "",
  status: "draft",
  rent: null,
  availableFrom: null,
  coverId: null,
  audioTourId: null,
  videoId: null,
  tags: [],
  billing: "monthly",
  featured: false,
  furnished: false,
  notes: "",
};

const sunnyLoft: z.input<typeof listingSchema> = {
  ...emptyListing,
  title: "Sunny loft by the Spree",
  rent: 1850,
  availableFrom: "2026-12-01",
  coverId: "photo_loft",
  audioTourId: "audio_tour",
  videoId: "video_walkthrough",
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
            description="Checked when you leave it. Try a title with “taken”, “crash” or “email”, or Live above €5,000."
            field={field}
            label="Title"
          />
        )}
      </form.Field>
      <form.Field name="coverId">
        {(field) => (
          <FileField
            accept="image/*"
            description="Uploads as soon as you pick it. Try a file with “fail” in its name."
            field={field}
            label="Cover photo"
            preview={(id) => <StoredFile id={id} kind="image" />}
            removable
            upload={fakeUpload}
          />
        )}
      </form.Field>
      <form.Field name="audioTourId">
        {(field) => (
          <FileField
            accept="audio/*"
            field={field}
            label="Audio tour"
            preview={(id) => <StoredFile id={id} kind="audio" />}
            removable
            upload={fakeUpload}
          />
        )}
      </form.Field>
      <form.Field name="videoId">
        {(field) => (
          <FileField
            accept="video/*"
            field={field}
            label="Video walkthrough"
            preview={(id) => <StoredFile id={id} kind="video" />}
            removable
            upload={fakeUpload}
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
      <form.Field name="furnished">
        {(field) => <FormCheckboxField field={field} label="Furnished" />}
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

const meetingPoints = [
  { value: "lobby", label: "Lobby" },
  { value: "garden", label: "Garden" },
  { value: "street", label: "Street" },
];

/** An app's own field, built like ours: bindField gives the error and a change that clears the server's error. */
function MeetingPointField({ field, label, description }: FieldProps<string>) {
  const { error, onChange } = bindField(
    field,
    (value: string | null) => value ?? field.state.value
  );
  return (
    <FormField description={description} error={error} label={label}>
      <SegmentedControl
        onBlur={field.handleBlur}
        onValueChange={onChange}
        value={field.state.value}
      >
        {meetingPoints.map((point) => (
          <SegmentedControlItem key={point.value} value={point.value}>
            {point.label}
          </SegmentedControlItem>
        ))}
      </SegmentedControl>
    </FormField>
  );
}

const viewingSchema = z.object({
  date: required(z.string(), "Choose a date."),
  meetingPoint: z.string(),
  guideId: z.string().nullable(),
  roomIds: z.array(z.string()).min(1, "Choose at least one room to show."),
  notes: z.string(),
});

const guides = [
  { value: "user_mira", label: "Mira Jansen" },
  { value: "user_tom", label: "Tom de Vries" },
];

const rooms = [
  { value: "room_living", label: "Living room" },
  { value: "room_kitchen", label: "Kitchen" },
  {
    value: "room_bedroom",
    label: "Bedroom",
    description: "Ask the tenant first.",
  },
  { value: "room_balcony", label: "Balcony" },
  { value: "room_storage", label: "Storage" },
];

async function saveViewing(
  value: z.output<typeof viewingSchema>
): Promise<FormResult> {
  await wait(800);
  const fieldErrors: Record<string, string> = {};
  if (value.guideId === "user_tom") {
    fieldErrors.guideId = "Tom is fully booked that week.";
  }
  if (value.meetingPoint === "garden") {
    fieldErrors.meetingPoint = "The garden is closed for the winter.";
  }
  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, fieldErrors };
  }
  const guide = value.guideId === null ? "without a guide" : "with a guide";
  return { ok: true, message: `Viewing planned ${guide}.` };
}

const newViewing: z.input<typeof viewingSchema> = {
  date: null,
  meetingPoint: "lobby",
  guideId: "user_mira",
  roomIds: ["room_living"],
  notes: "",
};

function PlanViewingForm() {
  const form = useAdminForm({
    defaultValues: newViewing,
    validators: { onSubmit: viewingSchema },
    onSubmit: saveViewing,
  });

  return (
    <AdminForm form={form}>
      <DrawerBody>
        <FieldSet>
          <FieldLegend>When</FieldLegend>
          <form.Field name="date">
            {(field) => <DateField field={field} label="Date" />}
          </form.Field>
          <form.Field name="meetingPoint">
            {(field) => (
              <MeetingPointField
                description="A custom field. Try Garden."
                field={field}
                label="Meeting point"
              />
            )}
          </form.Field>
        </FieldSet>
        <FieldSet>
          <FieldLegend>Who</FieldLegend>
          <form.Field name="guideId">
            {(field) => (
              <SelectField
                description="Try Tom, or Nobody."
                emptyLabel="Nobody"
                field={field}
                label="Guided by"
                options={guides}
              />
            )}
          </form.Field>
        </FieldSet>
        <FieldSet>
          <FieldLegend>What to show</FieldLegend>
          <form.Field name="roomIds">
            {(field) => (
              <ChecklistField field={field} label="Rooms" options={rooms} />
            )}
          </form.Field>
          <form.Field name="notes">
            {(field) => <TextareaField field={field} label="Notes" />}
          </form.Field>
        </FieldSet>
        <FormError />
      </DrawerBody>
      <DrawerFooter>
        <DrawerClose render={<Button variant="outline" />}>Cancel</DrawerClose>
        <SubmitButton>Plan viewing</SubmitButton>
      </DrawerFooter>
    </AdminForm>
  );
}

const amenities = [
  "Wi-Fi",
  "Heating",
  "Air conditioning",
  "Washing machine",
  "Dryer",
  "Dishwasher",
  "Oven",
  "Microwave",
  "Fridge",
  "Freezer",
  "Coffee machine",
  "TV",
  "Desk",
  "Bathtub",
  "Garden",
  "Balcony",
  "Lift",
  "Parking",
  "Bike storage",
  "Pets allowed",
].map((label) => ({ value: label.toLowerCase(), label }));

const amenitiesSchema = z.object({ amenities: z.array(z.string()) });

function AmenitiesForm() {
  const form = useAdminForm({
    defaultValues: { amenities: ["wi-fi", "heating"] },
    validators: { onSubmit: amenitiesSchema },
    onSubmit: async ({ amenities: chosen }) => {
      await wait(600);
      return { ok: true, message: `${chosen.length} amenities saved.` };
    },
  });

  return (
    <AdminForm form={form}>
      <DrawerBody>
        <form.Field name="amenities">
          {(field) => (
            <ChecklistField
              description="More than 8 options flow into columns."
              field={field}
              label="Amenities"
              options={amenities}
            />
          )}
        </form.Field>
      </DrawerBody>
      <DrawerFooter>
        <DrawerClose render={<Button variant="outline" />}>Cancel</DrawerClose>
        <SubmitButton>Save amenities</SubmitButton>
      </DrawerFooter>
    </AdminForm>
  );
}

function TypedFormsPage() {
  // Stands in for app state like a `?open=amenities` search param.
  const [amenitiesOpen, setAmenitiesOpen] = React.useState(false);
  return (
    <>
      <PageHeader
        actions={
          <>
            <Button onClick={() => setAmenitiesOpen(true)} variant="outline">
              <ListChecksIcon />
              Amenities
            </Button>
            <FormDrawer
              description="A controlled FormDrawer: the page holds its open state."
              onOpenChange={setAmenitiesOpen}
              open={amenitiesOpen}
              size="lg"
              title="Amenities"
            >
              <AmenitiesForm />
            </FormDrawer>
            <FormDrawer
              description="A FormDrawer: it starts fresh each time and closes once saved."
              title="Plan a viewing"
              trigger={
                <Button variant="outline">
                  <CalendarIcon />
                  Plan viewing
                </Button>
              }
            >
              <PlanViewingForm />
            </FormDrawer>
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
          </>
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
