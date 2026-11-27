import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogContent as AlertDialogContent$1,
  AlertDialogDescription as AlertDialogDescription$1,
  AlertDialogTitle as AlertDialogTitle$1,
  AlertDialogTrigger,
} from "@ui-sdk/react/alert-dialog";
import { useAsyncOptions } from "@ui-sdk/react/async-options";
import { Button as Button$1 } from "@ui-sdk/react/button";
import {
  Checkbox as Checkbox$1,
  CheckboxGroup as CheckboxGroup$1,
} from "@ui-sdk/react/checkbox";
import {
  Combobox,
  ComboboxContent as ComboboxContent$1,
  ComboboxEmpty as ComboboxEmpty$1,
  ComboboxInput as ComboboxInput$1,
  ComboboxItem as ComboboxItem$1,
  ComboboxList,
  ComboboxProps,
  ComboboxStatus as ComboboxStatus$1,
} from "@ui-sdk/react/combobox";
import {
  Command as Command$1,
  CommandEmpty as CommandEmpty$1,
  CommandGroup as CommandGroup$1,
  CommandGroupLabel as CommandGroupLabel$1,
  CommandInput as CommandInput$1,
  CommandItem as CommandItem$1,
  CommandItemIcon as CommandItemIcon$1,
  CommandList as CommandList$1,
  CommandSeparator as CommandSeparator$1,
  CommandShortcut as CommandShortcut$1,
} from "@ui-sdk/react/command";
import { DatePicker as DatePicker$1 } from "@ui-sdk/react/date-picker";
import {
  Dialog as Dialog$1,
  DialogClose as DialogClose$1,
  DialogContent as DialogContent$1,
  DialogDescription as DialogDescription$1,
  DialogTitle as DialogTitle$1,
  DialogTrigger,
} from "@ui-sdk/react/dialog";
import {
  Drawer as Drawer$1,
  DrawerClose as DrawerClose$1,
  DrawerContent as DrawerContent$1,
  DrawerDescription as DrawerDescription$1,
  DrawerTitle as DrawerTitle$1,
  DrawerTrigger,
} from "@ui-sdk/react/drawer";
import {
  Field as Field$1,
  FieldDescription as FieldDescription$1,
  FieldError as FieldError$1,
  FieldGroup as FieldGroup$1,
  FieldLabel as FieldLabel$1,
  FieldLegend as FieldLegend$1,
  FieldSet as FieldSet$1,
} from "@ui-sdk/react/field";
import {
  FileInput as FileInput$1,
  FileInputDropzone as FileInputDropzone$1,
  FileInputList as FileInputList$1,
} from "@ui-sdk/react/file-input";
import {
  Input as Input$1,
  InputClear as InputClear$1,
  InputGroup as InputGroup$1,
} from "@ui-sdk/react/input";
import {
  Menu as Menu$1,
  MenuCheckboxItem as MenuCheckboxItem$1,
  MenuContent as MenuContent$1,
  MenuGroup,
  MenuGroupLabel as MenuGroupLabel$1,
  MenuItem as MenuItem$1,
  MenuRadioGroup,
  MenuRadioItem as MenuRadioItem$1,
  MenuSeparator as MenuSeparator$1,
  MenuSub,
  MenuSubContent as MenuSubContent$1,
  MenuSubTrigger as MenuSubTrigger$1,
  MenuTrigger,
} from "@ui-sdk/react/menu";
import { NumberInput as NumberInput$1 } from "@ui-sdk/react/number-input";
import {
  Popover as Popover$1,
  PopoverClose,
  PopoverContent as PopoverContent$1,
  PopoverDescription as PopoverDescription$1,
  PopoverTitle as PopoverTitle$1,
  PopoverTrigger,
} from "@ui-sdk/react/popover";
import { PartProps } from "@ui-sdk/react/primitive";
import { Progress as Progress$1 } from "@ui-sdk/react/progress";
import {
  Radio as Radio$1,
  RadioGroup as RadioGroup$1,
} from "@ui-sdk/react/radio";
import {
  SegmentedControl as SegmentedControl$1,
  SegmentedControlItem as SegmentedControlItem$1,
} from "@ui-sdk/react/segmented-control";
import {
  Select,
  SelectContent as SelectContent$1,
  SelectGroup as SelectGroup$1,
  SelectGroupLabel as SelectGroupLabel$1,
  SelectItem as SelectItem$1,
  SelectSeparator as SelectSeparator$1,
  SelectTrigger as SelectTrigger$1,
  SelectValue as SelectValue$1,
} from "@ui-sdk/react/select";
import { Separator as Separator$1 } from "@ui-sdk/react/separator";
import { Switch as Switch$1 } from "@ui-sdk/react/switch";
import {
  Tabs as Tabs$1,
  TabsList as TabsList$1,
  TabsPanel as TabsPanel$1,
  TabsTab as TabsTab$1,
} from "@ui-sdk/react/tabs";
import { Textarea as Textarea$1 } from "@ui-sdk/react/textarea";
import { toast } from "@ui-sdk/react/toast";
import {
  Tooltip,
  TooltipContent as TooltipContent$1,
  TooltipShortcut as TooltipShortcut$1,
  TooltipTrigger,
} from "@ui-sdk/react/tooltip";
import { VariantProps } from "class-variance-authority";
import * as React from "react";

interface AdminProviderProps {
  /** The client's brand colour, any CSS colour. */
  accent?: string;
  children: React.ReactNode;
  /** Spacing and layout for the admin's box on a site page, like `mt-8`. */
  className?: string;
}
/**
 * Sets up the admin. Put it in the admin's layout route, around every admin
 * page including login. Everything inside gets Hooman Studio's font, reset,
 * theme and accent, and the rest of the page is left alone. It shows what
 * `toast()` and `confirm()` ask for; a provider inside another leaves that to
 * the outer one. It's a block with the admin's background and text colour,
 * so admin pieces stay readable on a site page in either theme.
 */
declare function AdminProvider({
  accent,
  children,
  className,
}: AdminProviderProps): React.JSX.Element;
/**
 * What a form submit returns. `ok: false` keeps the form as typed: `message`
 * shows above the submit button and `fieldErrors` under their fields. Without
 * a `message`, an error for a field the form doesn't render shows above the
 * submit button instead.
 * `ok: true` shows `message` as a toast and closes a FormDialog. Its
 * `warning`, for a side effect that failed, shows as a toast that stays until
 * dismissed.
 */
type FormResult =
  | {
      ok: true;
      message?: string;
      warning?: string;
    }
  | {
      ok: false;
      message?: string;
      fieldErrors?: Record<string, string>;
    };
