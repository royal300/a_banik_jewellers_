import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteLayout } from "@/components/site/SiteLayout";

function NotFoundComponent() {
  return (
    <SiteLayout>
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="max-w-md text-center">
          <h1 className="text-7xl font-bold text-deep-red">404</h1>
          <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="mt-6">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-full gradient-red text-white px-6 py-3 text-sm font-semibold shadow-gold hover:scale-105 transition-elegant"
            >
              Go home
            </Link>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold text-deep-red">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded-full gradient-red text-white px-5 py-2.5 text-sm font-semibold"
          >
            Try again
          </button>
          <a href="/" className="rounded-full border border-gold px-5 py-2.5 text-sm font-semibold text-deep-red">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "A Banik Jewellers — Timeless Gold, Diamond & Silver Jewellery in Madhyamgram, Kolkata" },
      { name: "description", content: "A Banik Jewellers in Madhyamgram, Kolkata — a trusted showroom for BIS hallmarked gold, certified diamond and sterling silver jewellery. Bridal, festive and custom designs crafted with generations of expertise." },
      { name: "author", content: "A Banik Jewellers" },
      { name: "keywords", content: "A Banik Jewellers, jewellers Madhyamgram, gold jewellery Kolkata, diamond jewellery Kolkata, bridal jewellery, silver jewellery, bangles, necklace, rings" },
      { property: "og:title", content: "A Banik Jewellers — Premium Jewellery Showroom, Madhyamgram" },
      { property: "og:description", content: "Hallmarked gold, certified diamonds and sterling silver — crafted with generations of trust." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "A Banik Jewellers" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "JewelryStore",
          name: "A Banik Jewellers",
          telephone: "+91 9748836800",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Gyayan Bhaban Market, Sodepur Rd",
            addressLocality: "Madhyamgram",
            addressRegion: "West Bengal",
            postalCode: "700129",
            addressCountry: "IN",
          },
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const location = useRouterState({ select: (s) => s.location });
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <QueryClientProvider client={queryClient}>
      {isAdmin ? (
        <Outlet />
      ) : (
        <SiteLayout>
          <Outlet />
        </SiteLayout>
      )}
    </QueryClientProvider>
  );
}
