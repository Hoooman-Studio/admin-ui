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
import { buttonVariants } from "./button";

type WithClass<T> = Omit<T, "className"> & { className?: string };

/** Holds the chosen files. Put a FileInputDropzone and a FileInputList inside. */
function FileInput({
  className,
  ...props
}: WithClass<React.ComponentProps<typeof FileInputPart>>) {
  return (
    <FileInputPart
      className={cn("flex w-full flex-col gap-2", className)}
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
function FileInputDropzone({
  className,
  children,
  title = "Drag files here",
  browseLabel = "Browse files",
  ...props
}: FileInputDropzoneProps) {
  return (
    <FileInputDropzonePart
      className={cn(
        "border-alpha/15 data-drag-accept:border-accent data-drag-accept:bg-accent/5 flex flex-col items-center gap-1 rounded-xl border border-dashed bg-gray-50 px-4 py-6 text-center transition-colors data-disabled:opacity-40 data-drag-reject:border-red-500/70 data-drag-reject:bg-red-500/5",
        className
      )}
      {...props}
    >
      <UploadIcon aria-hidden="true" className="mb-1 size-5 text-gray-500" />
      <p className="text-sm font-medium text-gray-950">{title}</p>
      {children ? <p className="text-sm text-gray-600">{children}</p> : null}
      <FileInputTrigger
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "mt-2 in-data-invalid:border-red-500/70"
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
  return (
    <FileInputListPart
      className={cn(
        "border-alpha/10 flex flex-col overflow-hidden rounded-xl border empty:hidden",
        className
      )}
      {...props}
    >
      <FileInputItem className="border-alpha/5 focus-visible:bg-alpha/5 flex h-11 items-center gap-3 border-b px-3 text-sm outline-none last:border-b-0">
        {({ file }) => (
          <>
            <FileIcon
              aria-hidden="true"
              className="size-4 shrink-0 text-gray-500"
            />
            <span className="min-w-0 flex-1 truncate font-medium text-gray-950">
              {file.name}
            </span>
            <span className="tabular shrink-0 text-gray-500">
              {formatFileSize(file.size)}
            </span>
            <FileInputItemRemove className="hover:bg-alpha/5 flex size-6 shrink-0 items-center justify-center rounded-md text-gray-500 hover:text-gray-950">
              <XIcon aria-hidden="true" className="size-4" />
            </FileInputItemRemove>
          </>
        )}
      </FileInputItem>
    </FileInputListPart>
  );
}

export { FileInput, FileInputDropzone, FileInputList };
