import {
  CalendarIcon,
  EuroIcon,
  MapPinIcon,
  PlusIcon,
  SearchIcon,
  UserIcon,
} from "lucide-react";
import { Badge } from "../../../src/components/badge";
import { Button } from "../../../src/components/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../src/components/card";
import {
  DescriptionItem,
  DescriptionList,
} from "../../../src/components/description-list";
import { Input, InputGroup } from "../../../src/components/input";
import {
  DetailLayout,
  PageBody,
  PageHeader,
  PageSection,
  PageToolbar,
} from "../../../src/components/page";
import { StatCard, StatGrid } from "../../../src/components/stat";

const listings = [
  {
    id: "l1",
    title: "Sunny loft by the Spree",
    city: "Berlin",
    price: "€1,850 / month",
    status: "Live",
  },
  {
    id: "l2",
    title: "Canal house, top floor",
    city: "Amsterdam",
    price: "€2,400 / month",
    status: "Live",
  },
  {
    id: "l3",
    title: "Studio near Sagrada Família",
    city: "Barcelona",
    price: "€1,150 / month",
    status: "Draft",
  },
  {
    id: "l4",
    title: "Garden flat in Trastevere",
    city: "Rome",
    price: "€1,700 / month",
    status: "Live",
  },
] as const;

const enquiries = [
  {
    id: "e1",
    name: "Lena Fischer",
    listing: "Sunny loft by the Spree",
    when: "2h ago",
  },
  {
    id: "e2",
    name: "Tom de Vries",
    listing: "Canal house, top floor",
    when: "5h ago",
  },
  {
    id: "e3",
    name: "Marta Ruiz",
    listing: "Garden flat in Trastevere",
    when: "Yesterday",
  },
] as const;

const go = (page: string) => () => {
  window.location.hash = `#/${page}`;
};

function OverviewPage() {
  return <Overview onOpenListing={go("listing")} />;
}

function ListingsPage() {
  return <Listings onOpenListing={go("listing")} />;
}

function ListingPage() {
  return <ListingDetail onBack={go("listings")} />;
}

function Overview({ onOpenListing }: { onOpenListing: () => void }) {
  return (
    <>
      <PageHeader
        actions={
          <Button onClick={onOpenListing} variant="accent">
            <PlusIcon />
            New listing
          </Button>
        }
        description="November 2026"
        title="Overview"
      />
      <PageBody>
        <StatGrid>
          <StatCard
            change="+12%"
            hint="vs last month"
            label="Enquiries"
            trend="up"
            value="284"
          />
          <StatCard
            change="+3"
            hint="this month"
            label="Live listings"
            trend="up"
            value="128"
          />
          <StatCard
            change="−4%"
            hint="vs last month"
            label="Occupancy"
            trend="down"
            value="91%"
          />
          <StatCard hint="Average reply time" label="Response" value="2.4h" />
        </StatGrid>
        <PageSection
          actions={
            <Button size="sm" variant="outline">
              View all
            </Button>
          }
          description="People who asked about a listing this week."
          title="Recent enquiries"
        >
          <Card variant="list">
            {enquiries.map((enquiry) => (
              <button
                className="hover:bg-alpha/3 flex items-center gap-4 text-left"
                key={enquiry.id}
                onClick={onOpenListing}
                type="button"
              >
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-base font-medium text-gray-950">
                    {enquiry.name}
                  </span>
                  <span className="truncate text-sm text-gray-600">
                    {enquiry.listing}
                  </span>
                </span>
                <span className="shrink-0 text-sm text-gray-500">
                  {enquiry.when}
                </span>
              </button>
            ))}
          </Card>
        </PageSection>
        <div className="grid gap-4 @3xl/page-content:grid-cols-2">
          <Card>
            <CardHeader actions={<Badge tone="success">On</Badge>}>
              <CardTitle>Auto-publish</CardTitle>
              <CardDescription>
                New listings go live once the photos are checked.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="outline">Change</Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Newsletter</CardTitle>
              <CardDescription>
                1,204 subscribers. The next issue goes out on Friday.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="ghost">Preview</Button>
              <Button>Write issue</Button>
            </CardFooter>
          </Card>
        </div>
      </PageBody>
    </>
  );
}

function Listings({ onOpenListing }: { onOpenListing: () => void }) {
  return (
    <>
      <PageHeader
        actions={
          <Button variant="accent">
            <PlusIcon />
            New listing
          </Button>
        }
        count={128}
        title="Listings"
      />
      <PageToolbar
        actions={
          <Button size="sm" variant="outline">
            Filters
          </Button>
        }
      >
        <InputGroup className="w-full max-w-xs">
          <SearchIcon />
          <Input aria-label="Search listings" placeholder="Search listings" />
        </InputGroup>
      </PageToolbar>
      <PageBody>
        <Card variant="list">
          {listings.map((listing) => (
            <button
              className="hover:bg-alpha/3 flex items-center gap-4 text-left"
              key={listing.id}
              onClick={onOpenListing}
              type="button"
            >
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-base font-medium text-gray-950">
                  {listing.title}
                </span>
                <span className="truncate text-sm text-gray-600">
                  {listing.city} · {listing.price}
                </span>
              </span>
              <Badge
                dot
                tone={listing.status === "Live" ? "success" : "neutral"}
              >
                {listing.status}
              </Badge>
            </button>
          ))}
        </Card>
      </PageBody>
    </>
  );
}

function ListingDetail({ onBack }: { onBack: () => void }) {
  return (
    <>
      <PageHeader
        actions={
          <>
            <Button className="hidden sm:inline-flex" variant="outline">
              Preview
            </Button>
            <Button variant="accent">Save</Button>
          </>
        }
        back={<button onClick={onBack} type="button" />}
        backLabel="Back to listings"
        description="Berlin · Listing #1042"
        title="Sunny loft by the Spree"
      />
      <DetailLayout
        side={
          <PageBody>
            <PageSection title="Details">
              <DescriptionList>
                <DescriptionItem label="Status">
                  <Badge dot tone="success">
                    Live
                  </Badge>
                </DescriptionItem>
                <DescriptionItem icon={<EuroIcon />} label="Rent">
                  €1,850 / month
                </DescriptionItem>
                <DescriptionItem icon={<MapPinIcon />} label="Address">
                  Köpenicker Str. 12, Berlin
                </DescriptionItem>
                <DescriptionItem icon={<CalendarIcon />} label="Available">
                  1 January 2027
                </DescriptionItem>
                <DescriptionItem icon={<UserIcon />} label="Owner">
                  Anna Weber
                </DescriptionItem>
              </DescriptionList>
            </PageSection>
          </PageBody>
        }
      >
        <PageBody>
          <PageSection
            description="Shown on the listing page."
            title="Description"
          >
            <Card>
              <p className="text-base leading-6 text-gray-950">
                A bright 68 m² loft on the fourth floor with a view over the
                Spree. Open kitchen, one bedroom, a work corner by the window
                and a shared roof terrace. Five minutes to the U-Bahn.
              </p>
            </Card>
          </PageSection>
          <PageSection title="Facts">
            <Card>
              <DescriptionList>
                <DescriptionItem label="Size">68 m²</DescriptionItem>
                <DescriptionItem label="Rooms">2</DescriptionItem>
                <DescriptionItem label="Floor">4th, with lift</DescriptionItem>
                <DescriptionItem label="Furnished">Yes</DescriptionItem>
              </DescriptionList>
            </Card>
          </PageSection>
        </PageBody>
      </DetailLayout>
    </>
  );
}

export { ListingPage, ListingsPage, OverviewPage };
