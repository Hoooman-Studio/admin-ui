import * as React from "react";
import { cn } from "../lib/cn";

/** A link like `<a href="/listings/1" />` or your router's `<Link to="…" />`. Its text comes from the row. */
type RowLinkElement = React.ReactElement<{
  className?: string;
  children?: React.ReactNode;
}>;

/**
 * Lifts the controls inside a row (buttons, links, checkboxes) above its
 * stretched link, so they stay clickable.
 */
const aboveRowLink =
  "[&_:is(a,button,input,label,select,textarea,[role=button],[role=checkbox]):not([data-slot=row-link])]:relative [&_:is(a,button,input,label,select,textarea,[role=button],[role=checkbox]):not([data-slot=row-link])]:z-10";

/**
 * Wraps `children` in the row's link. The link's `::after` covers the nearest
 * positioned ancestor, the row, so a click anywhere on the row opens it.
 */
function RowLink({
  link,
  children,
}: {
  link: RowLinkElement | undefined;
  children: React.ReactNode;
}) {
  if (!link) {
    return children;
  }
  return React.cloneElement(link, {
    className: cn(
      "focus-visible:after:ring-accent outline-none after:absolute after:inset-0 after:content-[''] focus-visible:after:ring-2 focus-visible:after:ring-inset",
      link.props.className
    ),
    "data-slot": "row-link",
    children,
  } as Partial<RowLinkElement["props"]>);
}

/** A list of ListRows. */
function List({ className, ...props }: React.ComponentProps<"ul">) {
  return <ul className={cn("flex flex-col", className)} {...props} />;
}

type ListRowProps = Omit<React.ComponentProps<"li">, "title"> & {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /** An Avatar, or an icon or image in a square. */
  leading?: React.ReactNode;
  /** Quiet text at the end, like "2h ago". */
  meta?: React.ReactNode;
  /** Controls at the end, like a Menu. They stay clickable above the row's link. */
  actions?: React.ReactNode;
  /** Makes the whole row open this link: `<a href="/clients/1" />` or your router's `<Link />`. The title is its text. */
  link?: RowLinkElement;
};

/** The dashboard's list row: a leading avatar or square, a title and subtitle, and meta or controls at the end. */
function ListRow({
  title,
  subtitle,
  leading,
  meta,
  actions,
  link,
  className,
  ...props
}: ListRowProps) {
  return (
    <li
      className={cn(
        "border-alpha/5 hover:bg-alpha/2 relative flex min-h-19 items-center gap-4 border-t px-4 py-3 transition-colors duration-100 sm:gap-5 sm:px-6",
        aboveRowLink,
        className
      )}
      {...props}
    >
      {leading ? <div className="flex shrink-0">{leading}</div> : null}
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-base font-semibold text-gray-950">
          <RowLink link={link}>{title}</RowLink>
        </span>
        {subtitle ? (
          <span className="truncate text-sm font-medium text-gray-500">
            {subtitle}
          </span>
        ) : null}
      </div>
      {meta ? (
        <span className="tabular shrink-0 text-sm font-medium text-gray-500">
          {meta}
        </span>
      ) : null}
      {actions ? (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      ) : null}
    </li>
  );
}

export type { ListRowProps, RowLinkElement };
export { aboveRowLink, List, ListRow, RowLink };
