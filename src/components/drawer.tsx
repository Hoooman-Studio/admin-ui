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
import type { WithClass } from "../lib/types";
import { Button } from "./button";

/** A side sheet. Opens from the right by default; pass `side="left"` for mobile navigation. */
function Drawer({
  side = "right",
  ...props
}: React.ComponentProps<typeof DrawerPart>) {
  return <DrawerPart side={side} {...props} />;
}

const sizes = {
  sm: "au:max-w-sm",
  md: "au:max-w-md",
  lg: "au:max-w-2xl",
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
      <DrawerBackdropPart className="au:fixed au:inset-0 au:bg-black/40" />
      <DrawerContentPart
        className={cn(
          "au:border-alpha/5 au:shadow-floating au:m-2 au:flex au:h-[calc(100dvh-1rem)] au:w-[calc(100vw-1rem)] au:flex-col au:overflow-hidden au:rounded-2xl au:border au:bg-gray-50 au:text-gray-950 au:outline-none",
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
        "au:border-alpha/5 au:flex au:items-start au:justify-between au:gap-6 au:border-b au:p-4",
        className
      )}
      {...props}
    >
      <div className="au:flex au:min-w-0 au:flex-col au:gap-1">{children}</div>
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
      className={cn("au:text-lg au:font-semibold au:text-gray-950", className)}
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
      className={cn("au:text-sm au:text-gray-600", className)}
      {...props}
    />
  );
}

function DrawerBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "au:flex au:min-h-0 au:flex-1 au:flex-col au:gap-4 au:overflow-y-auto au:p-4",
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
        "au:border-alpha/5 au:flex au:flex-col-reverse au:gap-2 au:border-t au:p-4 au:sm:flex-row au:sm:justify-end",
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
