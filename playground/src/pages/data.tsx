import {
  ArchiveIcon,
  CopyIcon,
  MapPinIcon,
  PencilIcon,
  PlusIcon,
} from "lucide-react";
import type * as React from "react";
import { useState } from "react";
import { confirm } from "../../../src/components/alert-dialog";
import { Avatar } from "../../../src/components/avatar";
import { Badge } from "../../../src/components/badge";
import { Button } from "../../../src/components/button";
import { Card } from "../../../src/components/card";
import {
  DataTable,
  type DataTableColumn,
} from "../../../src/components/data-table";
import { EmptyState } from "../../../src/components/empty-state";
import {
  FilterChip,
  FilterChips,
  SearchField,
} from "../../../src/components/filter-bar";
import { List, ListRow } from "../../../src/components/list-row";
import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
} from "../../../src/components/menu";
import {
  PageBody,
  PageHeader,
  PageSection,
  PageToolbar,
} from "../../../src/components/page";
import {
  CursorPagination,
  Pagination,
} from "../../../src/components/pagination";
import {
  SegmentedControl,
  SegmentedControlItem,
} from "../../../src/components/segmented-control";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "../../../src/components/select";
import {
  SortableList,
  SortableListRow,
} from "../../../src/components/sortable-list";
import { toast } from "../../../src/components/toast";
import { paginate, type SortState, sortRows } from "../../../src/utils";

const statuses = {
  live: { label: "Live", tone: "success" },
  draft: { label: "Draft", tone: "neutral" },
  review: { label: "In review", tone: "warning" },
  archived: { label: "Archived", tone: "info" },
} as const;

type Status = keyof typeof statuses;

const titles = [
  "Sunny loft by the Spree",
  "Canal house, top floor",
  "Studio near Sagrada Família",
  "Garden flat in Trastevere",
  "Penthouse with roof terrace",
  "Quiet room in Vesterbro",
  "Family house with orchard",
  "Unit 2, Harbour Works",
  "Unit 10, Harbour Works",
  "Converted chapel apartment",
];
const cities = ["Berlin", "Amsterdam", "Barcelona", "Rome", "Copenhagen"];
const owners = ["Lena Fischer", "Tom de Vries", "Marta Ruiz", "Ole Hansen"];
const statusCycle: Status[] = ["live", "live", "draft", "review", "live"];

interface Listing {
  city: string;
  id: string;
  owner: string;
  price: number;
  status: Status;
  title: string;
  updatedAt: Date;
}

const allListings: Listing[] = Array.from({ length: 42 }, (_, index) => ({
  id: `l${index + 1}`,
  title: `${titles[index % titles.length]}${index >= titles.length ? ` ${Math.floor(index / titles.length) + 1}` : ""}`,
  city: cities[index % cities.length] ?? "Berlin",
  owner: owners[(index * 3) % owners.length] ?? "Lena Fischer",
  status: statusCycle[(index * 7) % statusCycle.length] ?? "live",
  price: 900 + ((index * 379) % 2600),
  updatedAt: new Date(Date.UTC(2026, 10, 16) - index * 86_400_000 * 1.7),
}));

const money = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});
const date = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const columns: DataTableColumn<Listing>[] = [
  { key: "title", header: "Listing", sortable: true },
  {
    key: "status",
    header: "Status",
    cell: (listing) => (
      <Badge dot tone={statuses[listing.status].tone}>
        {statuses[listing.status].label}
      </Badge>
    ),
  },
  { key: "city", header: "City", sortable: true, hideBelow: "md" },
  { key: "owner", header: "Owner", hideBelow: "lg" },
  {
    key: "price",
    header: "Rent",
    align: "end",
    sortable: true,
    hideBelow: "sm",
    cell: (listing) => `${money.format(listing.price)} / mo`,
  },
  {
    key: "updatedAt",
    header: "Updated",
    sortable: true,
    hideBelow: "md",
    cell: (listing) => date.format(listing.updatedAt),
  },
];

type DemoState = "data" | "loading" | "empty" | "error";

const pageSize = 10;

