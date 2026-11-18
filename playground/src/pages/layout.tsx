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
import { List, ListRow } from "../../../src/components/list-row";
import {
  DetailLayout,
  PageBody,
  PageHeader,
  PageSection,
  PageToolbar,
} from "../../../src/components/page";
import {
  SegmentedControl,
  SegmentedControlItem,
} from "../../../src/components/segmented-control";
import { StatCard, StatGrid } from "../../../src/components/stat";

const listings = [
  {
    id: "l1",
    title: "Sunny loft by the Spree",
    city: "Berlin",
    price: "€1,850 / month",
    status: "Live",
    updated: "2h ago",
  },
  {
    id: "l2",
    title: "Canal house, top floor",
    city: "Amsterdam",
    price: "€2,400 / month",
    status: "Live",
    updated: "Yesterday",
  },
  {
    id: "l3",
    title: "Studio near Sagrada Família",
    city: "Barcelona",
    price: "€1,150 / month",
    status: "Draft",
    updated: "3 days ago",
  },
  {
    id: "l4",
    title: "Garden flat in Trastevere",
    city: "Rome",
    price: "€1,700 / month",
    status: "Live",
    updated: "Last week",
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
  return (
    <>
      <PageHeader
        actions={
          <Button onClick={go("listing")} variant="accent">
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
          <Card variant="flush">
            <List>
              {enquiries.map((enquiry) => (
                <ListRow
                  key={enquiry.id}
                  link={<a href="#/listing" />}
                  meta={enquiry.when}
                  subtitle={enquiry.listing}
                  title={enquiry.name}
                />
              ))}
            </List>
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

function ListingsPage() {
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
        description="Every place you rent out, live or in draft. Drafts stay hidden from the site."
        title="Listings"
      />
      <PageToolbar
        actions={
          <Button size="sm" variant="outline">
            Filters
          </Button>
        }
      >
        <div className="w-full max-w-xs">
          <InputGroup>
            <SearchIcon />
            <Input aria-label="Search listings" placeholder="Search listings" />
          </InputGroup>
        </div>
        <SegmentedControl defaultValue="all">
          <SegmentedControlItem value="all">All</SegmentedControlItem>
          <SegmentedControlItem value="live">Live</SegmentedControlItem>
          <SegmentedControlItem value="draft">Draft</SegmentedControlItem>
        </SegmentedControl>
      </PageToolbar>
      <PageBody>
        <Card variant="flush">
          <List>
            {listings.map((listing) => (
              <ListRow
                actions={
                  <Badge
                    dot
                    tone={listing.status === "Live" ? "success" : "neutral"}
                  >
                    {listing.status}
                  </Badge>
                }
                key={listing.id}
                link={<a href="#/listing" />}
                meta={listing.updated}
                subtitle={`${listing.city} · ${listing.price}`}
                title={listing.title}
              />
            ))}
          </List>
        </Card>
      </PageBody>
    </>
  );
}

function ListingPage() {
  return (
    <>
      <PageHeader
        actions={
          <>
            <div className="hidden sm:block">
              <Button variant="outline">Preview</Button>
            </div>
            <Button variant="accent">Save</Button>
          </>
        }
        back={<a href="#/listings" />}
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
              <CardDescription>
                A bright 68 m² loft on the fourth floor with a view over the
                Spree. Open kitchen, one bedroom, a work corner by the window
                and a shared roof terrace. Five minutes to the U-Bahn.
              </CardDescription>
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
