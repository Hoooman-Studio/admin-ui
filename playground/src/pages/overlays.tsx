import {
  ArchiveIcon,
  BuildingIcon,
  CalendarIcon,
  CopyIcon,
  ExternalLinkIcon,
  ListFilterIcon,
  MenuIcon,
  PencilIcon,
  RefreshCwIcon,
  SettingsIcon,
  TrashIcon,
  UserIcon,
} from "lucide-react";
import { useState } from "react";
import { confirm } from "../../../src/components/alert-dialog";
import { Avatar } from "../../../src/components/avatar";
import { Badge, type BadgeProps } from "../../../src/components/badge";
import { Banner } from "../../../src/components/banner";
import { Button } from "../../../src/components/button";
import { Card } from "../../../src/components/card";
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../../../src/components/drawer";
import { EmptyState } from "../../../src/components/empty-state";
import { FormField } from "../../../src/components/field";
import { Input } from "../../../src/components/input";
import { Kbd } from "../../../src/components/kbd";
import { List, ListRow } from "../../../src/components/list-row";
import { Loader } from "../../../src/components/loader";
import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  MenuTrigger,
  RowMenu,
} from "../../../src/components/menu";
import { NavItem } from "../../../src/components/nav";
import { PageSection } from "../../../src/components/page";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "../../../src/components/popover";
import { Separator } from "../../../src/components/separator";
import {
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
} from "../../../src/components/tabs";
import { toast } from "../../../src/components/toast";
import {
  Tooltip,
  TooltipContent,
  TooltipShortcut,
  TooltipTrigger,
} from "../../../src/components/tooltip";

const drawerNav = [
  { label: "Listings", icon: <BuildingIcon /> },
  { label: "Owners", icon: <UserIcon /> },
  { label: "Bookings", icon: <CalendarIcon /> },
  { label: "Settings", icon: <SettingsIcon /> },
];

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const statuses = {
  published: { label: "Published", tone: "success" },
  draft: { label: "Draft", tone: "neutral" },
  review: { label: "In review", tone: "warning" },
  rejected: { label: "Rejected", tone: "danger" },
} satisfies Record<string, { label: string; tone: BadgeProps["tone"] }>;

type Status = keyof typeof statuses;

interface Listing {
  id: string;
  owner: string;
  status: Status;
  title: string;
}

const initialListings: Listing[] = [
  {
    id: "1",
    title: "Canal house, Jordaan",
    owner: "Mira Jansen",
    status: "published",
  },
  {
    id: "2",
    title: "Loft near Westerpark",
    owner: "Tom de Vries",
    status: "review",
  },
  {
    id: "3",
    title: "Studio in De Pijp",
    owner: "Sanne Bakker",
    status: "draft",
  },
  {
    id: "4",
    title: "Houseboat, Prinsengracht",
    owner: "Daan Smit",
    status: "rejected",
  },
];

function isStatus(value: string): value is Status {
  return value in statuses;
}

function RowActions({
  listing,
  onOpen,
  onStatus,
  onDelete,
}: {
  listing: Listing;
  onDelete: () => void;
  onOpen: () => void;
  onStatus: (status: Status) => void;
}) {
  return (
    <RowMenu label={listing.title}>
      <MenuItem onSelect={onOpen}>
        <PencilIcon />
        Edit
      </MenuItem>
      <MenuItem onSelect={() => toast.success("Listing duplicated")}>
        <CopyIcon />
        Duplicate
      </MenuItem>
      <MenuItem render={<a href="#/overlays" />}>
        <ExternalLinkIcon />
        View on site
      </MenuItem>
      <MenuSub>
        <MenuSubTrigger>
          <ArchiveIcon />
          Set status
        </MenuSubTrigger>
        <MenuSubContent>
          <MenuRadioGroup
            onValueChange={(value) => {
              if (value && isStatus(value)) {
                onStatus(value);
              }
            }}
            value={listing.status}
          >
            {Object.entries(statuses).map(([value, status]) => (
              <MenuRadioItem closeOnSelect key={value} value={value}>
                {status.label}
              </MenuRadioItem>
            ))}
          </MenuRadioGroup>
        </MenuSubContent>
      </MenuSub>
      <MenuSeparator />
      <MenuItem destructive onSelect={onDelete}>
        <TrashIcon />
        Delete
      </MenuItem>
    </RowMenu>
  );
}

function ListingDrawer({
  listing,
  open,
  onOpenChange,
}: {
  listing: Listing | null;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}) {
  return (
    <Drawer onOpenChange={onOpenChange} open={open}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{listing?.title}</DrawerTitle>
          <DrawerDescription>Owned by {listing?.owner}</DrawerDescription>
        </DrawerHeader>
        <DrawerBody>
          <Tabs defaultValue="details">
            <TabsList aria-label="Listing">
              <TabsTab value="details">Details</TabsTab>
              <TabsTab value="activity">Activity</TabsTab>
              <TabsTab disabled value="billing">
                Billing
              </TabsTab>
            </TabsList>
            <TabsPanel value="details">
              <div className="flex flex-col gap-4">
                <FormField label="Title">
                  <Input defaultValue={listing?.title} />
                </FormField>
                <FormField label="Owner">
                  <Input defaultValue={listing?.owner} />
                </FormField>
              </div>
            </TabsPanel>
            <TabsPanel value="activity">
              <List>
                {["Created by Mira", "Photos updated", "Sent for review"].map(
                  (event) => (
                    <ListRow
                      key={event}
                      leading={<Avatar name="Mira Jansen" size="sm" />}
                      title={event}
                    />
                  )
                )}
              </List>
            </TabsPanel>
          </Tabs>
        </DrawerBody>
        <DrawerFooter>
          <DrawerClose render={<Button variant="outline" />}>
            Cancel
          </DrawerClose>
          <DrawerClose
            action={async () => {
              await wait(800);
              toast.success("Listing saved");
            }}
            render={<Button />}
          >
            Save changes
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function ListingsSection() {
  const [listings, setListings] = useState(initialListings);
  const [openId, setOpenId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showOwner, setShowOwner] = useState(true);
  const selected = listings.find((listing) => listing.id === openId) ?? null;

  async function remove(listing: Listing) {
    const yes = await confirm({
      title: `Delete “${listing.title}”?`,
      description:
        "The listing and its photos are removed for everyone. This can't be undone.",
      confirmLabel: "Delete",
      tone: "danger",
    });
    if (!yes) {
      return;
    }
    setListings((list) => list.filter((item) => item.id !== listing.id));
    toast.success("Listing deleted", {
      action: {
        label: "Undo",
        onAction: () => setListings((list) => [...list, listing]),
      },
    });
  }

  return (
    <PageSection
      actions={
        <Menu>
          <MenuTrigger render={<Button size="sm" variant="outline" />}>
            <ListFilterIcon />
            View
          </MenuTrigger>
          <MenuContent align="end">
            <MenuGroup>
              <MenuGroupLabel>Columns</MenuGroupLabel>
              <MenuCheckboxItem
                checked={showOwner}
                onCheckedChange={setShowOwner}
                value="owner"
              >
                Owner
              </MenuCheckboxItem>
              <MenuCheckboxItem defaultChecked value="status">
                Status
              </MenuCheckboxItem>
            </MenuGroup>
          </MenuContent>
        </Menu>
      }
      title="Listings"
    >
      <Card variant="flush">
        <List>
          {listings.length === 0 ? (
            <EmptyState
              action={
                <Button onClick={() => setListings(initialListings)} size="sm">
                  Restore listings
                </Button>
              }
              description="New listings from owners show up here for review."
              title="No listings yet"
            />
          ) : (
            listings.map((listing) => (
              <ListRow
                actions={
                  <>
                    <Badge dot tone={statuses[listing.status].tone}>
                      {statuses[listing.status].label}
                    </Badge>
                    <RowActions
                      listing={listing}
                      onDelete={() => remove(listing)}
                      onOpen={() => {
                        setOpenId(listing.id);
                        setDrawerOpen(true);
                      }}
                      onStatus={(status) => {
                        setListings((list) =>
                          list.map((item) =>
                            item.id === listing.id ? { ...item, status } : item
                          )
                        );
                        toast.info(`Status set to ${statuses[status].label}`);
                      }}
                    />
                  </>
                }
                key={listing.id}
                subtitle={showOwner ? listing.owner : undefined}
                title={listing.title}
              />
            ))
          )}
        </List>
      </Card>
      <ListingDrawer
        listing={selected}
        onOpenChange={setDrawerOpen}
        open={drawerOpen}
      />
    </PageSection>
  );
}

function ToastsSection() {
  return (
    <PageSection title="Toasts">
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() =>
            toast.success("Listing published", {
              description: "It's live on the site now.",
            })
          }
          variant="outline"
        >
          Success
        </Button>
        <Button
          onClick={() =>
            toast.error("Couldn't publish", {
              description: "The listing has no photos.",
            })
          }
          variant="outline"
        >
          Error
        </Button>
        <Button
          onClick={() => toast.info("Export started, we'll email you.")}
          variant="outline"
        >
          Info
        </Button>
        <Button
          onClick={() =>
            toast.promise(wait(1500), {
              loading: "Importing listings…",
              success: "15 listings imported",
              error: "Import failed",
            })
          }
          variant="outline"
        >
          Promise
        </Button>
      </div>
    </PageSection>
  );
}

function BannersSection() {
  return (
    <PageSection title="Result banners">
      <Banner
        description="All 15 listings are live on the site."
        title="Import finished"
        tone="success"
      />
      <Banner
        action={
          <Button size="sm" variant="outline">
            View skipped
          </Button>
        }
        description="3 listings were skipped because they have no address."
        title="12 of 15 listings imported"
        tone="warning"
      />
      <Banner
        action={
          <Button size="sm" variant="outline">
            <RefreshCwIcon />
            Retry
          </Button>
        }
        description="The payment provider refused the refund. No money was moved."
        title="Refund refused"
        tone="danger"
      />
      <Banner
        description="Changes to prices go live tomorrow at 06:00."
        title="Scheduled"
      />
    </PageSection>
  );
}

function SmallThingsSection() {
  const [hasTitle, setHasTitle] = useState(false);
  return (
    <PageSection title="Tooltips, popovers and more">
      <div className="flex flex-wrap items-center gap-2">
        <Tooltip shortcut="mod+s">
          <TooltipTrigger
            render={
              <Button aria-label="Archive" size="icon" variant="outline" />
            }
          >
            <ArchiveIcon />
          </TooltipTrigger>
          <TooltipContent>
            Archive
            <TooltipShortcut />
          </TooltipContent>
        </Tooltip>
        <Tooltip disabled={hasTitle}>
          <TooltipTrigger
            render={
              <Button disabled={!hasTitle} focusableWhenDisabled>
                Publish
              </Button>
            }
          />
          <TooltipContent>Add a title before publishing</TooltipContent>
        </Tooltip>
        <Button onClick={() => setHasTitle(!hasTitle)} variant="ghost">
          {hasTitle ? "Remove title" : "Add title"}
        </Button>
        <Popover>
          <PopoverTrigger render={<Button variant="outline" />}>
            Share link
          </PopoverTrigger>
          <PopoverContent align="start">
            <PopoverTitle>Share preview</PopoverTitle>
            <PopoverDescription>
              Anyone with the link can see the draft.
            </PopoverDescription>
            <Input defaultValue="porta.app/p/canal-house" readOnly />
            <div className="flex justify-end gap-2">
              <PopoverClose render={<Button size="sm" variant="ghost" />}>
                Cancel
              </PopoverClose>
              <PopoverClose
                onClick={() => toast.success("Link copied")}
                render={<Button size="sm" />}
              >
                Copy link
              </PopoverClose>
            </div>
          </PopoverContent>
        </Popover>
        <Drawer side="left">
          <DrawerTrigger
            render={
              <Button
                aria-label="Open navigation"
                size="icon"
                variant="outline"
              />
            }
          >
            <MenuIcon />
          </DrawerTrigger>
          <DrawerContent size="sm">
            <DrawerHeader>
              <DrawerTitle>Porta admin</DrawerTitle>
            </DrawerHeader>
            <DrawerBody>
              <div className="flex flex-col gap-0.5">
                {drawerNav.map((item) => (
                  <NavItem
                    href="#/overlays"
                    icon={item.icon}
                    key={item.label}
                    label={item.label}
                  />
                ))}
              </div>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </div>
      <Separator />
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex -space-x-2">
          <div>
            <Avatar name="Mira Jansen" src="https://i.pravatar.cc/80?img=5" />
          </div>
          <div>
            <Avatar name="Tom de Vries" />
          </div>
          <div>
            <Avatar name="Sanne Bakker" src="/broken.png" />
          </div>
        </div>
        <Avatar name="Daan Smit" size="lg" />
        <div className="flex h-6">
          <Separator decorative orientation="vertical" />
        </div>
        <div className="flex gap-1">
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </div>
        <div className="flex h-6">
          <Separator decorative orientation="vertical" />
        </div>
        <Loader />
        <Loader size="sm" />
        <Loader size="lg" />
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge>Neutral</Badge>
        <Badge tone="accent">Accent</Badge>
        <Badge tone="success">Success</Badge>
        <Badge tone="warning">Warning</Badge>
        <Badge tone="danger">Danger</Badge>
        <Badge dot tone="info">
          Info
        </Badge>
      </div>
    </PageSection>
  );
}

function OverlaysPage() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-10 p-6 sm:p-10">
      <ListingsSection />
      <ToastsSection />
      <BannersSection />
      <SmallThingsSection />
    </div>
  );
}

export { OverlaysPage };