/** Stands in for a router's Link: it opens the row without leaving this page. */
function DemoLink({
  onOpen,
  ...props
}: React.ComponentProps<"a"> & { onOpen: () => void }) {
  function open(event: React.MouseEvent) {
    event.preventDefault();
    onOpen();
  }
  // biome-ignore lint/a11y/useValidAnchor: a router's Link also renders an anchor that handles its own click.
  return <a href="#/data" onClick={open} {...props} />;
}

function DataPage() {
  const [demo, setDemo] = useState<DemoState>("data");
  return (
    <>
      <PageToolbar>
        <SegmentedControl
          aria-label="Table state"
          onValueChange={(value) => setDemo(value as DemoState)}
          value={demo}
        >
          <SegmentedControlItem value="data">Data</SegmentedControlItem>
          <SegmentedControlItem value="loading">Loading</SegmentedControlItem>
          <SegmentedControlItem value="empty">Empty</SegmentedControlItem>
          <SegmentedControlItem value="error">Error</SegmentedControlItem>
        </SegmentedControl>
      </PageToolbar>
      <ListingsScreen demo={demo} />
      <PageBody>
        <PageSection
          description="Paged by cursor, without a total, like Convex or Stripe."
          title="Payouts"
        >
          <PayoutsExample />
        </PageSection>
        <PageSection
          description="ListRow, for lists that aren't tables. These rows wrap their text."
          title="Recent enquiries"
        >
          <EnquiriesExample />
        </PageSection>
        <PageSection
          description="SortableList: drag a grip, or focus it and press Space. Saving takes a second; moving the last FAQ fails."
          title="FAQ order"
        >
          <FaqOrderExample />
        </PageSection>
      </PageBody>
    </>
  );
}