/** UI SDK parts accept `className` as a function of state; ours take a plain string merged with `cn`. */
type WithClass<T> = Omit<T, "className"> & {
  className?: string;
};
/** Like WithClass, for parts whose children could also be a function of state: ours take plain nodes. */
type WithNodeChildren<T> = Omit<WithClass<T>, "children"> & {
  children?: React.ReactNode;
};
/** The question, with its backdrop. Put an AlertDialogTitle, an AlertDialogDescription and an AlertDialogFooter inside. */
declare function AlertDialogContent({
  className,
  children,
  ...props
}: WithClass<
  React.ComponentProps<typeof AlertDialogContent$1>
>): React.JSX.Element;
declare function AlertDialogTitle({
  className,
  ...props
}: WithClass<
  React.ComponentProps<typeof AlertDialogTitle$1>
>): React.JSX.Element;
declare function AlertDialogDescription({
  className,
  ...props
}: WithClass<
  React.ComponentProps<typeof AlertDialogDescription$1>
>): React.JSX.Element;
/** The answers, side by side. Put Cancel first: it gets focus when the dialog opens. */
declare function AlertDialogFooter({
  className,
  ...props
}: React.ComponentProps<"div">): React.JSX.Element;
interface ConfirmOptions {
  /**
   * Runs when the person agrees, with the dialog open and the button pending.
   * `ok: false` keeps it open with `message` above the buttons; `ok: true`
   * closes it and shows `message` and `warning` as toasts. A thrown error is
   * logged and shown as a generic message.
   */
  action?: () => FormResult | void | Promise<FormResult | void>;
  cancelLabel?: string;
  /** The agreeing button's text. Defaults to "Confirm". */
  confirmLabel?: string;
  /** What agreeing does. */
  description?: React.ReactNode;
  /** The question, like "Delete this listing?". */
  title: string;
  /** `danger` makes the agreeing button red, for actions that delete or can't be undone. */
  tone?: "default" | "danger";
}
/**
 * Asks a question and resolves `true` when the person agrees. Works inside
 * AdminProvider, which shows the questions. Questions asked at once wait their turn.
 *
 * `await confirm({ title: "Delete this listing?", confirmLabel: "Delete", tone: "danger", action: remove })`
 */
declare function confirm(options: ConfirmOptions): Promise<boolean>;
declare const sizes$2: {
  sm: string;
  md: string;
  lg: string;
};
interface AvatarProps {
  className?: string;
  /** The person's or team's name: the image's alt text, and the initials while it loads or if it fails. */
  name: string;
  size?: keyof typeof sizes$2;
  src?: string | null;
}
/** A round picture of a person or team, with their initials as the fallback. */
declare function Avatar({
  name,
  src,
  size,
  className,
}: AvatarProps): import("react").JSX.Element;
declare const badgeVariants: (
  props?:
    | ({
        tone?:
          | "accent"
          | "danger"
          | "info"
          | "neutral"
          | "success"
          | "warning"
          | null
          | undefined;
      } & import("class-variance-authority/types").ClassProp)
    | undefined
) => string;
type BadgeProps = React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    /** A small dot before the text, for statuses like "Live". */
    dot?: boolean;
  };
/** A short label, like a status in a list: `<Badge tone="success" dot>Published</Badge>`. */
declare function Badge({
  className,
  tone,
  dot,
  children,
  ...props
}: BadgeProps): React.JSX.Element;
declare const tones: {
  info: {
    box: string;
    icon: React.JSX.Element;
  };
  success: {
    box: string;
    icon: React.JSX.Element;
  };
  warning: {
    box: string;
    icon: React.JSX.Element;
  };
  danger: {
    box: string;
    icon: React.JSX.Element;
  };
};
interface BannerProps {
  /** Usually a small Button, like "Retry" or "View report". */
  action?: React.ReactNode;
  className?: string;
  description?: React.ReactNode;
  title: React.ReactNode;
  tone?: keyof typeof tones;
}
/**
 * An inline message, like the result of an action: saved, refused, or partly done.
 * Screen readers announce it when it appears; `danger` interrupts.
 */
declare function Banner({
  tone,
  title,
  description,
  action,
  className,
}: BannerProps): React.JSX.Element;
declare const buttonVariants: (
  props?:
    | ({
        variant?:
          | "accent"
          | "danger"
          | "danger-subtle"
          | "ghost"
          | "outline"
          | "primary"
          | "subtle"
          | null
          | undefined;
        size?:
          | "icon"
          | "icon-lg"
          | "icon-sm"
          | "icon-xs"
          | "lg"
          | "md"
          | "sm"
          | "xs"
          | null
          | undefined;
        rounded?: boolean | null | undefined;
      } & import("class-variance-authority/types").ClassProp)
    | undefined
) => string;
type ButtonVariants = VariantProps<typeof buttonVariants>;
type ButtonSize = NonNullable<ButtonVariants["size"]>;
type IconSize = Extract<ButtonSize, `icon${string}`>;
type BaseProps = Omit<React.ComponentProps<typeof Button$1>, "className"> &
  Omit<ButtonVariants, "size"> & {
    className?: string;
    /** Disables the button, keeps it focusable and shows this in a tooltip. */
    disabledReason?: string;
  };
/** Icon-only buttons have no text, so the type requires an `aria-label`. */
type ButtonProps =
  | (BaseProps & {
      size?: Exclude<ButtonSize, IconSize>;
    })
  | (BaseProps & {
      size: IconSize;
      "aria-label": string;
    });
/**
 * A button, or a link through `render={<a href="…" />}`.
 * Return a Promise from `onClick` and it shows as pending until it settles.
 */
declare function Button({
  className,
  variant,
  size,
  rounded,
  children,
  disabled,
  focusableWhenDisabled,
  disabledReason,
  ...props
}: ButtonProps): React.JSX.Element;
declare const variants: {
  default: string;
  /** Rows split by hairlines, each padded: settings lists, recent items. */
  list: string;
  /** No padding, for content that brings its own: a List of ListRows, a DataTable. */
  flush: string;
};
type CardProps = React.ComponentProps<"section"> & {
  variant?: keyof typeof variants;
};
declare function Card({
  variant,
  className,
  ...props
}: CardProps): React.JSX.Element;
type CardHeaderProps = React.ComponentProps<"div"> & {
  actions?: React.ReactNode;
};
/** A CardTitle and CardDescription, with `actions` at the right. */
declare function CardHeader({
  actions,
  children,
  className,
  ...props
}: CardHeaderProps): React.JSX.Element;
declare function CardTitle({
  className,
  ...props
}: React.ComponentProps<"h3">): React.JSX.Element;
declare function CardDescription({
  className,
  ...props
}: React.ComponentProps<"p">): React.JSX.Element;
declare function CardFooter({
  className,
  ...props
}: React.ComponentProps<"div">): React.JSX.Element;
interface ChoiceFieldProps {
  className?: string;
  description?: React.ReactNode;
  disabled?: boolean;
  /** An error from your server or form library. Native constraint errors show on their own. */
  error?: string | null;
  label: React.ReactNode;
}
type CheckboxProps = Omit<
  React.ComponentProps<typeof Checkbox$1>,
  "className" | "children"
