import { Outlet } from "react-router";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { HomePage } from "@/pages/HomePage";

/**
 * The home page is ALWAYS rendered. /chat, /login and /register are child
 * routes that render in <Outlet /> as a sheet on top of it.
 */
export function RootLayout() {
  return (
    <div className="min-h-screen bg-page text-ink">
      <SiteHeader />
      <main>
        <HomePage />
      </main>
      <SiteFooter />
      <Outlet />
    </div>
  );
}