function ListingsScreen({ demo }: { demo: DemoState }) {
  const [listings, setListings] = useState(allListings);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<Status | "all">("all");
  const [cityFilter, setCityFilter] = useState<string[]>([]);
  const [sort, setSort] = useState<SortState | null>({
    key: "updatedAt",
    direction: "desc",
  });
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);

  const query = search.trim().toLowerCase();
  const filtered = listings.filter(
    (listing) =>
      (status === "all" || listing.status === status) &&
      (cityFilter.length === 0 || cityFilter.includes(listing.city)) &&
      (query === "" ||
        listing.title.toLowerCase().includes(query) ||
        listing.city.toLowerCase().includes(query))
  );
  const pageRows = paginate(sortRows(filtered, sort), page, pageSize);

  const rowsByDemo = {
    data: pageRows,
    loading: undefined,
    empty: [],
    error: [],
  };

  function archive(ids: string[]) {
    setListings((current) =>
      current.map((listing) =>
        ids.includes(listing.id) ? { ...listing, status: "archived" } : listing
      )
    );
    setSelected((current) => current.filter((id) => !ids.includes(id)));
  }

  async function archiveSelected() {
    const count = selected.length;
    const agreed = await confirm({
      title: `Archive ${count} ${count === 1 ? "listing" : "listings"}?`,
      description: "They go offline and stop taking enquiries.",
      confirmLabel: "Archive",
      tone: "danger",
    });
    if (agreed) {
      archive(selected);
      toast.success(
        `Archived ${count} ${count === 1 ? "listing" : "listings"}`
      );
    }
  }

  function clearFilters() {
    setStatus("all");
    setCityFilter([]);
    setPage(1);
  }

  return (
    <section>
      <PageHeader
        actions={
          <Button variant="accent">
            <PlusIcon />
            <span className="hidden sm:inline">New listing</span>
            <span className="sm:hidden">New</span>
          </Button>
        }
        count={listings.length}
        title="Listings"
      />
      <PageToolbar
        actions={
          <Menu>
            <MenuTrigger
              render={
                <Button variant="outline">
                  <MapPinIcon />
                  City
                </Button>
              }
            />
            <MenuContent align="end">
              {cities.map((city) => (
                <MenuCheckboxItem
                  checked={cityFilter.includes(city)}
                  key={city}
                  onCheckedChange={(checked) => {
                    setCityFilter((current) =>
                      checked
                        ? [...current, city]
                        : current.filter((item) => item !== city)
                    );
                    setPage(1);
                  }}
                  value={city}
                >
                  {city}
                </MenuCheckboxItem>
              ))}
            </MenuContent>
          </Menu>
        }
      >
        <SearchField
          onValueChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          placeholder="Search listings"
          value={search}
        />
        <Select
          items={[
            { value: "all", label: "All statuses" },
            ...Object.entries(statuses).map(([value, { label }]) => ({
              value,
              label,
            })),
          ]}
          onValueChange={(value) => {
            setStatus((value ?? "all") as Status | "all");
            setPage(1);
          }}
          value={status}
        >
          <div className="w-32 shrink-0 sm:w-36">
            <SelectTrigger aria-label="Status" />
          </div>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {Object.entries(statuses).map(([value, { label }]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </PageToolbar>
      {status !== "all" || cityFilter.length > 0 ? (
        <FilterChips onClear={clearFilters}>
          {status === "all" ? null : (
            <FilterChip
              label="Status"
              onRemove={() => setStatus("all")}
              removeLabel="Remove Status filter"
              value={statuses[status].label}
            />
          )}
          {cityFilter.map((city) => (
            <FilterChip
              key={city}
              label="City"
              onRemove={() =>
                setCityFilter((current) =>
                  current.filter((item) => item !== city)
                )
              }
              removeLabel={`Remove ${city} filter`}
              value={city}
            />
          ))}
        </FilterChips>
      ) : null}
      <DataTable
        aria-label="Listings"
        bulkActions={
          <Button onClick={archiveSelected} size="md" variant="danger-subtle">
            <ArchiveIcon />
            Archive
          </Button>
        }
        columns={columns}
        empty={
          query || status !== "all" || cityFilter.length > 0 ? (
            <EmptyState
              action={
                <Button onClick={clearFilters} variant="outline">
                  Clear filters
                </Button>
              }
              description="Try another search or filter."
              title="No listings match"
            />
          ) : (
            <EmptyState
              action={
                <Button variant="accent">
                  <PlusIcon />
                  New listing
                </Button>
              }
              description="Listings you add show up here, ready to publish."
              title="No listings yet"
            />
          )
        }
        error={
          demo === "error"
            ? "The server didn't answer. Try again in a minute."
            : undefined
        }
        getRowId={(listing) => listing.id}
        onSelectedChange={setSelected}
        onSortChange={(next) => {
          setSort(next);
          setPage(1);
        }}
        rowActions={(listing) => (
          <>
            <MenuItem onSelect={() => toast(`Editing ${listing.title}`)}>
              <PencilIcon />
              Edit
            </MenuItem>
            <MenuItem onSelect={() => toast(`Duplicated ${listing.title}`)}>
              <CopyIcon />
              Duplicate
            </MenuItem>
            {listing.status === "archived" ? null : (
              <>
                <MenuSeparator />
                <MenuItem
                  destructive
                  onSelect={() => {
                    archive([listing.id]);
                    toast.success(`Archived ${listing.title}`);
                  }}
                >
                  <ArchiveIcon />
                  Archive
                </MenuItem>
              </>
            )}
          </>
        )}
        rowLink={(listing) => (
          <DemoLink onOpen={() => toast(`Opening ${listing.title}`)} />
        )}
        rows={rowsByDemo[demo]}
        selected={selected}
        sort={sort}
        stickyTop="4.75rem"
      />
      {demo === "data" && filtered.length > 0 ? (
        <Pagination
          onPageChange={setPage}
          page={page}
          pageSize={pageSize}
          total={filtered.length}
        />
      ) : null}
    </section>
  );
}

interface Payout {
  amount: number;
  id: string;
  paidAt: Date;
  reference: string;
}

const payouts: Payout[] = Array.from({ length: 23 }, (_, index) => ({
  id: `po_${(1000 + index).toString(36)}`,
  reference: `PO-${20_261_100 - index}`,
  amount: 1200 + ((index * 517) % 4000),
  paidAt: new Date(Date.UTC(2026, 10, 14) - index * 86_400_000 * 7),
}));

const payoutColumns: DataTableColumn<Payout>[] = [
  { key: "reference", header: "Payout" },
  {
    key: "paidAt",
    header: "Paid",
    cell: (payout) => date.format(payout.paidAt),
  },
  {
    key: "amount",
    header: "Amount",
    align: "end",
    cell: (payout) => money.format(payout.amount),
  },
];

/** Stands in for a server that returns a page and the cursor after it. */
function fetchPayouts(cursor: string | null, limit: number) {
  const start = cursor ? payouts.findIndex((p) => p.id === cursor) + 1 : 0;
  const rows = payouts.slice(start, start + limit);
  const last = rows.at(-1);
  return {
    rows,
    nextCursor:
      last && start + limit < payouts.length
        ? last.id
        : (null as string | null),
  };
}

function PayoutsExample() {
  const [cursors, setCursors] = useState<(string | null)[]>([null]);
  const cursor = cursors.at(-1) ?? null;
  const { rows, nextCursor } = fetchPayouts(cursor, 5);
  return (
    <div>
      <DataTable
        aria-label="Payouts"
        columns={payoutColumns}
        getRowId={(payout) => payout.id}
        rows={rows}
      />
      <CursorPagination
        hasNext={nextCursor !== null}
        hasPrevious={cursors.length > 1}
        onNext={() => setCursors((current) => [...current, nextCursor])}
        onPrevious={() => setCursors((current) => current.slice(0, -1))}
        summary={`Page ${cursors.length}`}
      />
    </div>
  );
}

const enquiries = [
  {
    id: "e1",
    name: "Lena Fischer",
    message: "Is the loft still free from January?",
    when: "2h ago",
  },
  {
    id: "e2",
    name: "Tom de Vries",
    message:
      "We're a family of four moving from Utrecht in March. Could we see the canal house on a weekday evening, and is the top floor reachable with a pram?",
    when: "5h ago",
  },
  {
    id: "e3",
    name: "Marta Ruiz",
    message: "Are pets allowed in the garden flat?",
    when: "Yesterday",
  },
];

function EnquiriesExample() {
  return (
    <Card variant="flush">
      <List>
        {enquiries.map((enquiry) => (
          <ListRow
            actions={
              <Button
                onClick={() => toast(`Replied to ${enquiry.name}`)}
                size="sm"
                variant="outline"
              >
                Reply
              </Button>
            }
            key={enquiry.id}
            leading={<Avatar name={enquiry.name} size="lg" />}
            link={
              <DemoLink
                onOpen={() => toast(`Opening ${enquiry.name}'s enquiry`)}
              />
            }
            meta={enquiry.when}
            subtitle={enquiry.message}
            title={enquiry.name}
            wrap
          />
        ))}
      </List>
    </Card>
  );
}

const initialFaqs = [
  { id: "faq-1", question: "How do I book a viewing?", views: 1240 },
  { id: "faq-2", question: "Can I bring a pet?", views: 860 },
  { id: "faq-3", question: "When is the deposit due?", views: 512 },
  { id: "faq-4", question: "Is parking included?", views: 301 },
  { id: "faq-5", question: "How do I cancel?", views: 97 },
];

function FaqOrderExample() {
  const [faqs, setFaqs] = useState(initialFaqs);
  return (
    <Card variant="flush">
      <SortableList
        aria-label="FAQ order"
        getRowId={(faq) => faq.id}
        onReorder={async (reordered, { row, previous }) => {
          // Like a mutation: the list keeps the new order while it saves.
          await new Promise((resolve) => setTimeout(resolve, 1000));
          if (row.id === "faq-5") {
            toast.error(`Couldn't move "${row.question}"`);
            throw new Error("Save failed");
          }
          setFaqs(reordered);
          toast(
            `Moved "${row.question}" ${previous ? `after "${previous.question}"` : "to the top"}`
          );
        }}
        rows={faqs}
      >
        {(faq) => (
          <SortableListRow
            actions={
              <Button
                onClick={() => toast(`Editing "${faq.question}"`)}
                size="sm"
                variant="outline"
              >
                Edit
              </Button>
            }
            meta={`${faq.views} views`}
            title={faq.question}
          />
        )}
      </SortableList>
    </Card>
  );
}

export { DataPage };
