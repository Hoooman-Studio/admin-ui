import {
  BoxIcon,
  BuildingIcon,
  FileCheckIcon,
  LayersIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  PlusIcon,
  TableIcon,
  TextCursorInputIcon,
  UserIcon,
} from "lucide-react";
import { useSyncExternalStore } from "react";
import {
  AdminHeader,
  AdminHeaderAccount,
  AdminHeaderActions,
  AdminHeaderStudioLink,
  AdminHeaderTitle,
  AdminShell,
  CommandGroup,
  CommandGroupLabel,
  CommandItem,
  CommandItemIcon,
  CommandPalette,
  CommandShortcut,
  MenuItem,
  NavItem,
  NavSection,
  toast,
} from "../../src";
import { BasicsPage } from "./pages/basics";
import { DataPage } from "./pages/data";
import { FormsPage } from "./pages/forms";
import { ListingPage, ListingsPage, OverviewPage } from "./pages/layout";
import { OverlaysPage } from "./pages/overlays";
import { TypedFormsPage } from "./pages/typed-forms";

/** One list for the nav and the command palette. */
const pages = {
  overview: {
    label: "Overview",
    icon: <LayoutDashboardIcon />,
    Page: OverviewPage,
  },
  listings: { label: "Listings", icon: <BuildingIcon />, Page: ListingsPage },
  basics: { label: "Basics", icon: <BoxIcon />, Page: BasicsPage },
  forms: { label: "Forms", icon: <TextCursorInputIcon />, Page: FormsPage },
  "typed-forms": {
    label: "Typed forms",
    icon: <FileCheckIcon />,
    Page: TypedFormsPage,
  },
  overlays: { label: "Overlays", icon: <LayersIcon />, Page: OverlaysPage },
  data: { label: "Data", icon: <TableIcon />, Page: DataPage },
};

type PageName = keyof typeof pages;
const main: PageName[] = ["overview", "listings"];
const components: PageName[] = [
  "basics",
  "forms",
  "typed-forms",
  "overlays",
  "data",
];

function readPage(): PageName | "listing" {
  const name = window.location.hash.replace("#/", "");
  if (name === "listing") {
    return name;
  }
  return name in pages ? (name as PageName) : "overview";
}

function subscribe(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}

function go(name: string) {
  window.location.hash = `#/${name}`;
}

function App() {
  const page = useSyncExternalStore(subscribe, readPage);
  const Page = page === "listing" ? ListingPage : pages[page].Page;
  const navItem = (name: PageName) => (
    <NavItem
      active={name === page || (name === "listings" && page === "listing")}
      count={name === "listings" ? 128 : undefined}
      href={`#/${name}`}
      icon={pages[name].icon}
      key={name}
      label={pages[name].label}
    />
  );
  const commandItem = (name: PageName) => (
    <CommandItem key={name} onSelect={() => go(name)} value={name}>
      <CommandItemIcon>{pages[name].icon}</CommandItemIcon>
      {pages[name].label}
    </CommandItem>
  );

  return (
    <AdminShell
      accent="hsl(20 100% 50%)"
      header={
        <AdminHeader>
          <AdminHeaderAccount email="lena@portaeuropa.com" name="Lena Fischer">
            <MenuItem>
              <UserIcon />
              Profile
            </MenuItem>
            <MenuItem>
              <LogOutIcon />
              Sign out
            </MenuItem>
          </AdminHeaderAccount>
          <AdminHeaderTitle>Porta Europa</AdminHeaderTitle>
          <AdminHeaderActions>
            <CommandPalette>
              <CommandGroup>
                <CommandGroupLabel>Actions</CommandGroupLabel>
                <CommandItem
                  keywords={["create", "add"]}
                  onSelect={() => toast.success("Draft listing created.")}
                  shortcut="mod+shift+l"
                  value="new-listing"
                >
                  <CommandItemIcon>
                    <PlusIcon />
                  </CommandItemIcon>
                  New listing
                  <CommandShortcut />
                </CommandItem>
              </CommandGroup>
              <CommandGroup>
                <CommandGroupLabel>Pages</CommandGroupLabel>
                {main.map(commandItem)}
              </CommandGroup>
              <CommandGroup>
                <CommandGroupLabel>Components</CommandGroupLabel>
                {components.map(commandItem)}
              </CommandGroup>
            </CommandPalette>
          </AdminHeaderActions>
          <AdminHeaderStudioLink />
        </AdminHeader>
      }
      nav={
        <>
          {main.map(navItem)}
          <NavSection title="Components">{components.map(navItem)}</NavSection>
        </>
      }
    >
      <Page />
    </AdminShell>
  );
}

export { App };
