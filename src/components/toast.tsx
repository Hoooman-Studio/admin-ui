import {
  ToastAction,
  ToastClose,
  ToastDescription,
  Toast as ToastPart,
  ToastRegion,
  ToastTitle,
  toast,
} from "@ui-sdk/react/toast";
import {
  CircleCheckIcon,
  InfoIcon,
  LoaderCircleIcon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import type { FormResult } from "../lib/form-result";
import { buttonVariants } from "./button";

const icons = {
  success: <CircleCheckIcon className="au:text-green-500" />,
  error: <OctagonXIcon className="au:text-red-500" />,
  warning: <TriangleAlertIcon className="au:text-orange-500" />,
  info: <InfoIcon className="au:text-blue-500" />,
  loading: <LoaderCircleIcon className="au:animate-spin au:text-gray-600" />,
  default: null,
};

/**
 * Shows the toasts `toast()` adds. AdminProvider mounts it, so call
 * `toast.success("Listing saved")`, `toast.error(...)`, `toast.info(...)` or
 * `toast.promise(save(), { loading, success, error })` from anywhere inside.
 */
function Toaster() {
  return (
    <ToastRegion
      align="center"
      className="au:fixed au:inset-auto au:top-0 au:left-1/2 au:m-4 au:mx-0 au:w-[22rem] au:max-w-[calc(100vw-2rem)] au:-translate-x-1/2 au:overflow-visible au:bg-transparent au:p-0 au:*:data-[slot=toast-list]:flex au:*:data-[slot=toast-list]:flex-col au:*:data-[slot=toast-list]:gap-2"
      side="top"
    >
      {(data) => (
        <ToastPart className="au:border-alpha/10 au:flex au:translate-x-(--toast-swipe-x,0px) au:translate-y-(--toast-swipe-y,0px) au:items-start au:gap-3 au:rounded-2xl au:border au:bg-gray-50 au:p-4 au:text-gray-950 au:shadow-[0_12px_28px_-12px_rgba(0,0,0,0.2)] au:transition-[opacity,translate] au:duration-200 au:ease-out au:select-none au:data-ending-style:opacity-0 au:data-starting-style:-translate-y-2 au:data-starting-style:opacity-0 au:data-swiping:transition-none au:motion-reduce:transition-opacity au:[&>svg]:mt-0.5 au:[&>svg]:size-4 au:[&>svg]:shrink-0">
          {icons[data.type ?? "default"]}
          <div className="au:flex au:min-w-0 au:flex-1 au:flex-col au:gap-0.5">
            <ToastTitle className="au:text-sm au:font-medium" />
            <ToastDescription className="au:text-sm au:text-gray-600" />
          </div>
          {data.cancel ? (
            <ToastClose
              action={data.cancel.onCancel}
              className={buttonVariants({ size: "sm", variant: "subtle" })}
            >
              {data.cancel.label}
            </ToastClose>
          ) : null}
          <ToastAction
            className={buttonVariants({ size: "sm", variant: "primary" })}
          />
        </ToastPart>
      )}
    </ToastRegion>
  );
}

/** Shows a done FormResult: `message` as a success toast, `warning` as a warning toast that stays until dismissed. */
function toastDone({ message, warning }: Extract<FormResult, { ok: true }>) {
  if (message) {
    toast.success(message);
  }
  if (warning) {
    toast.warning(warning, {
      duration: Number.POSITIVE_INFINITY,
      cancel: { label: "Dismiss" },
    });
  }
}

export { Toaster, toast, toastDone };
