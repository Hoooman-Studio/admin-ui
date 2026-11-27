import {
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationList,
  PaginationNext,
  Pagination as PaginationPart,
  PaginationPrevious,
} from "@ui-sdk/react/pagination";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import type * as React from "react";
import { cn } from "../lib/cn";
import { pageBounds } from "../lib/paging";
import { Button, buttonVariants } from "./button";
import { useMessages } from "./messages";

const barClass =
  "au:@container/pagination au:flex au:min-h-14 au:items-center au:justify-between au:gap-4 au:px-4 au:sm:px-6";

const summaryClass = "au:tabular au:text-sm au:font-medium au:text-gray-500";

const stepClass = cn(
  buttonVariants({ variant: "ghost", size: "icon" }),
  "au:data-disabled:cursor-default au:data-disabled:bg-transparent"
);

interface PaginationProps {
  className?: string;
  onPageChange: (page: number) => void;
  /** The current page, from 1. A page past the end reads as the last page. */
  page: number;
  pageSize: number;
  /** How many items there are in all, across pages. */
  total: number;
}

/** Pages through a list with a known total: "21–40 of 128", page numbers, and Previous and Next. */
function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  className,
}: PaginationProps) {
  const messages = useMessages();
  const { first, last } = pageBounds(page, pageSize, total);
  return (
    <div className={cn(barClass, className)}>
      <p className={summaryClass}>
        {messages.pageRange({ first, last, total })}
      </p>
      <PaginationPart
        aria-label={messages.pagination}
        onPageChange={onPageChange}
        page={page}
        pageSize={pageSize}
        total={total}
      >
        <PaginationList className="au:flex au:items-center au:gap-1">
          {({ items }) => (
            <>
              <PaginationItem>
                <PaginationPrevious
                  aria-label={messages.previousPage}
                  className={stepClass}
                >
                  <ChevronLeftIcon aria-hidden="true" />
                </PaginationPrevious>
              </PaginationItem>
              {items.map((item) => (
                <PaginationItem
                  className="au:hidden au:@md/pagination:block"
                  key={item}
                >
                  {typeof item === "number" ? (
                    <PaginationLink
                      className="au:tabular au:focus-visible:outline-accent au:hover:bg-alpha/5 au:data-current:bg-alpha/5 au:flex au:h-8 au:min-w-8 au:items-center au:justify-center au:rounded-lg au:px-2 au:text-sm au:font-medium au:text-gray-600 au:transition-colors au:duration-100 au:focus-visible:outline-2 au:focus-visible:outline-offset-2 au:data-current:text-gray-950"
                      page={item}
                    />
                  ) : (
                    <PaginationEllipsis className="au:flex au:h-8 au:min-w-8 au:items-center au:justify-center au:text-sm au:text-gray-500" />
                  )}
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  aria-label={messages.nextPage}
                  className={stepClass}
                >
                  <ChevronRightIcon aria-hidden="true" />
                </PaginationNext>
              </PaginationItem>
            </>
          )}
        </PaginationList>
      </PaginationPart>
    </div>
  );
}

interface CursorPaginationProps {
  className?: string;
  hasNext: boolean;
  hasPrevious: boolean;
  onNext: () => void;
  onPrevious: () => void;
  /** Shown at the left, like "20 per page". */
  summary?: React.ReactNode;
}

/** Previous and Next for lists paged by cursor, which don't know their total (Convex, Stripe). */
function CursorPagination({
  hasPrevious,
  hasNext,
  onPrevious,
  onNext,
  summary,
  className,
}: CursorPaginationProps) {
  const messages = useMessages();
  return (
    <div className={cn(barClass, className)}>
      <p className={summaryClass}>{summary}</p>
      <nav
        aria-label={messages.pagination}
        className="au:flex au:items-center au:gap-2"
      >
        <Button
          disabled={!hasPrevious}
          focusableWhenDisabled
          onClick={onPrevious}
          size="sm"
          variant="outline"
        >
          <ChevronLeftIcon aria-hidden="true" />
          {messages.previous}
        </Button>
        <Button
          disabled={!hasNext}
          focusableWhenDisabled
          onClick={onNext}
          size="sm"
          variant="outline"
        >
          {messages.next}
          <ChevronRightIcon aria-hidden="true" />
        </Button>
      </nav>
    </div>
  );
}

export type { CursorPaginationProps, PaginationProps };
export { CursorPagination, Pagination };