> & {
  className?: string;
};
/** A checkbox on its own. Name it with `aria-label`, or use CheckboxField for a visible label. */
declare function Checkbox({
  className,
  ...props
}: CheckboxProps): React.JSX.Element;
type CheckboxFieldProps = Omit<CheckboxProps, "disabled"> & ChoiceFieldProps;
/** A checkbox with its label, and an optional description, to the right of it. */
declare function CheckboxField({
  label,
  description,
  error,
  disabled,
  className,
  ...props
}: CheckboxFieldProps): React.JSX.Element;
/** Keeps the checked values of the CheckboxFields inside it in one array. */
declare function CheckboxGroup<T extends string = string>({
  className,
  ...props
}: Omit<React.ComponentProps<typeof CheckboxGroup$1<T>>, "className"> & {
  className?: string;
}): React.JSX.Element;
type ComboboxInputProps = WithClass<
  React.ComponentProps<typeof ComboboxInput$1>
> & {
  /** Names the chevron button that opens the list. */
  triggerLabel?: string;
};
/**
 * The search field, in a bordered box with a chevron that opens the list.
 * `className` goes on the box; other props go on the input.
 */
declare function ComboboxInput({
  className,
  triggerLabel,
  ...props
}: ComboboxInputProps): React.JSX.Element;
declare function ComboboxContent({
  className,
  sideOffset,
  collisionPadding,
  ...props
}: WithClass<
  React.ComponentProps<typeof ComboboxContent$1>
>): React.JSX.Element;
type ComboboxItemProps<T> = Omit<
  React.ComponentProps<typeof ComboboxItem$1<T>>,
  "className" | "children"
> & {
  className?: string;
  children?: React.ReactNode;
};
declare function ComboboxItem<T = string>({
  className,
  children,
  ...props
}: ComboboxItemProps<T>): React.JSX.Element;
/** Shows while no option matches the search. */
declare function ComboboxEmpty({
  className,
  ...props
}: WithClass<React.ComponentProps<typeof ComboboxEmpty$1>>): React.JSX.Element;
/** Loading, error and result-count messages, for async options. */
declare function ComboboxStatus({
  className,
  ...props
}: WithClass<React.ComponentProps<typeof ComboboxStatus$1>>): React.JSX.Element;
/** A search field over a list of commands. On its own, or in a CommandPalette. */
declare function Command({
  className,
  ...props
}: WithClass<React.ComponentProps<typeof Command$1>>): React.JSX.Element;
declare function CommandInput({
  className,
  ...props
}: WithClass<React.ComponentProps<typeof CommandInput$1>>): React.JSX.Element;
declare function CommandList({
  className,
  ...props
}: WithClass<React.ComponentProps<typeof CommandList$1>>): React.JSX.Element;
declare function CommandEmpty({
  className,
  ...props
}: WithClass<React.ComponentProps<typeof CommandEmpty$1>>): React.JSX.Element;
declare function CommandGroup({
  className,
  ...props
}: WithClass<React.ComponentProps<typeof CommandGroup$1>>): React.JSX.Element;
declare function CommandGroupLabel({
  className,
  ...props
}: WithClass<
  React.ComponentProps<typeof CommandGroupLabel$1>
>): React.JSX.Element;
declare function CommandItem({
  className,
  ...props
}: WithClass<React.ComponentProps<typeof CommandItem$1>>): React.JSX.Element;
declare function CommandItemIcon({
  className,
  ...props
}: WithClass<
  React.ComponentProps<typeof CommandItemIcon$1>
>): React.JSX.Element;
/** Shows the command's `shortcut`, like ⌘P. */
declare function CommandShortcut({
  className,
  ...props
}: WithClass<
  React.ComponentProps<typeof CommandShortcut$1>
>): React.JSX.Element;
declare function CommandSeparator({
  className,
  ...props
}: WithClass<
  React.ComponentProps<typeof CommandSeparator$1>
>): React.JSX.Element;
interface CommandPaletteProps {
  /** CommandGroups and CommandItems. Each item does its work in `onSelect`, like navigating; the palette closes after. */
  children: React.ReactNode;
  emptyText?: React.ReactNode;
  placeholder?: string;
  /** The palette's name for screen readers. */
  title?: string;
  /** What opens it besides ⌘K / Ctrl+K. Defaults to a "Search…" button showing the shortcut. */
  trigger?: React.ReactElement<Record<string, unknown>>;
}
/** A command palette in a dialog, opened with ⌘K / Ctrl+K from anywhere on the page or with its trigger. */
declare function CommandPalette({
  children,
  title,
  placeholder,
  emptyText,
  trigger,
}: CommandPaletteProps): React.JSX.Element;
type DatePickerProps = Omit<
  React.ComponentProps<typeof DatePicker$1>,
  "className" | "children"
> & {
  className?: string;
  /** Names the calendar button, which also reads out the chosen date. */
  triggerLabel?: string;
  /** Names the end input in range mode. The field's label names the start. */
  endLabel?: string;
};
/**
 * A date field: type a date in the page's language, or pick one from the
 * calendar popup. Values are ISO date strings like "2026-10-16".
 * `mode="range"` shows a start and an end input.
 */
declare function DatePicker({
  className,
  triggerLabel,
  endLabel,
  mode,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  ...props
}: DatePickerProps): React.JSX.Element;
/** Key/value rows for a record: `<DescriptionList><DescriptionItem label="Status">Live</DescriptionItem></DescriptionList>`. */
declare function DescriptionList({
  className,
  ...props
}: React.ComponentProps<"dl">): React.JSX.Element;
type DescriptionItemProps = React.ComponentProps<"div"> & {
  label: React.ReactNode;
  icon?: React.ReactNode;
};
/** One row. Narrow lists put the value at the right; wide ones give the label a column. */
declare function DescriptionItem({
  label,
  icon,
  children,
  className,
  ...props
}: DescriptionItemProps): React.JSX.Element;
/** Small touch screens get a bottom sheet; everything else a centered dialog. */
declare function Dialog(
  props: React.ComponentProps<typeof Dialog$1>
): React.JSX.Element;
type DialogContentProps = WithClass<
  React.ComponentProps<typeof DialogContent$1>
> & {
  /** Wider dialogs for forms with two columns or previews. */
  size?: "sm" | "md" | "lg";
};
/** The dialog's panel, with its backdrop. Put a DialogHeader, a DialogBody and a DialogFooter inside. */
declare function DialogContent({
  className,
  size,
  ...props
}: DialogContentProps): React.JSX.Element;
declare function DialogHeader({
  className,
  children,
  closeLabel,
  ...props
}: React.ComponentProps<"div"> & {
  closeLabel?: string | null;
}): React.JSX.Element;
declare function DialogTitle({
  className,
  ...props
}: WithClass<React.ComponentProps<typeof DialogTitle$1>>): React.JSX.Element;
declare function DialogDescription({
  className,
  ...props
}: WithClass<
  React.ComponentProps<typeof DialogDescription$1>
>): React.JSX.Element;
declare function DialogBody({
  className,
  ...props
}: React.ComponentProps<"div">): React.JSX.Element;
declare function DialogFooter({
  className,
  ...props
}: React.ComponentProps<"div">): React.JSX.Element;
/** Closes the dialog. Pass an `action` that returns a Promise and the dialog stays open, pending, until it resolves. */
declare function DialogClose(
  props: React.ComponentProps<typeof DialogClose$1>
): React.JSX.Element;
/** A side sheet. Opens from the right by default; pass `side="left"` for mobile navigation. */
declare function Drawer({
  side,
  ...props
}: React.ComponentProps<typeof Drawer$1>): React.JSX.Element;
declare const sizes$1: {
  sm: string;
  md: string;
  lg: string;
};
type DrawerContentProps = WithClass<
  React.ComponentProps<typeof DrawerContent$1>
