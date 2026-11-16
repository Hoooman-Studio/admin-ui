import type * as React from "react";
import { cn } from "../lib/cn";

/** Key/value rows for a record: `<DescriptionList><DescriptionItem label="Status">Live</DescriptionItem></DescriptionList>`. */
function DescriptionList({ className, ...props }: React.ComponentProps<"dl">) {
  return (
    <dl
      className={cn(
        "divide-alpha/5 @container/description-list flex flex-col divide-y",
        className
      )}
      {...props}
    />
  );
}

type DescriptionItemProps = React.ComponentProps<"div"> & {
  label: React.ReactNode;
  icon?: React.ReactNode;
};

/** One row. Narrow lists put the value at the right; wide ones give the label a column. */
function DescriptionItem({
  label,
  icon,
  children,
  className,
  ...props
}: DescriptionItemProps) {
  return (
    <div
      className={cn(
        "flex min-h-14 items-center justify-between gap-4 py-3 @lg/description-list:justify-start",
        className
      )}
      {...props}
    >
      <dt className="flex shrink-0 items-center gap-3 text-sm font-medium text-gray-600 @lg/description-list:w-40 [&_svg]:size-4 [&_svg]:opacity-40">
        {icon}
        {label}
      </dt>
      <dd className="min-w-0 text-right text-sm font-medium text-gray-950 @lg/description-list:text-left">
        {children}
      </dd>
    </div>
  );
}

export type { DescriptionItemProps };
export { DescriptionItem, DescriptionList };
