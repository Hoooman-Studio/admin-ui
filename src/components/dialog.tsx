import {
  DialogBackdrop as DialogBackdropPart,
  DialogClose as DialogClosePart,
  DialogContent as DialogContentPart,
  DialogDescription as DialogDescriptionPart,
  Dialog as DialogPart,
  DialogTitle as DialogTitlePart,
  DialogTrigger,
} from "@ui-sdk/react/dialog";
import { XIcon } from "lucide-react";
import type * as React from "react";
import { cn } from "../lib/cn";
import type { WithClass } from "../lib/types";
import { Button } from "./button";

/** Small touch screens get a bottom sheet; everything else a centered dialog. */
function Dialog(props: React.ComponentProps<typeof DialogPart>) {
  return <DialogPart presentation="auto" {...props} />;
}

const backdropClass =
  "fixed inset-0 bg-black/40 transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0";

const contentClass =
  "fixed inset-0 m-auto flex h-fit max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg flex-col overflow-hidden rounded-2xl border border-alpha/5 bg-gray-50 p-0 text-gray-950 shadow-floating outline-none transition-[opacity,scale,translate] duration-200 ease-fluid data-ending-style:translate-y-2 data-starting-style:translate-y-2 data-ending-style:scale-[0.98] data-starting-style:scale-[0.98] data-ending-style:opacity-0 data-starting-style:opacity-0 data-[presentation=sheet]:inset-x-0 data-[presentation=sheet]:top-auto data-[presentation=sheet]:bottom-0 data-[presentation=sheet]:w-full data-[presentation=sheet]:max-w-none data-[presentation=sheet]:rounded-t-3xl data-[presentation=sheet]:rounded-b-none data-[presentation=sheet]:pb-[env(safe-area-inset-bottom)]";

type DialogContentProps = WithClass<
  React.ComponentProps<typeof DialogContentPart>
> & {
  /** Wider dialogs for forms with two columns or previews. */
  size?: "sm" | "md" | "lg";
};

const sizes = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-3xl" };

/** The dialog's panel, with its backdrop. Put a DialogHeader, a DialogBody and a DialogFooter inside. */
function DialogContent({
  className,
  size = "md",
  ...props
}: DialogContentProps) {
  return (
    <>
      <DialogBackdropPart className={backdropClass} />
      <DialogContentPart
        className={cn(contentClass, sizes[size], className)}
        {...props}
      />
    </>
  );
}

function DialogHeader({
  className,
  children,
  closeLabel = "Close",
  ...props
}: React.ComponentProps<"div"> & { closeLabel?: string | null }) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-6 p-4 pb-2",
        className
      )}
      {...props}
    >
      <div className="flex min-w-0 flex-col gap-1">{children}</div>
      {closeLabel === null ? null : (
        <DialogClosePart
          render={
            <Button aria-label={closeLabel} size="icon-sm" variant="outline">
              <XIcon />
            </Button>
          }
        />
      )}
    </div>
  );
}

function DialogTitle({
  className,
  ...props
}: WithClass<React.ComponentProps<typeof DialogTitlePart>>) {
  return (
    <DialogTitlePart
      className={cn("text-lg font-semibold text-gray-950", className)}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: WithClass<React.ComponentProps<typeof DialogDescriptionPart>>) {
  return (
    <DialogDescriptionPart
      className={cn("text-sm text-gray-600", className)}
      {...props}
    />
  );
}

function DialogBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex min-h-0 flex-col gap-4 overflow-y-auto p-4",
        className
      )}
      {...props}
    />
  );
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "border-alpha/5 flex flex-col-reverse gap-2 border-t p-4 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  );
}

/** Closes the dialog. Pass an `action` that returns a Promise and the dialog stays open, pending, until it resolves. */
function DialogClose(props: React.ComponentProps<typeof DialogClosePart>) {
  return <DialogClosePart {...props} />;
}

export {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
};
