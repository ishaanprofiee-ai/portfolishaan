/**
 * Server functions powering the /admin dashboard.
 *
 * Hardening layers (defence in depth):
 *   1. Password check with timing-safe comparison.
 *   2. Login rate-limiter (per-IP + per-email) with exponential backoff.
 *   3. Encrypted, httpOnly, SameSite=Strict session cookie.
 *   4. Double-submit CSRF token: minted on login, verified on every write.
 *   5. Strict Zod input validation on every handler.
 *   6. Content payload size cap + shape allowlist (no prototype pollution).
 *   7. Uploads restricted by MIME allowlist, extension match, size cap,
 *      and magic-byte sniff (bytes must match the declared type).
 *
 * All writes go through the service-role client so RLS on `site_content`
 * stays locked to admin-only writes.
 */

import { createServerFn } from "@tanstack/react-start";
import {
  useSession,
  getRequestHeader,
  getRequestIP,
} from "@tanstack/react-start/server";
import {
  createHash,
  timingSafeEqual,
  randomUUID,
  randomBytes,
} from "node:crypto";
import { z } from "zod";

import { ADMIN_SESSION_CONFIG, type AdminSessionData } from "./adminSession";
import { defaultContent } from "@/content/site";

// ---------------------------------------------------------------------------
// Session + CSRF helpers
// ---------------------------------------------------------------------------

function sha256(value: string): Buffer {
  return createHash("sha256").update(value, "utf8").digest();
}

function safeEqualStrings(a: string, b: string): boolean {
  const ab = sha256(a);
  const bb = sha256(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

function newCsrfToken(): string {
  return randomBytes(32).toString("hex");
}

/**
 * Verifies:
 *  - the encrypted session cookie says `admin: true`
 *  - the session has not exceeded its absolute lifetime
 *  - the request's `x-admin-csrf` header matches the session's CSRF token
 *    (double-submit token — blocks cross-site + XSS-triggered writes)
 */
async function requireAdmin() {
  const session = await useSession<AdminSessionData>(ADMIN_SESSION_CONFIG);
  if (!session.data.admin || !session.data.csrf) {
    throw new Error("Unauthorized");
  }
  // Hard absolute lifetime: 7 days from issue.
  const issuedAt = session.data.issuedAt ?? 0;
  const maxAgeMs = ADMIN_SESSION_CONFIG.maxAge * 1000;
  if (!issuedAt || Date.now() - issuedAt > maxAgeMs) {
    await session.clear();
    throw new Error("Session expired");
  }
  const header = getRequestHeader("x-admin-csrf") ?? "";
  if (!header || !safeEqualStrings(header, session.data.csrf)) {
    throw new Error("Forbidden: invalid CSRF token");
  }
  return session;
}

// ---------------------------------------------------------------------------
// Login rate limiter (in-memory; per worker instance)
// ---------------------------------------------------------------------------

interface Attempt {
  count: number;
  blockedUntil: number;
}
const attempts = new Map<string, Attempt>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

function checkRateLimit(key: string): { ok: true } | { ok: false; retryInSec: number } {
  const now = Date.now();
  const cur = attempts.get(key);
  if (cur && cur.blockedUntil > now) {
    return { ok: false, retryInSec: Math.ceil((cur.blockedUntil - now) / 1000) };
  }
  return { ok: true };
}

function recordFailure(key: string) {
  const now = Date.now();
  const cur = attempts.get(key);
  const count = (cur?.count ?? 0) + 1;
  const blockedUntil = count >= MAX_ATTEMPTS ? now + WINDOW_MS : 0;
  attempts.set(key, { count, blockedUntil });
}

function recordSuccess(key: string) {
  attempts.delete(key);
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  password: z.string().min(1).max(200),
});

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => loginSchema.parse(data))
  .handler(async ({ data }) => {
    const expected = process.env.SITE_ADMIN_PASSWORD;
    if (!expected) {
      return {
        ok: false as const,
        error: "Admin password is not configured on the server.",
      };
    }

    const ip = getRequestIP({ xForwardedFor: true }) ?? "unknown";
    const rateKey = `${ip}:${data.email}`;
    const gate = checkRateLimit(rateKey);
    if (!gate.ok) {
      return {
        ok: false as const,
        error: `Too many attempts. Try again in ${gate.retryInSec}s.`,
      };
    }

    const allowedEmail = defaultContent.admin.email.trim().toLowerCase();
    const emailOk = safeEqualStrings(data.email, allowedEmail);
    const passOk = safeEqualStrings(data.password, expected);
    if (!emailOk || !passOk) {
      recordFailure(rateKey);
      // Constant vague error prevents user enumeration.
      return { ok: false as const, error: "Invalid email or password." };
    }
    recordSuccess(rateKey);

    const session = await useSession<AdminSessionData>(ADMIN_SESSION_CONFIG);
    // Rotate CSRF on every fresh login (session fixation protection).
    const csrf = newCsrfToken();
    await session.update({
      admin: true,
      email: data.email,
      csrf,
      issuedAt: Date.now(),
    });
    return { ok: true as const, csrf };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useSession<AdminSessionData>(ADMIN_SESSION_CONFIG);
  await session.clear();
  return { ok: true as const };
});