> & {
  /** `md` fits record details; `lg` fits a wide edit form. */
  size?: keyof typeof sizes$1;
};
/** The sheet, with its backdrop. Put a DrawerHeader, a DrawerBody and a DrawerFooter inside. */
declare function DrawerContent({
  className,
  size,
  ...props
}: DrawerContentProps): React.JSX.Element;
declare function DrawerHeader({
  className,
  children,
  closeLabel,
  ...props
}: React.ComponentProps<"div"> & {
  closeLabel?: string | null;
}): React.JSX.Element;
declare function DrawerTitle({
  className,
  ...props
}: WithClass<React.ComponentProps<typeof DrawerTitle$1>>): React.JSX.Element;
declare function DrawerDescription({
  className,
  ...props
}: WithClass<
  React.ComponentProps<typeof DrawerDescription$1>
>): React.JSX.Element;
declare function DrawerBody({
  className,
  ...props
}: React.ComponentProps<"div">): React.JSX.Element;
declare function DrawerFooter({
  className,
  ...props
}: React.ComponentProps<"div">): React.JSX.Element;
/** Closes the drawer. Pass an `action` that returns a Promise and the drawer stays open, pending, until it resolves. */
declare function DrawerClose(
  props: React.ComponentProps<typeof DrawerClose$1>
): React.JSX.Element;
interface EmptyStateProps {
  /** Usually a Button, like "New listing". */
  action?: React.ReactNode;
  className?: string;
  description?: React.ReactNode;
  title: React.ReactNode;
}
/** What a list or page shows when there is nothing in it yet. */
declare function EmptyState({
  title,
  description,
  action,
  className,
}: EmptyStateProps): React.JSX.Element;
declare function Field({
  className,
  ...props
}: WithClass<React.ComponentProps<typeof Field$1>>): React.JSX.Element;
declare function FieldLabel({
  className,
  ...props
}: WithClass<React.ComponentProps<typeof FieldLabel$1>>): React.JSX.Element;
declare function FieldDescription({
  className,
  ...props
}: WithClass<
  React.ComponentProps<typeof FieldDescription$1>
>): React.JSX.Element;
declare function FieldError({
  className,
  ...props
}: WithClass<React.ComponentProps<typeof FieldError$1>>): React.JSX.Element;
declare function FieldSet({
  className,
  ...props
}: WithClass<React.ComponentProps<typeof FieldSet$1>>): React.JSX.Element;
declare function FieldLegend({
  className,
  ...props
}: WithClass<React.ComponentProps<typeof FieldLegend$1>>): React.JSX.Element;
declare function FieldGroup({
  className,
  ...props
}: WithClass<React.ComponentProps<typeof FieldGroup$1>>): React.JSX.Element;
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
declare function FormField({
  label,
  children,
  name,
  description,
  error,
  disabled,
  className,
}: FormFieldProps): React.JSX.Element;
/** Holds the chosen files. Put a FileInputDropzone and a FileInputList inside. */
declare function FileInput({
  className,
  ...props
}: WithClass<React.ComponentProps<typeof FileInput$1>>): React.JSX.Element;
type FileInputDropzoneProps = Omit<
  React.ComponentProps<typeof FileInputDropzone$1>,
  "className" | "children"
> & {
  className?: string;
  /** A hint under the title, like accepted types and the size limit. */
  children?: React.ReactNode;
  title?: React.ReactNode;
  browseLabel?: React.ReactNode;
};
/** Drop or paste files here, or press the button to browse. */
declare function FileInputDropzone({
  className,
  children,
  title,
  browseLabel,
  ...props
}: FileInputDropzoneProps): React.JSX.Element;
/** The chosen files, each with its size and a remove button. Name it with `aria-label`. */
declare function FileInputList({
  className,
  ...props
}: WithClass<
  Omit<React.ComponentProps<typeof FileInputList$1>, "children">
>): React.JSX.Element;
type InputProps = WithClass<React.ComponentProps<typeof Input$1>>;
declare function Input({ className, ...props }: InputProps): React.JSX.Element;
type InputGroupProps = WithClass<React.ComponentProps<typeof InputGroup$1>>;
/** An input with icons, text or a clear button around it: `<InputGroup><SearchIcon /><Input /><InputClear /></InputGroup>`. */
declare function InputGroup({
  className,
  ...props
}: InputGroupProps): React.JSX.Element;
type InputClearProps = Omit<
  React.ComponentProps<typeof InputClear$1>,
  "className"
> & {
  className?: string;
  "aria-label": string;
};
declare function InputClear({
  className,
  children,
  ...props
}: InputClearProps): React.JSX.Element;
/** A key on the keyboard, like `<Kbd>⌘</Kbd><Kbd>K</Kbd>`. */
declare function Kbd({
  className,
  ...props
}: React.ComponentProps<"kbd">): React.JSX.Element;
/** A link like `<a href="/listings/1" />` or your router's `<Link to="…" />`. Its text comes from the row. */
type RowLinkElement = React.ReactElement<{
  className?: string;
  children?: React.ReactNode;
}>;
/** A list of ListRows, with hairlines between them. Put it in a `Card variant="flush"` for a framed list. */
declare function List({
  className,
  ...props
}: React.ComponentProps<"ul">): React.JSX.Element;
type ListRowProps = Omit<React.ComponentProps<"li">, "title"> & {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /** An Avatar, or an icon or image in a square. */
  leading?: React.ReactNode;
  /** Quiet text at the end, like "2h ago". */
  meta?: React.ReactNode;
  /** Controls at the end, like a Menu. They stay clickable above the row's link. */
  actions?: React.ReactNode;
  /** Makes the whole row open this link: `<a href="/clients/1" />` or your router's `<Link />`. The title is its text. */
  link?: RowLinkElement;
  /** Shows the whole title and subtitle over several lines instead of cutting them off. */
  wrap?: boolean;
};
/**
 * The dashboard's list row: a leading avatar or square, a title and subtitle,
 * and meta or controls at the end. On narrow rows the end moves under the title.
 */
declare function ListRow({
  title,
  subtitle,
  leading,
  meta,
  actions,
  link,
  wrap,
  className,
  ...props
}: ListRowProps): React.JSX.Element;
declare const sizes: {
  sm: {
    dot: string;
    gap: string;
  };
  md: {
    dot: string;
    gap: string;
  };
  lg: {
    dot: string;
    gap: string;
  };
};
interface LoaderProps {
  className?: string;
  /** What screen readers hear. */
  label?: string;
  size?: keyof typeof sizes;
}
/** The Hooman Studio three-dot loader. */
declare function Loader({
  size,
  label,
  className,
}: LoaderProps): import("react").JSX.Element;
/** Small touch screens get a bottom sheet; everything else a dropdown. */
declare function Menu(
  props: React.ComponentProps<typeof Menu$1>
): React.JSX.Element;
declare function MenuContent({
  className,
  sideOffset,
  ...props
}: WithClass<React.ComponentProps<typeof MenuContent$1>>): React.JSX.Element;
type MenuItemProps = WithClass<React.ComponentProps<typeof MenuItem$1>> & {
  /** Disables the item and shows this under its label. */
  disabledReason?: string;
};
/** A command. Pass `destructive` for actions like Delete. */
declare function MenuItem({
  className,
  children,
  disabled,
  disabledReason,
  ...props
}: MenuItemProps): React.JSX.Element;
declare function MenuCheckboxItem({
  className,
  children,
  ...props
}: WithNodeChildren<
  React.ComponentProps<typeof MenuCheckboxItem$1>
>): React.JSX.Element;
declare function MenuRadioItem({
  className,
  children,
  ...props
}: WithNodeChildren<
  React.ComponentProps<typeof MenuRadioItem$1>
>): React.JSX.Element;
declare function MenuGroupLabel({
  className,
  ...props
}: WithClass<React.ComponentProps<typeof MenuGroupLabel$1>>): React.JSX.Element;
declare function MenuSeparator({
  className,
  ...props
}: WithClass<React.ComponentProps<typeof MenuSeparator$1>>): React.JSX.Element;
declare function MenuSubTrigger({
  className,
  children,
  ...props
}: WithNodeChildren<
  React.ComponentProps<typeof MenuSubTrigger$1>
>): React.JSX.Element;
declare function MenuSubContent({
  className,
  ...props
}: WithClass<React.ComponentProps<typeof MenuSubContent$1>>): React.JSX.Element;
interface RowMenuBaseProps {
  "aria-label": string;
  "aria-labelledby"?: string;
  /** MenuItems. */
  children: React.ReactNode;
  className?: string;
}
type RowMenuProps = Omit<RowMenuBaseProps, "aria-label" | "aria-labelledby"> & {
  /** The row's name. The button reads "Actions for {label}". */
  label: string;
};
/** The "…" button and menu for a row's actions, as in DataTable. Put it in a ListRow's `actions`. */
declare function RowMenu({ label, ...props }: RowMenuProps): React.JSX.Element;
interface NavSectionProps {
  children: React.ReactNode;
  className?: string;
  /** Starts closed when false. A collapsed rail always shows its items. */
  defaultOpen?: boolean;
  title: string;
}
/** A group of nav items under a small heading that opens and closes it. */
declare function NavSection({
  title,
  defaultOpen,
  children,
  className,
}: NavSectionProps): React.JSX.Element;
type NavItemProps = Omit<PartProps<"a">, "children" | "className"> & {
  /** Shown alone, with the label as a tooltip, when the rail is collapsed. */
  icon: React.ReactNode;
  label: string;
  /** A count or a Badge at the end of the row. Hidden in the collapsed rail. */
  count?: React.ReactNode;
  /** The current page. */
  active?: boolean;
  className?: string;
};
/**
 * A nav link. Pass `href`, or your router's link as `render={<Link to="/admin/clients" />}`.
 * Mark the current page `active`.
 */
declare function NavItem({
  icon,
  label,
  count,
  active,
  className,
  render,
  ...props
}: NavItemProps): React.JSX.Element;
type NumberInputProps = Omit<
  React.ComponentProps<typeof NumberInput$1>,
  "className" | "children"
> & {
  className?: string;
  placeholder?: string;
  /** Names the step buttons. */
  decrementLabel?: string;
  incrementLabel?: string;
};
/**
 * A number field with − and + buttons. Arrow keys step it too, and `format`
 * shows it as currency or percent. The value is a number, or null when empty.
 */
declare function NumberInput({
  className,
  placeholder,
  decrementLabel,
  incrementLabel,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  ...props
}: NumberInputProps): React.JSX.Element;
interface PaginationProps {
  className?: string;
  onPageChange: (page: number) => void;
  /** The current page, from 1. A page past the end reads as the last page. */
  page: number;
  pageSize: number;
  /** How many items there are in all, across pages. */
  total: number;
}
/** Pages through a list with a known total: "21–40 of 128", page numbers, and Previous and Next. */
declare function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  className,
}: PaginationProps): React.JSX.Element;
interface CursorPaginationProps {
  className?: string;
  hasNext: boolean;
  hasPrevious: boolean;
  onNext: () => void;
  onPrevious: () => void;
  /** Shown at the left, like "20 per page". */
  summary?: React.ReactNode;
}
/** Previous and Next for lists paged by cursor, which don't know their total (Convex, Stripe). */
declare function CursorPagination({
  hasPrevious,
  hasNext,
  onPrevious,
  onNext,
  summary,
  className,
}: CursorPaginationProps): React.JSX.Element;
/** Small touch screens get a bottom sheet; everything else a panel beside the trigger. */
declare function Popover(
  props: React.ComponentProps<typeof Popover$1>
): React.JSX.Element;
declare function PopoverContent({
  className,
  sideOffset,
  ...props
}: WithClass<React.ComponentProps<typeof PopoverContent$1>>): React.JSX.Element;
declare function PopoverTitle({
  className,
  ...props
}: WithClass<React.ComponentProps<typeof PopoverTitle$1>>): React.JSX.Element;
declare function PopoverDescription({
  className,
  ...props
}: WithClass<
  React.ComponentProps<typeof PopoverDescription$1>
>): React.JSX.Element;
type ProgressProps = WithClass<
  Omit<React.ComponentProps<typeof Progress$1>, "children">
> &
  (
    | {
        label: NonNullable<React.ReactNode>;
      }
    | {
        label?: undefined;
        "aria-label": string;
      }
  );
/** A bar for a task's progress, between `min` and `max` (0 and 100 by default). A `value` of null shows it under way without a value. */
declare function Progress({
  className,
  label,
  ...props
}: ProgressProps): React.JSX.Element;
type RadioGroupProps<T extends string> = Omit<
  React.ComponentProps<typeof RadioGroup$1<T>>,
  "className"
> & {
  className?: string;
};
/** Name it with a Field's FieldLabel around it, or `aria-label`. Put RadioFields inside. */
declare function RadioGroup<T extends string = string>({
  className,
  ...props
}: RadioGroupProps<T>): React.JSX.Element;
type RadioProps = Omit<
  React.ComponentProps<typeof Radio$1>,
  "className" | "children"
> & {
  className?: string;
};
declare function Radio({ className, ...props }: RadioProps): React.JSX.Element;
type RadioFieldProps = Omit<RadioProps, "disabled"> &
  Omit<ChoiceFieldProps, "error">;
