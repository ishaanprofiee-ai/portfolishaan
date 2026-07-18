/**
 * Server functions for the /admin dashboard:
 *  - adminLogin: password-based login, mints an encrypted session cookie
 *  - adminLogout: clears the session
 *  - adminStatus: reports whether the caller is logged in
 *  - updateSiteContent: writes new content JSON to the database
 *
 * The password lives in the SITE_ADMIN_PASSWORD secret (server-side only).
 * The session cookie is encrypted with ADMIN_SESSION_SECRET.
 */

import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { createHash, timingSafeEqual } from "node:crypto";
import { z } from "zod";

import { ADMIN_SESSION_CONFIG, type AdminSessionData } from "./adminSession";
import { defaultContent } from "@/content/site";

function passwordMatches(input: string, expected: string): boolean {
  const a = createHash("sha256").update(input, "utf8").digest();
  const b = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(a, b);
}

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((data: { email: string; password: string }) =>
    z.object({ email: z.string().email(), password: z.string().min(1) }).parse(data),
  )
  .handler(async ({ data }) => {
    const expected = process.env.SITE_ADMIN_PASSWORD;
    if (!expected) {
      return { ok: false as const, error: "Admin password is not configured on the server." };
    }

    // The admin email lives in content; fall back to the compiled default.
    // (We can't read the DB here without escalating; using the default is safe
    // because the email is not a secret and changes rarely.)
    const allowedEmail = defaultContent.admin.email.trim().toLowerCase();
    const inputEmail = data.email.trim().toLowerCase();

    if (inputEmail !== allowedEmail) {
      return { ok: false as const, error: "Invalid email or password." };
    }
    if (!passwordMatches(data.password, expected)) {
      return { ok: false as const, error: "Invalid email or password." };
    }

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

/**
 * Writes the site_content row via the service-role client. Requires an active
 * admin session cookie.
 */
export const updateSiteContent = createServerFn({ method: "POST" })
  .inputValidator((data: { content: unknown }) =>
    z.object({ content: z.record(z.string(), z.unknown()) }).parse(data),
  )
  .handler(async ({ data }) => {
    const session = await useSession<AdminSessionData>(ADMIN_SESSION_CONFIG);
    if (!session.data.admin) {
      throw new Error("Unauthorized");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("site_content")
      .upsert({ id: 1, data: data.content as never, updated_at: new Date().toISOString() });
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });
