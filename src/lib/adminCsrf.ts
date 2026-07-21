/**
 * Client-side CSRF token holder for the /admin dashboard.
 *
 * The token is minted server-side on login and returned to the client via
 * `adminLogin` and `adminStatus`. We keep it in module memory and mirror the
 * signed admin-session fallback in tab-scoped sessionStorage so mobile preview
 * browsers that block third-party cookies can still save/upload after refresh.
 * The server verifies both the signed session header and the CSRF header.
 */
import { createMiddleware } from "@tanstack/react-start";

let csrfToken: string | null = null;
let adminSessionToken: string | null = null;
const TAB_SESSION_KEY = "portfolio.admin.session.v1";

function loadFromTabSession() {
  if (typeof window === "undefined") return;
  if (csrfToken && adminSessionToken) return;
  try {
    const raw = window.sessionStorage.getItem(TAB_SESSION_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as { csrf?: string; token?: string };
    csrfToken = parsed.csrf ?? null;
    adminSessionToken = parsed.token ?? null;
  } catch {
    window.sessionStorage.removeItem(TAB_SESSION_KEY);
  }
}

export function setAdminCsrf(token: string | null) {
  csrfToken = token;
  persistTabSession();
}

export function setAdminAuth(csrf: string | null, token: string | null) {
  csrfToken = csrf;
  adminSessionToken = token;
  persistTabSession();
}

function persistTabSession() {
  if (typeof window === "undefined") return;
  if (!csrfToken || !adminSessionToken) {
    window.sessionStorage.removeItem(TAB_SESSION_KEY);
    return;
  }
  window.sessionStorage.setItem(
    TAB_SESSION_KEY,
    JSON.stringify({ csrf: csrfToken, token: adminSessionToken }),
  );
}

export function getAdminCsrf(): string | null {
  loadFromTabSession();
  return csrfToken;
}

/**
 * Registered as a client-side `functionMiddleware` in `src/start.ts`.
 * It appends `x-admin-csrf` to admin RPCs whenever a token is present.
 */
export const attachAdminCsrf = createMiddleware({ type: "function" }).client(
  async ({ next }) => {
    loadFromTabSession();
    const headers: Record<string, string> = {};
    if (csrfToken) headers["x-admin-csrf"] = csrfToken;
    if (adminSessionToken) headers["x-admin-session"] = adminSessionToken;
    return Object.keys(headers).length ? next({ headers }) : next({});
  },
);
