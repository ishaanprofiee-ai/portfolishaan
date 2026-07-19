/**
 * Server functions powering the /admin dashboard:
 *  - adminLogin / adminLogout / adminStatus — session management
 *  - updateSiteContent — writes the site_content JSON row
 *  - uploadSiteAsset   — uploads a file to the private `site-assets` bucket
 *  - deleteSiteAsset   — removes a file from the bucket
 *
 * Every write path re-checks the admin session cookie before touching the DB
 * or storage, so the admin dashboard is the only writer to portfolio content.
 *
 * Files are stored in a private bucket and served through
 *   /api/public/asset/<path>  (see src/routes/api/public/asset.$.ts)
 * which streams them via the service-role client. Portfolio images end up
 * with stable public URLs that never expire.
 */

import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { createHash, timingSafeEqual, randomUUID } from "node:crypto";
import { z } from "zod";

import { ADMIN_SESSION_CONFIG, type AdminSessionData } from "./adminSession";
import { defaultContent } from "@/content/site";

// ---------------------------------------------------------------------------
// Session helpers
// ---------------------------------------------------------------------------

function passwordMatches(input: string, expected: string): boolean {
  const a = createHash("sha256").update(input, "utf8").digest();
  const b = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(a, b);
}

async function requireAdmin() {
  const session = await useSession<AdminSessionData>(ADMIN_SESSION_CONFIG);
  if (!session.data.admin) {
    throw new Error("Unauthorized");
  }
  return session;
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((data: { email: string; password: string }) =>
    z.object({ email: z.string().email(), password: z.string().min(1) }).parse(data),
  )
  .handler(async ({ data }) => {
    const expected = process.env.SITE_ADMIN_PASSWORD;
    if (!expected) {
      return { ok: false as const, error: "Admin password is not configured on the server." };
    }
    const allowedEmail = defaultContent.admin.email.trim().toLowerCase();
    const inputEmail = data.email.trim().toLowerCase();
    if (inputEmail !== allowedEmail) return { ok: false as const, error: "Invalid email or password." };
    if (!passwordMatches(data.password, expected))
      return { ok: false as const, error: "Invalid email or password." };
    const session = await useSession<AdminSessionData>(ADMIN_SESSION_CONFIG);
    await session.update({ admin: true, email: inputEmail });
    return { ok: true as const };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useSession<AdminSessionData>(ADMIN_SESSION_CONFIG);
  await session.clear();
  return { ok: true as const };
});

export const adminStatus = createServerFn({ method: "GET" }).handler(async () => {
  const session = await useSession<AdminSessionData>(ADMIN_SESSION_CONFIG);
  return { admin: Boolean(session.data.admin), email: session.data.email ?? null };
});

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------

export const updateSiteContent = createServerFn({ method: "POST" })
  .inputValidator((data: { content: unknown }) =>
    z.object({ content: z.record(z.string(), z.unknown()) }).parse(data),
  )
  .handler(async ({ data }) => {
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("site_content")
      .upsert({ id: 1, data: data.content as never, updated_at: new Date().toISOString() });
    if (error) throw new Error(error.message);
    return { ok: true as const, updated_at: new Date().toISOString() };
  });

// ---------------------------------------------------------------------------
// Storage: uploads
// ---------------------------------------------------------------------------

const MAX_UPLOAD_BYTES = 15 * 1024 * 1024; // 15 MB

const uploadSchema = z.object({
  /** Original filename (used to preserve extension). */
  filename: z.string().min(1).max(200),
  /** MIME type reported by the browser. */
  contentType: z.string().min(1).max(120),
  /** File contents as a base64 string. */
  base64: z.string().min(1),
  /** Optional sub-folder inside the bucket (e.g. "projects", "gallery"). */
  folder: z.string().max(60).optional(),
});

function sanitizeFolder(folder?: string): string {
  if (!folder) return "misc";
  return folder.replace(/[^a-z0-9-_]/gi, "").toLowerCase() || "misc";
}

function extFromName(name: string): string {
  const m = /\.([a-z0-9]{1,8})$/i.exec(name);
  return m ? m[1].toLowerCase() : "bin";
}

export const uploadSiteAsset = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => uploadSchema.parse(data))
  .handler(async ({ data }) => {
    await requireAdmin();
    const buffer = Buffer.from(data.base64, "base64");
    if (buffer.byteLength > MAX_UPLOAD_BYTES) {
      throw new Error(`File is too large (max ${MAX_UPLOAD_BYTES / 1024 / 1024} MB).`);
    }
    const folder = sanitizeFolder(data.folder);
    const ext = extFromName(data.filename);
    const key = `${folder}/${Date.now()}-${randomUUID()}.${ext}`;

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.storage
      .from("site-assets")
      .upload(key, buffer, { contentType: data.contentType, upsert: false });
    if (error) throw new Error(error.message);
    return { ok: true as const, path: key, url: `/api/public/asset/${key}` };
  });

export const deleteSiteAsset = createServerFn({ method: "POST" })
  .inputValidator((data: { path: string }) => z.object({ path: z.string().min(1) }).parse(data))
  .handler(async ({ data }) => {
    await requireAdmin();
    const path = data.path.startsWith("/api/public/asset/")
      ? data.path.slice("/api/public/asset/".length)
      : data.path;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.storage.from("site-assets").remove([path]);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });
