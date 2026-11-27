import {
  FileInputDropzone as FileInputDropzonePart,
  FileInputItem,
  FileInputItemRemove,
  FileInputList as FileInputListPart,
  FileInput as FileInputPart,
  FileInputTrigger,
  formatFileSize,
} from "@ui-sdk/react/file-input";
import { FileIcon, UploadIcon, XIcon } from "lucide-react";
import type * as React from "react";
import { cn } from "../lib/cn";
import type { WithClass } from "../lib/types";
import { buttonVariants } from "./button";
import { useMessages } from "./messages";

/** Holds the chosen files. Put a FileInputDropzone and a FileInputList inside. */
function FileInput({
  className,
  ...props
}: WithClass<React.ComponentProps<typeof FileInputPart>>) {
  return (
    <FileInputPart
      className={cn("au:flex au:w-full au:flex-col au:gap-2", className)}
      {...props}
    />
  );
}

type FileInputDropzoneProps = Omit<
  React.ComponentProps<typeof FileInputDropzonePart>,
  "className" | "children"
> & {
  className?: string;
  /** A hint under the title, like accepted types and the size limit. */
  children?: React.ReactNode;
  title?: React.ReactNode;
  browseLabel?: React.ReactNode;
};

/** Drop or paste files here, or press the button to browse. */
function FileInputDropzone(dropzoneProps: FileInputDropzoneProps) {
  const messages = useMessages();
  const {
    className,
    children,
    title = messages.dropFiles,
    browseLabel = messages.browseFiles,
    ...props
  } = dropzoneProps;
  return (
    <FileInputDropzonePart
      className={cn(
        "au:border-alpha/15 au:data-drag-accept:border-accent au:data-drag-accept:bg-accent/5 au:flex au:flex-col au:items-center au:gap-1 au:rounded-xl au:border au:border-dashed au:bg-gray-50 au:px-4 au:py-6 au:text-center au:transition-colors au:data-disabled:opacity-40 au:data-drag-reject:border-red-500/70 au:data-drag-reject:bg-red-500/5",
        className
      )}
      {...props}
    >
      <UploadIcon
        aria-hidden="true"
        className="au:mb-1 au:size-5 au:text-gray-500"
      />
      <p className="au:text-sm au:font-medium au:text-gray-950">{title}</p>
      {children ? (
        <p className="au:text-sm au:text-gray-600">{children}</p>
      ) : null}
      <FileInputTrigger
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "au:mt-2 au:in-data-invalid:border-red-500/70"
        )}
      >
        {browseLabel}
      </FileInputTrigger>
    </FileInputDropzonePart>
  );
}

/** The chosen files, each with its size and a remove button. Name it with `aria-label`. */
function FileInputList({
  className,
  ...props
}: WithClass<
  Omit<React.ComponentProps<typeof FileInputListPart>, "children">
>) {
  const messages = useMessages();
  return (
    <FileInputListPart
      className={cn(
        "au:border-alpha/10 au:flex au:flex-col au:overflow-hidden au:rounded-xl au:border au:empty:hidden",
        className
      )}
      {...props}
    >
      <FileInputItem className="au:border-alpha/5 au:focus-visible:bg-alpha/5 au:flex au:h-11 au:items-center au:gap-3 au:border-b au:px-3 au:text-sm au:outline-none au:last:border-b-0">
        {({ file }) => (
          <>
            <FileIcon
              aria-hidden="true"
              className="au:size-4 au:shrink-0 au:text-gray-500"
            />
            <span className="au:min-w-0 au:flex-1 au:truncate au:font-medium au:text-gray-950">
              {file.name}
            </span>
            <span className="au:tabular au:shrink-0 au:text-gray-500">
              {formatFileSize(file.size)}
            </span>
            <FileInputItemRemove
              aria-label={messages.removeItem({ name: file.name })}
              className="au:hover:bg-alpha/5 au:flex au:size-6 au:shrink-0 au:items-center au:justify-center au:rounded-md au:text-gray-500 au:hover:text-gray-950"
            >
              <XIcon aria-hidden="true" className="au:size-4" />
            </FileInputItemRemove>
          </>
        )}
      </FileInputItem>
    </FileInputListPart>
  );
}

// FileInputTrigger is for our own fields, like FileField; it isn't public.
export { FileInput, FileInputDropzone, FileInputList, FileInputTrigger };
