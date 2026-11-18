import { AdminProvider, Button, confirm, toast } from "../../../src";

async function unpublish() {
  if (
    await confirm({
      title: "Unpublish this page?",
      confirmLabel: "Unpublish",
      tone: "danger",
    })
  ) {
    toast.success("Page unpublished.");
  }
}

/** The client's own website around the admin, styled only by site.css. */
function SitePage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1>Porta Europa</h1>
      <p>
        Homes across Europe. This page is the client's own site, styled by its
        own Tailwind and global CSS. The admin lives at{" "}
        <a href="#/overview">/admin</a> on the same site and must not change how
        this page looks, nor be changed by it.
      </p>
      <ul>
        <li>Global serif font, coloured headings and underlined links</li>
        <li>Bordered buttons and inputs</li>
      </ul>
      <p className="text-lg text-gray-600">
        Tailwind&apos;s default <code>text-lg</code> and{" "}
        <code>text-gray-600</code> still mean what this site expects.
      </p>
      <button type="button">A site button</button>
      {/* Admin pieces on the site's own page, outside AdminShell. */}
      <div className="mt-8">
        <AdminProvider accent="hsl(20 100% 50%)">
          <Button onClick={unpublish} variant="outline">
            Unpublish page
          </Button>
        </AdminProvider>
      </div>
    </div>
  );
}

export { SitePage };
