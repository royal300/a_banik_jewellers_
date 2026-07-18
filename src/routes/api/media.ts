import { createFileRoute } from "@tanstack/react-router";
import { dbQuery, ensureDbMigrated } from "@/lib/db";

export const Route = createFileRoute("/api/media")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        await ensureDbMigrated();
        const url = new URL(request.url);
        const type = url.searchParams.get("type") || "all";

        if (type === "about") {
          const rows = await dbQuery<any[]>("SELECT * FROM media_settings WHERE key_name = 'about_media'");
          if (rows.length > 0 && rows[0].value) {
            try {
              return new Response(rows[0].value, { headers: { "Content-Type": "application/json" } });
            } catch {}
          }
          return new Response(
            JSON.stringify({
              heroImage: "/assets/about-hero.jpg",
              storyImage: "/assets/promo-1.jpg",
              craftImage: "/assets/customer-1.jpg",
            }),
            { headers: { "Content-Type": "application/json" } }
          );
        }

        if (type === "hero" || type === "promo") {
          const rows = await dbQuery<any[]>(
            "SELECT * FROM banners WHERE banner_type = ? AND is_active = 1 ORDER BY id ASC",
            [type]
          );
          return new Response(JSON.stringify(rows), { headers: { "Content-Type": "application/json" } });
        }

        const allBanners = await dbQuery<any[]>("SELECT * FROM banners ORDER BY id DESC");
        return new Response(JSON.stringify(allBanners), { headers: { "Content-Type": "application/json" } });
      },
      POST: async ({ request }) => {
        await ensureDbMigrated();
        const body = await request.json();
        const { action, id, title, subtitle, image, link, banner_type, aboutData } = body;

        if (action === "save_about") {
          await dbQuery(
            `INSERT INTO media_settings (key_name, value) VALUES ('about_media', ?) ON DUPLICATE KEY UPDATE value = ?`,
            [JSON.stringify(aboutData), JSON.stringify(aboutData)]
          );
          return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
        }

        if (action === "delete_banner" && id) {
          await dbQuery("DELETE FROM banners WHERE id = ?", [id]);
          return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
        }

        if (id) {
          await dbQuery(
            `UPDATE banners SET title = ?, subtitle = ?, image = ?, link = ?, banner_type = ? WHERE id = ?`,
            [title || "", subtitle || "", image || "", link || "", banner_type || "promo", id]
          );
        } else {
          await dbQuery(
            `INSERT INTO banners (title, subtitle, image, link, banner_type) VALUES (?, ?, ?, ?, ?)`,
            [title || "", subtitle || "", image || "", link || "", banner_type || "promo"]
          );
        }
        return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
      },
    },
  },
});