/** One option of a RadioGroup, with its label and an optional description. */
declare function RadioField({
  label,
  description,
  disabled,
  className,
  ...props
}: RadioFieldProps): React.JSX.Element;
type SegmentedControlProps<T extends string> = Omit<
  React.ComponentProps<typeof SegmentedControl$1<T>>,
  "className" | "children"
> & {
  className?: string;
  children?: React.ReactNode;
};
/** Pick one of a few options, like Open / Archived / All filters. Name it with `aria-label` or a Field. */
declare function SegmentedControl<T extends string = string>({
  className,
  children,
  ...props
}: SegmentedControlProps<T>): React.JSX.Element;
declare function SegmentedControlItem({
  className,
  ...props
}: WithClass<
  React.ComponentProps<typeof SegmentedControlItem$1>
>): React.JSX.Element;
type SelectTriggerProps = WithNodeChildren<
  React.ComponentProps<typeof SelectTrigger$1>
>;
/** The button that opens the list. Shows the selected label (a SelectValue) unless you pass children. */
declare function SelectTrigger({
  className,
  children,
  ...props
}: SelectTriggerProps): React.JSX.Element;
declare function SelectValue({
  className,
  ...props
}: WithClass<React.ComponentProps<typeof SelectValue$1>>): React.JSX.Element;
declare function SelectContent({
  className,
  sideOffset,
  collisionPadding,
  ...props
}: WithClass<React.ComponentProps<typeof SelectContent$1>>): React.JSX.Element;
type SelectItemProps<T> = WithNodeChildren<
  React.ComponentProps<typeof SelectItem$1<T>>
>;
declare function SelectItem<T = string>({
  className,
  children,
  ...props
}: SelectItemProps<T>): React.JSX.Element;
declare function SelectGroup({
  className,
  ...props
}: WithClass<React.ComponentProps<typeof SelectGroup$1>>): React.JSX.Element;
declare function SelectGroupLabel({
  className,
  ...props
}: WithClass<
  React.ComponentProps<typeof SelectGroupLabel$1>
>): React.JSX.Element;
declare function SelectSeparator({
  className,
  ...props
}: WithClass<
  React.ComponentProps<typeof SelectSeparator$1>
>): React.JSX.Element;
/** A hairline between groups of content. Pass `decorative` when it's only visual. */
declare function Separator({
  className,
  ...props
}: WithClass<React.ComponentProps<typeof Separator$1>>): React.JSX.Element;
/** Which row moved, and the rows now on either side, for a "move after" or fractional index mutation. */
interface SortableMove<Row> {
  next: Row | null;
  previous: Row | null;
  row: Row;
}
type SortableListProps<Row> = Omit<React.ComponentProps<"ul">, "children"> & {
  rows: readonly Row[];
  getRowId: (row: Row) => string;
  /**
   * The rows in their new order, to save however you like. The list shows the
   * new order until `rows` comes back in a new order, or goes back if the returned promise rejects.
   */
  onReorder: (rows: Row[], move: SortableMove<Row>) => unknown;
  /** One SortableListRow per row. */
  children: (row: Row) => React.ReactNode;
};
/**
 * A short list people reorder by its grips: drag one, or focus it and press
 * Space, the arrows, then Space again. Put it in a `Card variant="flush"`.
 */
declare function SortableList<Row>({
  rows,
  getRowId,
  onReorder,
  children,
  className,
  ...props
}: SortableListProps<Row>): React.JSX.Element;
type SortableListRowProps = Omit<ListRowProps, "title"> & {
  /** Also names the grip for screen readers, so it's plain text. */
  title: string;
};
/** A ListRow with a grip at the start. Use inside SortableList. */
declare function SortableListRow({
  title,
  leading,
  className,
  ...props
}: SortableListRowProps): React.JSX.Element;
declare const trends: {
  up: {
    icon: import("lucide-react").LucideIcon;
    className: string;
  };
  down: {
    icon: import("lucide-react").LucideIcon;
    className: string;
  };
};
type StatCardProps = React.ComponentProps<"div"> & {
  label: React.ReactNode;
  value: React.ReactNode;
  /** The change, like "+12%". */
  change?: React.ReactNode;
  /** Up is green, down is red. Leave it out for a neutral change. */
  trend?: keyof typeof trends;
  /** What the change compares to, like "vs last month". */
  hint?: React.ReactNode;
};
/** One number on an overview, like bookings this month. */
declare function StatCard({
  label,
  value,
  change,
  trend,
  hint,
  className,
  ...props
}: StatCardProps): React.JSX.Element;
/** StatCards in a row of up to four, fewer on narrow pages. */
declare function StatGrid({
  className,
  ...props
}: React.ComponentProps<"div">): React.JSX.Element;
type SwitchProps = Omit<
  React.ComponentProps<typeof Switch$1>,
  "className" | "children"
> & {
  className?: string;
};
/** An on/off switch on its own. Name it with `aria-label`, or use SwitchField for a visible label. */
declare function Switch({
  className,
  ...props
}: SwitchProps): React.JSX.Element;
type SwitchFieldProps = Omit<SwitchProps, "disabled"> & ChoiceFieldProps;
/** A settings row: label and optional description, with the switch at the end. */
declare function SwitchField({
  label,
  description,
  error,
  disabled,
  className,
  ...props
}: SwitchFieldProps): React.JSX.Element;
declare function Tabs({
  className,
  ...props
}: WithClass<React.ComponentProps<typeof Tabs$1>>): React.JSX.Element;
/** The row of tabs, with a line under the selected one. Give it an `aria-label`. */
declare function TabsList({
  className,
  children,
  ...props
}: Omit<WithClass<React.ComponentProps<typeof TabsList$1>>, "children"> & {
  children?: React.ReactNode;
}): React.JSX.Element;
declare function TabsTab({
  className,
  ...props
}: WithClass<React.ComponentProps<typeof TabsTab$1>>): React.JSX.Element;
declare function TabsPanel({
  className,
  ...props
}: WithClass<React.ComponentProps<typeof TabsPanel$1>>): React.JSX.Element;
type TagInputProps = Pick<
  ComboboxProps<string, true>,
  | "value"
  | "defaultValue"
  | "onValueChange"
  | "name"
  | "form"
  | "disabled"
  | "readOnly"
  | "required"
> & {
  className?: string;
  placeholder?: string;
  /** Tags to suggest while typing. Any other text becomes a tag on Enter. */
  suggestions?: readonly string[];
};
/**
 * Free-form tags: type and press Enter to add one, Backspace in the empty
 * input or a chip's × to remove one. Values are the tag strings.
 */