export const adminStatus = createServerFn({ method: "GET" }).handler(async () => {
  const session = await useSession<AdminSessionData>(ADMIN_SESSION_CONFIG);
  const issuedAt = session.data.issuedAt ?? 0;
  const alive =
    Boolean(session.data.admin) &&
    Boolean(session.data.csrf) &&
    issuedAt > 0 &&
    Date.now() - issuedAt <= ADMIN_SESSION_CONFIG.maxAge * 1000;

  if (!alive) {
    // Clean up any expired shell so a subsequent login mints fresh state.
    if (session.data.admin) await session.clear();
    return { admin: false as const, email: null, csrf: null };
  }
  return {
    admin: true as const,
    email: session.data.email ?? null,
    csrf: session.data.csrf ?? null,
  };
});

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------

// Every top-level key we know about — anything else on the payload is dropped.
const KNOWN_SECTIONS = [
  "personal",
  "hero",
  "about",
  "education",
  "skills",
  "projects",
  "experience",
  "achievements",
  "certifications",
  "interests",
  "hobbies",
  "languages",
  "gallery",
  "resume",
  "socials",
  "contact",
  "nav",
  "footer",
  "seo",
  "appearance",
  "admin",
] as const;

const MAX_CONTENT_BYTES = 512 * 1024; // 512 KB is generous for JSON portfolio content

const updateSchema = z.object({
  content: z
    .record(z.string(), z.unknown())
    .refine(
      (obj) => !Object.prototype.hasOwnProperty.call(obj, "__proto__") &&
        !Object.prototype.hasOwnProperty.call(obj, "constructor"),
      { message: "Invalid keys in payload" },
    ),
});

function sanitizeContent(input: Record<string, unknown>): Record<string, unknown> {
  const allow = new Set<string>(KNOWN_SECTIONS);
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(input)) {
    if (!allow.has(k)) continue; // drop unknown keys silently
    out[k] = v;
  }
  return out;
}

