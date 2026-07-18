import { createFileRoute } from "@tanstack/react-router";
import { ensureDbMigrated } from "@/lib/db";

export const Route = createFileRoute("/api/admin-auth")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        await ensureDbMigrated();
        const body = await request.json();
        const { username, password } = body;

        const cleanUser = String(username || "").trim().toLowerCase();
        const cleanPass = String(password || "").trim();

        if (cleanUser === "admin" && cleanPass === "admin123") {
          return new Response(
            JSON.stringify({ success: true, token: "abj_admin_token_active" }),
            { headers: { "Content-Type": "application/json" } }
          );
        }

        return new Response(
          JSON.stringify({ success: false, error: "Invalid username or password" }),
          { status: 401, headers: { "Content-Type": "application/json" } }
        );
      },
    },
  },
});
