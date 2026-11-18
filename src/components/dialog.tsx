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
  "au:fixed au:inset-0 au:bg-black/40 au:transition-opacity au:duration-200 au:data-ending-style:opacity-0 au:data-starting-style:opacity-0";

const contentClass =
  "au:fixed au:inset-0 au:m-auto au:flex au:h-fit au:max-h-[calc(100dvh-2rem)] au:w-[calc(100%-2rem)] au:max-w-lg au:flex-col au:overflow-hidden au:rounded-2xl au:border au:border-alpha/5 au:bg-gray-50 au:p-0 au:text-gray-950 au:shadow-floating au:outline-none au:transition-[opacity,scale,translate] au:duration-200 au:ease-fluid au:data-ending-style:translate-y-2 au:data-starting-style:translate-y-2 au:data-ending-style:scale-[0.98] au:data-starting-style:scale-[0.98] au:data-ending-style:opacity-0 au:data-starting-style:opacity-0 au:data-[presentation=sheet]:inset-x-0 au:data-[presentation=sheet]:top-auto au:data-[presentation=sheet]:bottom-0 au:data-[presentation=sheet]:w-full au:data-[presentation=sheet]:max-w-none au:data-[presentation=sheet]:rounded-t-3xl au:data-[presentation=sheet]:rounded-b-none au:data-[presentation=sheet]:pb-[env(safe-area-inset-bottom)]";

type DialogContentProps = WithClass<
  React.ComponentProps<typeof DialogContentPart>
> & {
  /** Wider dialogs for forms with two columns or previews. */
  size?: "sm" | "md" | "lg";
};

const sizes = { sm: "au:max-w-sm", md: "au:max-w-lg", lg: "au:max-w-3xl" };

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
        "au:flex au:items-start au:justify-between au:gap-6 au:p-4 au:pb-2",
        className
      )}
      {...props}
    >
      <div className="au:flex au:min-w-0 au:flex-col au:gap-1">{children}</div>
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
      className={cn("au:text-lg au:font-semibold au:text-gray-950", className)}
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
      className={cn("au:text-sm au:text-gray-600", className)}
      {...props}
    />
  );
}

function DialogBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "au:flex au:min-h-0 au:flex-col au:gap-4 au:overflow-y-auto au:p-4 au:*:shrink-0",
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
        "au:border-alpha/5 au:flex au:flex-col-reverse au:gap-2 au:border-t au:p-4 au:sm:flex-row au:sm:justify-end",
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
  backdropClass,
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
