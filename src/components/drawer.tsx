import {
  DrawerBackdrop as DrawerBackdropPart,
  DrawerClose as DrawerClosePart,
  DrawerContent as DrawerContentPart,
  DrawerDescription as DrawerDescriptionPart,
  Drawer as DrawerPart,
  DrawerTitle as DrawerTitlePart,
  DrawerTrigger,
} from "@ui-sdk/react/drawer";
import { XIcon } from "lucide-react";
import type * as React from "react";
import { cn } from "../lib/cn";
import { Button } from "./button";

type WithClass<T> = Omit<T, "className"> & { className?: string };

/** A side sheet. Opens from the right by default; pass `side="left"` for mobile navigation. */
function Drawer({
  side = "right",
  ...props
}: React.ComponentProps<typeof DrawerPart>) {
  return <DrawerPart side={side} {...props} />;
}

const sizes = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-2xl",
};

type DrawerContentProps = WithClass<
  React.ComponentProps<typeof DrawerContentPart>
> & {
  /** `md` fits record details; `lg` fits a wide edit form. */
  size?: keyof typeof sizes;
};

/** The sheet, with its backdrop. Put a DrawerHeader, a DrawerBody and a DrawerFooter inside. */
function DrawerContent({
  className,
  size = "md",
  ...props
}: DrawerContentProps) {
  return (
    <>
      <DrawerBackdropPart className="fixed inset-0 bg-black/40" />
      <DrawerContentPart
        className={cn(
          "border-alpha/5 shadow-floating m-2 flex h-[calc(100dvh-1rem)] w-[calc(100vw-1rem)] flex-col overflow-hidden rounded-2xl border bg-gray-50 text-gray-950 outline-none",
          sizes[size],
          className
        )}
        {...props}
      />
    </>
  );
}

function DrawerHeader({
  className,
  children,
  closeLabel = "Close",
  ...props
}: React.ComponentProps<"div"> & { closeLabel?: string | null }) {
  return (
    <div
      className={cn(
        "border-alpha/5 flex items-start justify-between gap-6 border-b p-4",
        className
      )}
      {...props}
    >
      <div className="flex min-w-0 flex-col gap-1">{children}</div>
      {closeLabel === null ? null : (
        <DrawerClosePart
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

function DrawerTitle({
  className,
  ...props
}: WithClass<React.ComponentProps<typeof DrawerTitlePart>>) {
  return (
    <DrawerTitlePart
      className={cn("text-lg font-semibold text-gray-950", className)}
      {...props}
    />
  );
}

function DrawerDescription({
  className,
  ...props
}: WithClass<React.ComponentProps<typeof DrawerDescriptionPart>>) {
  return (
    <DrawerDescriptionPart
      className={cn("text-sm text-gray-600", className)}
      {...props}
    />
  );
}

function DrawerBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4",
        className
      )}
      {...props}
    />
  );
}

function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
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

/** Closes the drawer. Pass an `action` that returns a Promise and the drawer stays open, pending, until it resolves. */
function DrawerClose(props: React.ComponentProps<typeof DrawerClosePart>) {
  return <DrawerClosePart {...props} />;
}

export {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
};
