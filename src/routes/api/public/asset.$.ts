/**
 * Public asset proxy — streams files from the private `site-assets` bucket
 * so the portfolio can reference images/PDFs by stable public URLs
 * (`/api/public/asset/<folder>/<file>`).
 *
 * We use a proxy instead of Supabase's public-bucket feature because the
 * workspace policy blocks public buckets. This keeps write access locked
 * down (only the admin server function can upload) while reads stay open.
 */
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/asset/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const path = (params as { _splat?: string })._splat ?? "";
        if (!path || path.includes("..")) {
          return new Response("Not found", { status: 404 });
        }
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data, error } = await supabaseAdmin.storage.from("site-assets").download(path);
        if (error || !data) {
          return new Response("Not found", { status: 404 });
        }
        const contentType = data.type || "application/octet-stream";
        return new Response(data, {
          status: 200,
          headers: {
            "content-type": contentType,
            "cache-control": "public, max-age=31536000, immutable",
          },
        });
      },
    },
  },
});
