import { createFileRoute } from "@tanstack/react-router";
import { dbQuery, ensureDbMigrated } from "@/lib/db";

export const Route = createFileRoute("/api/rates")({
  server: {
    handlers: {
      GET: async () => {
        await ensureDbMigrated();
        const rows = await dbQuery<any[]>("SELECT * FROM rate_configs ORDER BY id DESC LIMIT 1");
        if (rows.length > 0) {
          const r = rows[0];
          return new Response(
            JSON.stringify({
              gold22K: r.rate_22k || "₹ 7,285 / g",
              gold24K: r.rate_24k || "₹ 7,945 / g",
              silver: r.rate_silver || "₹ 96 / g",
              updated: r.last_updated || "Today",
              announcement: r.announcement || "",
            }),
            { headers: { "Content-Type": "application/json" } }
          );
        }
        return new Response(
          JSON.stringify({
            gold22K: "₹ 7,285 / g",
            gold24K: "₹ 7,945 / g",
            silver: "₹ 96 / g",
            updated: "Today",
            announcement: "",
          }),
          { headers: { "Content-Type": "application/json" } }
        );
      },
      POST: async ({ request }) => {
        await ensureDbMigrated();
        const body = await request.json();
        const { rate_22k, rate_24k, rate_silver, last_updated, announcement = "" } = body;
        const rows = await dbQuery<any[]>("SELECT id FROM rate_configs LIMIT 1");
        if (rows.length > 0) {
          await dbQuery(
            `UPDATE rate_configs SET rate_22k = ?, rate_24k = ?, rate_silver = ?, last_updated = ?, announcement = ? WHERE id = ?`,
            [rate_22k, rate_24k, rate_silver, last_updated, announcement, rows[0].id]
          );
        } else {
          await dbQuery(
            `INSERT INTO rate_configs (rate_22k, rate_24k, rate_silver, last_updated, announcement) VALUES (?, ?, ?, ?, ?)`,
            [rate_22k, rate_24k, rate_silver, last_updated, announcement]
          );
        }
        return new Response(JSON.stringify({ success: true }), {
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