declare function TagInput({
  className,
  placeholder,
  suggestions,
  ...props
}: TagInputProps): import("react").JSX.Element;
type TextareaProps = WithClass<React.ComponentProps<typeof Textarea$1>>;
declare function Textarea({
  className,
  ...props
}: TextareaProps): React.JSX.Element;
declare const themes: readonly ["system", "light", "dark"];
type Theme = (typeof themes)[number];
declare function setTheme(theme: Theme): void;
/** The stored theme choice, "system" until someone picks one. Shared by every caller. */
declare function useTheme(): {
  theme: "dark" | "light" | "system";
  setTheme: typeof setTheme;
};
/** The theme choice as menu items. AdminShell puts it in the account menu. */
declare function ThemeMenuItems(): React.JSX.Element;
/** The hint. To say why a Button is disabled, give it a `disabledReason` instead. */
declare function TooltipContent({
  className,
  ...props
}: WithClass<React.ComponentProps<typeof TooltipContent$1>>): React.JSX.Element;
/** Shows the tooltip's `shortcut` for this platform, like ⌘S or Ctrl+S. */
declare function TooltipShortcut({
  className,
  ...props
}: WithClass<
  React.ComponentProps<typeof TooltipShortcut$1>
>): React.JSX.Element;
type SortDirection = "asc" | "desc";
/** Which column a list is sorted by. `key` is the column's key. */
interface SortState {
  direction: SortDirection;
  key: string;
}
/**
 * The header bar of AdminShell. Compose it from its parts:
 * `<AdminHeader><AdminHeaderAccount … /><AdminHeaderTitle>Porta Europa</AdminHeaderTitle><AdminHeaderStudioLink /></AdminHeader>`.
 */
