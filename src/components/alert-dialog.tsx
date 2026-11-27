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
import * as React from "react";
import { cn } from "../lib/cn";
import { type FormResult, failedMessage } from "../lib/form-result";
import type { WithClass } from "../lib/types";
import { Banner } from "./banner";
import { Button } from "./button";
import { backdropClass } from "./dialog";
import { toast } from "./toast";

const contentClass =
  "au:fixed au:inset-0 au:m-auto au:flex au:h-fit au:max-h-[calc(100dvh-2rem)] au:w-[calc(100%-2rem)] au:max-w-sm au:flex-col au:overflow-hidden au:rounded-3xl au:border au:border-alpha/10 au:bg-gray-50 au:p-0 au:text-center au:text-gray-950 au:shadow-floating au:outline-none au:transition-[opacity,scale,translate] au:duration-200 au:ease-fluid au:data-ending-style:translate-y-2 au:data-starting-style:translate-y-2 au:data-ending-style:scale-[0.98] au:data-starting-style:scale-[0.98] au:data-ending-style:opacity-0 au:data-starting-style:opacity-0";

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
      className={cn(
        "au:px-5 au:pt-8 au:text-lg au:font-semibold au:text-gray-950",
        className
      )}
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
      className={cn(
        "au:px-5 au:pt-2 au:text-sm au:font-medium au:text-gray-600",
        className
      )}
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
        "au:border-alpha/5 au:mt-8 au:flex au:gap-3 au:border-t au:p-5 au:*:flex-1",
        className
      )}
      {...props}
    />
  );
}

interface ConfirmOptions {
  /**
   * Runs when the person agrees, with the dialog open and the button pending.
   * `ok: false` keeps it open with `message` above the buttons; `ok: true`
   * closes it and shows `message` as a toast. A thrown error is logged and
   * shown as a generic message.
   */
  // biome-ignore lint/suspicious/noConfusingVoidType: an action may return nothing.
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

const ask = createConfirm<ConfirmOptions>();

/**
 * Asks a question and resolves `true` when the person agrees. Works inside
 * AdminProvider, which shows the questions. Questions asked at once wait their turn.
 *
 * `await confirm({ title: "Delete this listing?", confirmLabel: "Delete", tone: "danger", action: remove })`
 */
function confirm(options: ConfirmOptions): Promise<boolean> {
  return ask(options);
}

/** Shows the questions `confirm()` asks. AdminProvider mounts it. */
function ConfirmDialog() {
  const [refusal, setRefusal] = React.useState<string | null>(null);
  const clearRefusal = React.useCallback(() => setRefusal(null), []);

  const run = (action: NonNullable<ConfirmOptions["action"]>) => async () => {
    setRefusal(null);
    let result: FormResult | undefined;
    try {
      result = (await action()) ?? undefined;
    } catch (error) {
      console.error(error);
      result = { ok: false };
    }
    if (result?.ok === false) {
      const message = result.message ?? failedMessage;
      setRefusal(message);
      throw new Error(message);
    }
    if (result?.message) {
      toast.success(result.message);
    }
  };

  return (
    <AlertDialog controller={ask.controller} onOpenChange={clearRefusal}>
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
            {refusal ? (
              <Banner
                className="au:mx-5 au:mt-6 au:text-left"
                title={refusal}
                tone="danger"
              />
            ) : null}
            <AlertDialogFooter>
              <AlertDialogClose render={<Button size="lg" variant="subtle" />}>
                {payload?.cancelLabel ?? "Cancel"}
              </AlertDialogClose>
              <AlertDialogClose
                action={payload?.action ? run(payload.action) : undefined}
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
