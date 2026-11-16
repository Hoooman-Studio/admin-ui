import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogClose,
  AlertDialogContent as AlertDialogContentPart,
  AlertDialogDescription as AlertDialogDescriptionPart,
  AlertDialogTitle as AlertDialogTitlePart,
  AlertDialogTrigger,
  createConfirm,
} from "@ui-sdk/react/alert-dialog";
import type * as React from "react";
import { cn } from "../lib/cn";
import type { WithClass } from "../lib/types";
import { Button } from "./button";

const backdropClass =
  "fixed inset-0 bg-black/40 transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0";

const contentClass =
  "fixed inset-0 m-auto flex h-fit max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-sm flex-col overflow-hidden rounded-3xl border border-alpha/10 bg-gray-50 p-0 text-center text-gray-950 shadow-floating outline-none transition-[opacity,scale,translate] duration-200 ease-fluid data-ending-style:translate-y-2 data-starting-style:translate-y-2 data-ending-style:scale-[0.98] data-starting-style:scale-[0.98] data-ending-style:opacity-0 data-starting-style:opacity-0";

/** The question, with its backdrop. Put an AlertDialogTitle, an AlertDialogDescription and an AlertDialogFooter inside. */
function AlertDialogContent({
  className,
  children,
  ...props
}: WithClass<React.ComponentProps<typeof AlertDialogContentPart>>) {
  return (
    <>
      <AlertDialogBackdrop className={backdropClass} />
      <AlertDialogContentPart
        className={cn(contentClass, className)}
        {...props}
      >
        {children}
      </AlertDialogContentPart>
    </>
  );
}

function AlertDialogTitle({
  className,
  ...props
}: WithClass<React.ComponentProps<typeof AlertDialogTitlePart>>) {
  return (
    <AlertDialogTitlePart
      className={cn("px-5 pt-8 text-lg font-semibold text-gray-950", className)}
      {...props}
    />
  );
}

function AlertDialogDescription({
  className,
  ...props
}: WithClass<React.ComponentProps<typeof AlertDialogDescriptionPart>>) {
  return (
    <AlertDialogDescriptionPart
      className={cn("px-5 pt-2 text-sm font-medium text-gray-600", className)}
      {...props}
    />
  );
}

/** The answers, side by side. Put Cancel first: it gets focus when the dialog opens. */
function AlertDialogFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "border-alpha/5 mt-8 flex gap-3 border-t p-5 *:flex-1",
        className
      )}
      {...props}
    />
  );
}

interface ConfirmOptions {
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

const ask = createConfirm<ConfirmOptions>();

/**
 * Asks a question and resolves `true` when the person agrees. Needs one
 * `<ConfirmDialog />` mounted near the app's root. Questions asked at once wait their turn.
 *
 * `if (await confirm({ title: "Delete this listing?", confirmLabel: "Delete", tone: "danger" })) remove()`
 */
function confirm(options: ConfirmOptions): Promise<boolean> {
  return ask(options);
}

/** Shows the questions `confirm()` asks. Mount it once, near the app's root. */
function ConfirmDialog() {
  return (
    <AlertDialog controller={ask.controller}>
      <AlertDialogBackdrop className={backdropClass} />
      <AlertDialogContentPart<ConfirmOptions> className={contentClass}>
        {({ payload }) => (
          <>
            <AlertDialogTitle>{payload?.title}</AlertDialogTitle>
            {payload?.description ? (
              <AlertDialogDescription>
                {payload.description}
              </AlertDialogDescription>
            ) : null}
            <AlertDialogFooter>
              <AlertDialogClose render={<Button size="lg" variant="subtle" />}>
                {payload?.cancelLabel ?? "Cancel"}
              </AlertDialogClose>
              <AlertDialogClose
                render={
                  <Button
                    size="lg"
                    variant={payload?.tone === "danger" ? "danger" : "primary"}
                  />
                }
                value="confirm"
              >
                {payload?.confirmLabel ?? "Confirm"}
              </AlertDialogClose>
            </AlertDialogFooter>
          </>
        )}
      </AlertDialogContentPart>
    </AlertDialog>
  );
}

export type { ConfirmOptions };
export {
  AlertDialog,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
  ConfirmDialog,
  confirm,
};