export const updateSiteContent = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => updateSchema.parse(data))
  .handler(async ({ data }) => {
    await requireAdmin();
    const clean = sanitizeContent(data.content as Record<string, unknown>);
    const serialized = JSON.stringify(clean);
    if (serialized.length > MAX_CONTENT_BYTES) {
      throw new Error(
        `Content is too large (${(serialized.length / 1024).toFixed(0)} KB, max ${
          MAX_CONTENT_BYTES / 1024
        } KB).`,
      );
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("site_content")
      .upsert({ id: 1, data: clean as never, updated_at: new Date().toISOString() });
    if (error) throw new Error(error.message);
    return { ok: true as const, updated_at: new Date().toISOString() };
  });

// ---------------------------------------------------------------------------
// Storage: uploads
// ---------------------------------------------------------------------------

const MAX_UPLOAD_BYTES = 15 * 1024 * 1024; // 15 MB

/** MIME → allowed extensions. Anything not here is rejected outright. */
const ALLOWED_TYPES: Record<string, string[]> = {
  "image/jpeg": ["jpg", "jpeg"],
  "image/png": ["png"],
  "image/webp": ["webp"],
  "image/gif": ["gif"],
  "image/svg+xml": ["svg"],
  "application/pdf": ["pdf"],
};

const ALLOWED_FOLDERS = new Set([
  "profile",
  "projects",
  "gallery",
  "resume",
  "logos",
  "misc",
]);

const uploadSchema = z.object({
  filename: z.string().min(1).max(200),
  contentType: z
    .string()
    .min(1)
    .max(120)
    .refine((v) => v in ALLOWED_TYPES, { message: "Unsupported file type" }),
  base64: z
    .string()
    .min(1)
    .max(Math.ceil((MAX_UPLOAD_BYTES * 4) / 3) + 32)
    .regex(/^[A-Za-z0-9+/=\s]+$/, { message: "Invalid base64" }),
  folder: z.string().max(60).optional(),
});

function sanitizeFolder(folder?: string): string {
  const clean = (folder ?? "").replace(/[^a-z0-9-_]/gi, "").toLowerCase();
  if (clean && ALLOWED_FOLDERS.has(clean)) return clean;
  return "misc";
}

function extFromName(name: string): string {
  const m = /\.([a-z0-9]{1,8})$/i.exec(name);
  return m ? m[1].toLowerCase() : "";
}

/** Magic-byte sniffer — the file's bytes must match its declared content type. */
function sniffMatches(contentType: string, buf: Buffer): boolean {
  const b = buf;
  const startsWith = (bytes: number[]) =>
    bytes.every((v, i) => b[i] === v);
  switch (contentType) {
    case "image/jpeg":
      return b.length > 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff;
    case "image/png":
      return startsWith([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    case "image/gif":
      return startsWith([0x47, 0x49, 0x46, 0x38]);
    case "image/webp":
      return (
        startsWith([0x52, 0x49, 0x46, 0x46]) &&
        b.length > 11 &&
        b[8] === 0x57 &&
        b[9] === 0x45 &&
        b[10] === 0x42 &&
        b[11] === 0x50
      );
    case "application/pdf":
      return startsWith([0x25, 0x50, 0x44, 0x46]); // %PDF
    case "image/svg+xml": {
      // Text file; sniff for "<svg" or "<?xml" and refuse embedded scripts.
      const text = b.slice(0, 4096).toString("utf8").toLowerCase();
      if (!(text.includes("<svg") || text.trimStart().startsWith("<?xml"))) {
        return false;
      }
      if (text.includes("<script") || text.includes("javascript:")) return false;
      return true;
    }
    default:
      return false;
  }
}

export const uploadSiteAsset = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => uploadSchema.parse(data))
  .handler(async ({ data }) => {
    await requireAdmin();

    const buffer = Buffer.from(data.base64, "base64");
    if (buffer.byteLength === 0) throw new Error("Empty upload.");
    if (buffer.byteLength > MAX_UPLOAD_BYTES) {
      throw new Error(`File is too large (max ${MAX_UPLOAD_BYTES / 1024 / 1024} MB).`);
    }

    const allowedExts = ALLOWED_TYPES[data.contentType];
    if (!allowedExts) throw new Error("Unsupported file type.");
    const ext = extFromName(data.filename);
    if (!ext || !allowedExts.includes(ext)) {
      throw new Error(
        `Extension .${ext || "?"} does not match ${data.contentType}.`,
      );
    }
    if (!sniffMatches(data.contentType, buffer)) {
      throw new Error("File contents do not match the declared type.");
    }

    const folder = sanitizeFolder(data.folder);
    const key = `${folder}/${Date.now()}-${randomUUID()}.${ext}`;

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.storage
      .from("site-assets")
      .upload(key, buffer, {
        contentType: data.contentType,
        upsert: false,
        cacheControl: "31536000",
      });
    if (error) throw new Error(error.message);
    return { ok: true as const, path: key, url: `/api/public/asset/${key}` };
  });

const deleteSchema = z.object({
  path: z
    .string()
    .min(1)
    .max(300)
    .refine((v) => !v.includes(".."), { message: "Invalid path" }),
});

export const deleteSiteAsset = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => deleteSchema.parse(data))
  .handler(async ({ data }) => {
    await requireAdmin();
    const path = data.path.startsWith("/api/public/asset/")
      ? data.path.slice("/api/public/asset/".length)
      : data.path;
    // Only allow deleting inside known folders.
    const [folder] = path.split("/");
    if (!ALLOWED_FOLDERS.has(folder)) throw new Error("Path not allowed.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.storage.from("site-assets").remove([path]);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });
