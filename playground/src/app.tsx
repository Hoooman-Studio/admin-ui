import {
  BoxIcon,
  BuildingIcon,
  LayersIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  TableIcon,
  TextCursorInputIcon,
  UserIcon,
} from "lucide-react";
import { useSyncExternalStore } from "react";
import { AdminShell, MenuItem, NavItem, NavSection } from "../../src";
import { BasicsPage } from "./pages/basics";
import { DataPage } from "./pages/data";
import { FormsPage } from "./pages/forms";
import { ListingPage, ListingsPage, OverviewPage } from "./pages/layout";
import { OverlaysPage } from "./pages/overlays";

const pages = {
  overview: OverviewPage,
  listings: ListingsPage,
  listing: ListingPage,
  basics: BasicsPage,
  forms: FormsPage,
  overlays: OverlaysPage,
  data: DataPage,
};

type PageName = keyof typeof pages;

function readPage(): PageName {
  const name = window.location.hash.replace("#/", "");
  return name in pages ? (name as PageName) : "overview";
}

function subscribe(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}

function App() {
  const page = useSyncExternalStore(subscribe, readPage);
  const Page = pages[page];
  const item = (name: PageName) => ({
    active: name === page,
    href: `#/${name}`,
  });

  return (
    <AdminShell
      accent="hsl(20 100% 50%)"
      account={{ name: "Lena Fischer", email: "lena@portaeuropa.com" }}
      accountMenu={
        <>
          <MenuItem>
            <UserIcon />
            Profile
          </MenuItem>
          <MenuItem>
            <LogOutIcon />
            Sign out
          </MenuItem>
        </>
      }
      name="Porta Europa"
      nav={
        <>
          <NavItem
            {...item("overview")}
            icon={<LayoutDashboardIcon />}
            label="Overview"
          />
          <NavItem
            {...item("listings")}
            active={page === "listings" || page === "listing"}
            count={128}
            icon={<BuildingIcon />}
            label="Listings"
          />
          <NavSection title="Components">
            <NavItem {...item("basics")} icon={<BoxIcon />} label="Basics" />
            <NavItem
              {...item("forms")}
              icon={<TextCursorInputIcon />}
              label="Forms"
            />
            <NavItem
              {...item("overlays")}
              icon={<LayersIcon />}
              label="Overlays"
            />
            <NavItem {...item("data")} icon={<TableIcon />} label="Data" />
          </NavSection>
        </>
      }
    >
      <Page />
    </AdminShell>
  );
}

export { App };
