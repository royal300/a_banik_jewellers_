import { createFileRoute } from "@tanstack/react-router";
import { dbQuery, ensureDbMigrated } from "@/lib/db";

export const Route = createFileRoute("/api/categories")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        await ensureDbMigrated();
        const url = new URL(request.url);
        const homeOnly = url.searchParams.get("home") === "1";
        const sql = homeOnly
          ? "SELECT * FROM categories WHERE show_in_home = 1 ORDER BY id DESC"
          : "SELECT * FROM categories ORDER BY id DESC";
        const rows = await dbQuery(sql);
        return new Response(JSON.stringify(rows), {
          headers: { "Content-Type": "application/json" },
        });
      },
      POST: async ({ request }) => {
        await ensureDbMigrated();
        const body = await request.json();
        const { id, name, slug, description, image, show_in_home } = body;
        if (id) {
          await dbQuery(
            `UPDATE categories SET name = ?, slug = ?, description = ?, image = ?, show_in_home = ? WHERE id = ?`,
            [name, slug, description || "", image || "", show_in_home ? 1 : 0, id]
          );
        } else {
          await dbQuery(
            `INSERT INTO categories (name, slug, description, image, show_in_home) VALUES (?, ?, ?, ?, ?)`,
            [name, slug, description || "", image || "", show_in_home ? 1 : 0]
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
          await dbQuery(`DELETE FROM categories WHERE id = ?`, [id]);
        }
        return new Response(JSON.stringify({ success: true }), {
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
