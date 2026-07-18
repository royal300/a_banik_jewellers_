import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const BASE_URL = "";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries = [
          { path: "/", priority: "1.0", changefreq: "weekly" as const },
          { path: "/about", priority: "0.8", changefreq: "monthly" as const },
          { path: "/jewelleries", priority: "0.9", changefreq: "weekly" as const },
          { path: "/jewelleries/gold", priority: "0.8", changefreq: "weekly" as const },
          { path: "/jewelleries/diamond", priority: "0.8", changefreq: "weekly" as const },
          { path: "/jewelleries/silver", priority: "0.8", changefreq: "weekly" as const },
          { path: "/jewelleries/necklace", priority: "0.8", changefreq: "weekly" as const },
          { path: "/jewelleries/rings", priority: "0.8", changefreq: "weekly" as const },
          { path: "/jewelleries/bangles", priority: "0.8", changefreq: "weekly" as const },
          { path: "/contact", priority: "0.7", changefreq: "monthly" as const },
        ];
        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...entries.map((e) =>
            `  <url><loc>${BASE_URL}${e.path}</loc><changefreq>${e.changefreq}</changefreq><priority>${e.priority}</priority></url>`
          ),
          `</urlset>`,
        ].join("\n");
        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});

