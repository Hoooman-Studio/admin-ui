import {
  ToastAction,
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
import type * as React from "react";
import { cn } from "../lib/cn";
import { buttonVariants } from "./button";

const icons = {
  success: <CircleCheckIcon className="text-green-500" />,
  error: <OctagonXIcon className="text-red-500" />,
  warning: <TriangleAlertIcon className="text-orange-500" />,
  info: <InfoIcon className="text-blue-500" />,
  loading: <LoaderCircleIcon className="animate-spin text-gray-600" />,
  default: null,
};

type ToasterProps = Omit<
  React.ComponentProps<typeof ToastRegion>,
  "children" | "className" | "toaster"
> & { className?: string };

/**
 * Shows the toasts `toast()` adds. Mount it once, near the app's root, then call
 * `toast.success("Listing saved")`, `toast.error(...)`, `toast.info(...)` or
 * `toast.promise(save(), { loading, success, error })` from anywhere.
 */
function Toaster({ className, side = "bottom", ...props }: ToasterProps) {
  return (
    <ToastRegion
      className={cn(
        "fixed inset-auto m-4 w-[22rem] max-w-[calc(100vw-2rem)] overflow-visible bg-transparent p-0 data-[align=center]:left-1/2 data-[align=center]:mx-0 data-[align=center]:-translate-x-1/2 data-[align=end]:right-0 data-[align=start]:left-0 data-[side=bottom]:bottom-0 data-[side=top]:top-0 *:data-[slot=toast-list]:flex *:data-[slot=toast-list]:flex-col *:data-[slot=toast-list]:gap-2 data-[side=bottom]:*:data-[slot=toast-list]:flex-col-reverse",
        className
      )}
      side={side}
      {...props}
    >
      {(data) => (
        <ToastPart className="border-alpha/10 flex translate-x-(--toast-swipe-x,0px) translate-y-(--toast-swipe-y,0px) items-start gap-3 rounded-2xl border bg-gray-50 p-4 text-gray-950 shadow-[0_12px_28px_-12px_rgba(0,0,0,0.2)] transition-[opacity,translate] duration-200 ease-out select-none data-ending-style:opacity-0 data-starting-style:translate-y-2 data-starting-style:opacity-0 data-swiping:transition-none motion-reduce:transition-opacity [&>svg]:mt-0.5 [&>svg]:size-4 [&>svg]:shrink-0">
          {icons[data.type ?? "default"]}
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <ToastTitle className="text-sm font-medium" />
            <ToastDescription className="text-sm text-gray-600" />
          </div>
          <ToastAction
            className={buttonVariants({ size: "sm", variant: "primary" })}
          />
        </ToastPart>
      )}
    </ToastRegion>
  );
}

export type { ToasterProps };
export { Toaster, toast };
