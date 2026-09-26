import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HeadContent, Link, Outlet, Scripts, createRootRouteWithContext } from "@tanstack/react-router";
import type { ReactNode } from "react";
import appCss from "../styles.css?url";
import { RoyalKeysStoreProvider } from "@/lib/store";

function NotFound() {
  return <div className="grid min-h-screen place-items-center bg-background p-6"><div className="text-center"><p className="text-7xl font-black text-ink">404</p><h1 className="mt-4 text-2xl font-bold">Page not found</h1><Link className="btn-primary mt-5" to="/">Return home</Link></div></div>;
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Royal Keys | Software-Powered Real Estate Brokerage" },
      { name: "description", content: "Buy, rent, sell and let property in Sri Lanka through a managed brokerage workflow." },
      { property: "og:title", content: "Royal Keys" },
      { property: "og:description", content: "Property transactions managed from enquiry to close." },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "stylesheet", href: appCss }, { rel: "icon", href: "/favicon.ico", type: "image/x-icon" }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFound,
});

function RootShell({ children }: { children: ReactNode }) {
  return <html lang="en"><head><HeadContent /></head><body>{children}<Scripts /></body></html>;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return <QueryClientProvider client={queryClient}><RoyalKeysStoreProvider><Outlet /></RoyalKeysStoreProvider></QueryClientProvider>;
}
