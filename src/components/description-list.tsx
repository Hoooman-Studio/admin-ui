import type * as React from "react";
import { cn } from "../lib/cn";

/** Key/value rows for a record: `<DescriptionList><DescriptionItem label="Status">Live</DescriptionItem></DescriptionList>`. */
function DescriptionList({ className, ...props }: React.ComponentProps<"dl">) {
  return (
    <dl
      className={cn(
        "au:@container/description-list au:flex au:flex-col au:[&>*+*]:border-t au:[&>*+*]:border-alpha/5",
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
        "au:flex au:min-h-14 au:items-center au:justify-between au:gap-4 au:py-3 au:@lg/description-list:justify-start",
        className
      )}
      {...props}
    >
      <dt className="au:flex au:shrink-0 au:items-center au:gap-3 au:text-sm au:font-medium au:text-gray-600 au:@lg/description-list:w-40 au:[&_svg]:size-4 au:[&_svg]:opacity-40">
        {icon}
        {label}
      </dt>
      <dd className="au:min-w-0 au:text-right au:text-sm au:font-medium au:text-gray-950 au:@lg/description-list:text-left">
        {children}
      </dd>
    </div>
  );
}

export type { DescriptionItemProps };
export { DescriptionItem, DescriptionList };
