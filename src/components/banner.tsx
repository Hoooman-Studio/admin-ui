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
    box: "au:border-blue-500/20 au:bg-blue-500/5",
    icon: <InfoIcon className="au:text-blue-500" />,
  },
  success: {
    box: "au:border-green-500/20 au:bg-green-500/5",
    icon: <CircleCheckIcon className="au:text-green-500" />,
  },
  warning: {
    box: "au:border-orange-500/20 au:bg-orange-500/5",
    icon: <TriangleAlertIcon className="au:text-orange-500" />,
  },
  danger: {
    box: "au:border-red-500/20 au:bg-red-500/5",
    icon: <OctagonXIcon className="au:text-red-500" />,
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
        "au:flex au:flex-col au:gap-3 au:rounded-xl au:border au:p-3 au:sm:flex-row au:sm:items-center au:[&_svg]:size-4 au:[&_svg]:shrink-0",
        tones[tone].box,
        className
      )}
      role={tone === "danger" ? "alert" : "status"}
    >
      <div className="au:flex au:min-w-0 au:flex-1 au:gap-3">
        <span className="au:mt-0.5">{tones[tone].icon}</span>
        <div className="au:flex au:min-w-0 au:flex-col au:gap-0.5">
          <p className="au:text-sm au:font-medium au:text-gray-950">{title}</p>
          {description ? (
            <div className="au:text-sm au:text-gray-600">{description}</div>
          ) : null}
        </div>
      </div>
      {action ? (
        <div className="au:flex au:shrink-0 au:gap-2 au:pl-7 au:sm:pl-0">
          {action}
        </div>
      ) : null}
    </div>
  );
}

export type { BannerProps };
export { Banner };