declare function AdminHeader({
  className,
  ...props
}: React.ComponentProps<"header">): React.JSX.Element;
interface AdminHeaderAccountProps {
  /** Menu items under the theme choice, like Profile and Sign out. */
  children?: React.ReactNode;
  email?: string;
  image?: string | null;
  name: string;
}
/** The signed-in user's avatar, opening the account menu with the theme choice and your items. */
declare function AdminHeaderAccount({
  name,
  email,
  image,
  children,
}: AdminHeaderAccountProps): React.JSX.Element;
/** The client's name, with the rail toggle before it, and on phones the button that opens the nav. Takes the free width. */
declare function AdminHeaderTitle({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element;
/** A cell for your own controls, like search or notifications. */
declare function AdminHeaderActions({
  className,
  ...props
}: React.ComponentProps<"div">): React.JSX.Element;
/** The Hooman mark, linking back to Hooman Studio. */
declare function AdminHeaderStudioLink({
  href,
}: {
  href?: string;
}): React.JSX.Element;
interface AdminShellProps {
  /** The page: a PageHeader, PageToolbar and PageBody. */
  children: React.ReactNode;
  className?: string;
  /** An AdminHeader with its parts, like AdminHeaderAccount, AdminHeaderTitle and AdminHeaderStudioLink. */
  header: React.ReactNode;
  /** NavSection and NavItem elements. */
  nav: React.ReactNode;
}
/**
 * The admin's frame: the header you compose, a nav rail that collapses to
 * icons (the choice is kept in localStorage) and the scrolling page. It covers
 * the viewport, whatever the site's body and wrappers do. On phones
 * the rail is a drawer opened from AdminHeaderTitle. A page that throws shows
 * an ErrorBoundary in its place. It must be inside AdminProvider.
 */
declare function AdminShell({
  header,
  nav,
  children,
  className,
}: AdminShellProps): React.JSX.Element;
/** Values a column can show without its own `cell`. */
type Shown = string | number | null | undefined;
type ShownKey<Row> = {
  [K in keyof Row & string]: Row[K] extends Shown ? K : never;
}[keyof Row & string];
declare const hideBelowClass: {
  sm: string;
  md: string;
  lg: string;
};
declare const alignClass: {
  start: string;
  center: string;
  end: string;
};
interface ColumnOptions {
  align?: keyof typeof alignClass;
  header: React.ReactNode;
  /** Hides the column while the table is narrower than sm (576px), md (768px) or lg (1024px). */
  hideBelow?: keyof typeof hideBelowClass;
  /** Shows a sort button in the header. Sorting itself is yours: `sort` and `onSortChange`, and `sortRows` for client data. */
  sortable?: boolean;
  /** A CSS width, like `"8rem"`. The first column takes the space that's left. */
  width?: string;
}
/**
 * A column. `key` names a field of the row, shown as is, or with its own `cell`
 * render; any other key needs a `cell`. The key is also what `sort.key` holds.
 */
type DataTableColumn<Row> =
  | (ColumnOptions & {
      key: ShownKey<Row>;
      cell?: (row: Row) => React.ReactNode;
    })
  | (ColumnOptions & {
      key: string;
      cell: (row: Row) => React.ReactNode;
    });
type SelectionProps =
  | {
      /** The ids of the selected rows, from `getRowId`. Ids on other pages stay selected. */
      selected: readonly string[];
      onSelectedChange: (ids: string[]) => void;
      /** Buttons for the bar that shows while rows are selected, like "Archive". */
      bulkActions?: React.ReactNode;
    }
  | {
      selected?: undefined;
      onSelectedChange?: undefined;
      bulkActions?: undefined;
    };
type DataTableProps<Row> = SelectionProps & {
  /** Names the table for screen readers, like "Listings". */
  "aria-label": string;
  className?: string;
  /** The first column names the row: it holds the row's link and labels its checkbox and menu. */
  columns: readonly DataTableColumn<NoInfer<Row>>[];
  /** Shown when there are no rows. Usually an EmptyState. */
  empty?: React.ReactNode;
  /** Shown instead of the rows when they couldn't load, like the error's message. */
  error?: React.ReactNode;
  getRowId: (row: Row) => string;
  onSortChange?: (sort: SortState | null) => void;
  /** MenuItems for the row's "…" menu. Return null for no menu. */
  rowActions?: (row: Row) => React.ReactNode;
  /** Makes the whole row open a link: `(row) => <a href={…} />` or your router's `<Link />`. */
  rowLink?: (row: Row) => RowLinkElement;
  /** The rows to show; `undefined` while they load. */
  rows: readonly Row[] | undefined;
  sort?: SortState | null;
  /** Where the header sticks, like `"4.75rem"` under a sticky PageHeader. */
  stickyTop?: string;
};
/**
 * A table of rows from your own data hook, styled like the dashboard's lists.
 * Sorting, selection and paging are controlled, so the same table works for client and server data.
 */
declare function DataTable<Row>({
  "aria-label": label,
  rows,
  columns,
  getRowId,
  sort,
  onSortChange,
  selected,
  onSelectedChange,
  bulkActions,
  rowLink,
  rowActions,
  empty,
  error,
  stickyTop,
  className,
}: DataTableProps<Row>): React.JSX.Element;
/**
 * Shows "Something went wrong" with "Try again" when its children throw while
 * rendering, so the rest of the admin keeps working. It tries again by itself
 * when the URL changes. AdminShell wraps the page in one.
 */
declare function ErrorBoundary({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element;
type FileKind = "image" | "video" | "audio" | "file";
type FilePreviewProps = {
  kind: FileKind;
  /** The file's URL. Leave it out while you load it, and the tile shows a loader. A `"file"` tile needs none. */
  url?: string;
  /** Shown on audio and file tiles, and read by screen readers. */
  name?: string;
  className?: string;
} & (
  | {
      status?: "ready";
      progress?: never;
    }
  | {
      status: "uploading";
      /** From 0 to 1, or null while unknown. */
      progress: number | null;
    }
  | {
      status: "error";
      progress?: never;
    }
);
/**
 * A file as a tile: an image thumbnail, a video that plays inline, a compact
 * audio player, or a file row with its type. Shows a loader while `url` is
 * missing, and the upload's progress or failure from `status`.
 */
declare function FilePreview({
  kind,
  url,
  name,
  className,
  ...state
}: FilePreviewProps): React.JSX.Element;
type SearchFieldProps = Omit<
  React.ComponentProps<typeof Input>,
  "type" | "className"
> & {
  className?: string;
  /** The field's name for screen readers. Defaults to the placeholder. */
  "aria-label"?: string;
};
/**
 * A search box for a PageToolbar, with a clear button. Control it with `value`
 * and `onValueChange`; for server search, debounce on your side (like `useDeferredValue`).
 */
declare function SearchField({
  className,
  placeholder,
  "aria-label": label,
  ...props
}: SearchFieldProps): React.JSX.Element;
interface FilterChipProps {
  className?: string;
  /** What the filter is, like "Status". */
  label: React.ReactNode;
  onRemove: () => void;
  /** Names the remove button, like "Remove Status filter". */
  removeLabel: string;
  /** The chosen value, like "Live". */
  value: React.ReactNode;
}
/** One active filter, with a button to remove it. */
declare function FilterChip({
  label,
  value,
  removeLabel,
  onRemove,
  className,
}: FilterChipProps): React.JSX.Element;
type FilterChipsProps = React.ComponentProps<"div"> & {
  /** Removes every filter. Shows a "Clear all" button. */
  onClear?: () => void;
};
/** The row of active FilterChips under a PageToolbar. Render it only while a filter is on. */
declare function FilterChips({
  onClear,
  children,
  className,
  ...props
}: FilterChipsProps): React.JSX.Element;
type PageHeaderProps = Omit<React.ComponentProps<"header">, "title"> & {
  title: React.ReactNode;
  /** Shown before the title, like "12 Listings". */
  count?: number;
  description?: React.ReactNode;
  /** A link back, like `<a href="/admin/listings" />` or your router's Link. Shows as an arrow button. */
  back?: React.ReactElement<Record<string, unknown>>;
  backLabel?: string;
  actions?: React.ReactNode;
};
/** The page's title bar, the same height as the shell's header. Stays on top while the page scrolls. */
declare function PageHeader({
  title,
  count,
  description,
  back,
  backLabel,
  actions,
  className,
  ...props
}: PageHeaderProps): React.JSX.Element;
type PageToolbarProps = React.ComponentProps<"div"> & {
  actions?: React.ReactNode;
};
/** The bar under the PageHeader for search, filters and view switches; `actions` sit at the right. */
declare function PageToolbar({
  actions,
  children,
  className,
  ...props
}: PageToolbarProps): React.JSX.Element;
declare const widths: {
  full: string;
  /** Forms and settings. */
  narrow: string;
};
type PageBodyProps = React.ComponentProps<"div"> & {
  width?: keyof typeof widths;
};
declare function PageBody({
  width,
  className,
  ...props
}: PageBodyProps): React.JSX.Element;
type PageSectionProps = Omit<React.ComponentProps<"section">, "title"> & {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
};
/** A titled part of a page, like "Recent bookings", with its actions beside the heading. */
declare function PageSection({
  title,
  description,
  actions,
  children,
  className,
  ...props
}: PageSectionProps): React.JSX.Element;
type DetailLayoutProps = React.ComponentProps<"div"> & {
  /** The side panel: key facts, status, related records. Moves under the main content on narrow pages. */
  side: React.ReactNode;
};
/** A record page: the main content beside a side panel. Put a PageBody in each. */
declare function DetailLayout({
  side,
  children,
  className,
  ...props
}: DetailLayoutProps): React.JSX.Element;

export {
  AdminHeader,
  AdminHeaderAccount,
  type AdminHeaderAccountProps,
  AdminHeaderActions,
  AdminHeaderStudioLink,
  AdminHeaderTitle,
  AdminProvider,
  type AdminProviderProps,
  AdminShell,
  type AdminShellProps,
  AlertDialog,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
  Avatar,
  type AvatarProps,
  Badge,
  type BadgeProps,
  Banner,
  type BannerProps,
  Button,
  type ButtonProps,
  buttonVariants,
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  type CardHeaderProps,
  type CardProps,
  CardTitle,
  Checkbox,
  CheckboxField,
  type CheckboxFieldProps,
  CheckboxGroup,
  type CheckboxProps,
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxStatus,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandItemIcon,
  CommandList,
  CommandPalette,
  type CommandPaletteProps,
  CommandSeparator,
  CommandShortcut,
  type ConfirmOptions,
  CursorPagination,
  type CursorPaginationProps,
  confirm,
  DataTable,
  type DataTableColumn,
  type DataTableProps,
  DatePicker,
  type DatePickerProps,
  DescriptionItem,
  type DescriptionItemProps,
  DescriptionList,
  DetailLayout,
  type DetailLayoutProps,
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  EmptyState,
  type EmptyStateProps,
  ErrorBoundary,
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FileInput,
  FileInputDropzone,
  FileInputList,
  type FileKind,
  FilePreview,
  type FilePreviewProps,
  FilterChip,
  type FilterChipProps,
  FilterChips,
  type FilterChipsProps,
  FormField,
  type FormFieldProps,
  Input,
  InputClear,
  InputGroup,
  Kbd,
  List,
  ListRow,
  type ListRowProps,
  Loader,
  type LoaderProps,
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  MenuTrigger,
  NavItem,
  type NavItemProps,
  NavSection,
  type NavSectionProps,
  NumberInput,
  type NumberInputProps,
  PageBody,
  type PageBodyProps,
  PageHeader,
  type PageHeaderProps,
  PageSection,
  type PageSectionProps,
  PageToolbar,
  type PageToolbarProps,
  Pagination,
  type PaginationProps,
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
  Progress,
  type ProgressProps,
  Radio,
  RadioField,
  type RadioFieldProps,
  RadioGroup,
  type RadioGroupProps,
  type RadioProps,
  type RowLinkElement,
  RowMenu,
  type RowMenuProps,
  SearchField,
  type SearchFieldProps,
  SegmentedControl,
  SegmentedControlItem,
  type SegmentedControlProps,
  Select,
  SelectContent,
  SelectGroup,
  SelectGroupLabel,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  Separator,
  SortableList,
  type SortableListProps,
  SortableListRow,
  type SortableListRowProps,
  type SortableMove,
  type SortDirection,
  type SortState,
  StatCard,
  type StatCardProps,
  StatGrid,
  Switch,
  SwitchField,
  type SwitchFieldProps,
  type SwitchProps,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
  TagInput,
  type TagInputProps,
  Textarea,
  type Theme,
  ThemeMenuItems,
  Tooltip,
  TooltipContent,
  TooltipShortcut,
  TooltipTrigger,
  toast,
  useAsyncOptions,
  useTheme,
};
