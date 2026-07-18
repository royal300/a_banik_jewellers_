import { createFileRoute } from "@tanstack/react-router";
import { dbQuery, ensureDbMigrated } from "@/lib/db";

export const Route = createFileRoute("/api/products")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        await ensureDbMigrated();
        const url = new URL(request.url);
        const featuredOnly = url.searchParams.get("featured") === "1";
        const category = url.searchParams.get("category");
        const idOrSlug = url.searchParams.get("id");

        let sql = "SELECT * FROM products";
        const params: any[] = [];
        const conditions: string[] = [];

        if (idOrSlug) {
          conditions.push("(id = ? OR slug = ?)");
          params.push(idOrSlug, idOrSlug);
        } else {
          if (featuredOnly) {
            conditions.push("is_featured = 1");
          }
          if (category && category !== "all") {
            conditions.push("category_slug = ?");
            params.push(category);
          }
        }

        if (conditions.length > 0) {
          sql += " WHERE " + conditions.join(" AND ");
        }
        sql += " ORDER BY id DESC";

        const rows = await dbQuery<any[]>(sql, params);
        const formatted = rows.map((r) => {
          let thumbs = [r.image];
          try {
            if (r.thumbnails && typeof r.thumbnails === "string") {
              const parsed = JSON.parse(r.thumbnails);
              if (Array.isArray(parsed) && parsed.length > 0) thumbs = parsed;
            }
          } catch {}
          return {
            ...r,
            id: String(r.id),
            slug: r.slug || String(r.id),
            category: r.category_slug || "gold",
            thumbnails: thumbs,
          };
        });

        if (idOrSlug && formatted.length > 0) {
          // Also fetch related products
          const current = formatted[0];
          const relatedRows = await dbQuery<any[]>(
            "SELECT * FROM products WHERE category_slug = ? AND id != ? LIMIT 4",
            [current.category_slug || "gold", current.id]
          );
          const related = relatedRows.map((r) => ({ ...r, id: String(r.id) }));
          return new Response(JSON.stringify({ product: current, related }), {
            headers: { "Content-Type": "application/json" },
          });
        }

        return new Response(JSON.stringify(formatted), {
          headers: { "Content-Type": "application/json" },
        });
      },
      POST: async ({ request }) => {
        await ensureDbMigrated();
        const body = await request.json();
        const {
          id,
          name,
          slug,
          category_slug,
          weight,
          purity,
          description,
          image,
          thumbnails = [],
          is_featured,
        } = body;

        const thumbsJson = JSON.stringify(
          Array.isArray(thumbnails) && thumbnails.length > 0 ? thumbnails : [image || ""]
        );
        const prodSlug = slug || (name ? name.toLowerCase().replace(/[^a-z0-9]+/g, "-") : `prod-${Date.now()}`);

        if (id) {
          await dbQuery(
            `UPDATE products SET name = ?, slug = ?, category_slug = ?, weight = ?, purity = ?, description = ?, image = ?, thumbnails = ?, is_featured = ? WHERE id = ?`,
            [
              name,
              prodSlug,
              category_slug || "gold",
              weight || "",
              purity || "22K Hallmarked Gold",
              description || "",
              image || "",
              thumbsJson,
              is_featured ? 1 : 0,
              id,
            ]
          );
        } else {
          await dbQuery(
            `INSERT INTO products (name, slug, category_slug, weight, purity, description, image, thumbnails, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              name,
              prodSlug,
              category_slug || "gold",
              weight || "",
              purity || "22K Hallmarked Gold",
              description || "",
              image || "",
              thumbsJson,
              is_featured ? 1 : 0,
            ]
          );
        }
        return new Response(JSON.stringify({ success: true }), {
          headers: { "Content-Type": "application/json" },
        });
      },
      DELETE: async ({ request }) => {
        await ensureDbMigrated();
        const url = new URL(request.url);
        const id = url.searchParams.get("id");
        if (id) {
          await dbQuery(`DELETE FROM products WHERE id = ?`, [id]);
        }
        return new Response(JSON.stringify({ success: true }), {
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
