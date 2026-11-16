import {
  CircleCheckIcon,
  InfoIcon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import type * as React from "react";
import { cn } from "../lib/cn";

const tones = {
  info: {
    box: "border-blue-500/20 bg-blue-500/5",
    icon: <InfoIcon className="text-blue-500" />,
  },
  success: {
    box: "border-green-500/20 bg-green-500/5",
    icon: <CircleCheckIcon className="text-green-500" />,
  },
  warning: {
    box: "border-orange-500/20 bg-orange-500/5",
    icon: <TriangleAlertIcon className="text-orange-500" />,
  },
  danger: {
    box: "border-red-500/20 bg-red-500/5",
    icon: <OctagonXIcon className="text-red-500" />,
  },
};

interface BannerProps {
  /** Usually a small Button, like "Retry" or "View report". */
  action?: React.ReactNode;
  className?: string;
  description?: React.ReactNode;
  title: React.ReactNode;
  tone?: keyof typeof tones;
}

/**
 * An inline message, like the result of an action: saved, refused, or partly done.
 * Screen readers announce it when it appears; `danger` interrupts.
 */
function Banner({
  tone = "info",
  title,
  description,
  action,
  className,
}: BannerProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border p-3 sm:flex-row sm:items-center [&_svg]:size-4 [&_svg]:shrink-0",
        tones[tone].box,
        className
      )}
      role={tone === "danger" ? "alert" : "status"}
    >
      <div className="flex min-w-0 flex-1 gap-3">
        <span className="mt-0.5">{tones[tone].icon}</span>
        <div className="flex min-w-0 flex-col gap-0.5">
          <p className="text-sm font-medium text-gray-950">{title}</p>
          {description ? (
            <div className="text-sm text-gray-600">{description}</div>
          ) : null}
        </div>
      </div>
      {action ? (
        <div className="flex shrink-0 gap-2 pl-7 sm:pl-0">{action}</div>
      ) : null}
    </div>
  );
}

export type { BannerProps };
export { Banner };
