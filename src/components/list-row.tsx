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
  "au:[&_:is(a,button,input,label,select,textarea,[role=button],[role=checkbox]):not([data-slot=row-link])]:relative au:[&_:is(a,button,input,label,select,textarea,[role=button],[role=checkbox]):not([data-slot=row-link])]:z-10";

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
      "au:focus-visible:after:ring-accent au:outline-none au:after:absolute au:after:inset-0 au:after:content-[''] au:focus-visible:after:ring-2 au:focus-visible:after:ring-inset",
      link.props.className
    ),
    "data-slot": "row-link",
    children,
  } as Partial<RowLinkElement["props"]>);
}

/** A list of ListRows, with hairlines between them. Put it in a `Card variant="flush"` for a framed list. */
function List({ className, ...props }: React.ComponentProps<"ul">) {
  return <ul className={cn("au:flex au:flex-col", className)} {...props} />;
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
  /** Shows the whole title and subtitle over several lines instead of cutting them off. */
  wrap?: boolean;
};

/**
 * The dashboard's list row: a leading avatar or square, a title and subtitle,
 * and meta or controls at the end. On narrow rows the end moves under the title.
 */
function ListRow({
  title,
  subtitle,
  leading,
  meta,
  actions,
  link,
  wrap = false,
  className,
  ...props
}: ListRowProps) {
  const text = wrap ? "au:wrap-break-word" : "au:truncate";
  return (
    <li
      className={cn(
        "au:@container/list-row au:border-alpha/5 au:hover:bg-alpha/2 au:relative au:flex au:min-h-19 au:items-center au:gap-4 au:not-first:border-t au:px-4 au:py-3 au:transition-colors au:duration-100 au:sm:gap-5 au:sm:px-6",
        aboveRowLink,
        className
      )}
      {...props}
    >
      {leading ? <div className="au:flex au:shrink-0">{leading}</div> : null}
      <div className="au:flex au:min-w-0 au:flex-1 au:flex-col au:gap-x-4 au:gap-y-2 au:sm:gap-x-5 au:@sm/list-row:flex-row au:@sm/list-row:items-center">
        <div className="au:flex au:min-w-0 au:flex-1 au:flex-col">
          <span
            className={cn(
              "au:text-base au:font-semibold au:text-gray-950",
              text
            )}
          >
            <RowLink link={link}>{title}</RowLink>
          </span>
          {subtitle ? (
            <span
              className={cn("au:text-sm au:font-medium au:text-gray-500", text)}
            >
              {subtitle}
            </span>
          ) : null}
        </div>
        {meta || actions ? (
          <div className="au:flex au:shrink-0 au:items-center au:gap-x-4 au:sm:gap-x-5">
            {meta ? (
              <span className="au:tabular au:text-sm au:font-medium au:text-gray-500">
                {meta}
              </span>
            ) : null}
            {actions ? (
              <div className="au:flex au:items-center au:gap-2">{actions}</div>
            ) : null}
          </div>
        ) : null}
      </div>
    </li>
  );
}

export type { ListRowProps, RowLinkElement };
export { aboveRowLink, List, ListRow, RowLink };
