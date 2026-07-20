/**
 * Client-side CSRF token holder for the /admin dashboard.
 *
 * The token is minted server-side on login and returned to the client via
 * `adminLogin` and `adminStatus`. We keep it in module memory (never
 * localStorage — that would expose it to any XSS) and attach it as
 * `x-admin-csrf` on every admin server function call via the middleware
 * below. The server verifies it against the encrypted session cookie
 * (classic double-submit token pattern).
 */
import { createMiddleware } from "@tanstack/react-start";

let csrfToken: string | null = null;

export function setAdminCsrf(token: string | null) {
  csrfToken = token;
}

export function getAdminCsrf(): string | null {
  return csrfToken;
}

/**
 * Registered as a client-side `functionMiddleware` in `src/start.ts`.
 * It appends `x-admin-csrf` to admin RPCs whenever a token is present.
 */
export const attachAdminCsrf = createMiddleware({ type: "function" }).client(
  async ({ next }) => {
    if (!csrfToken) return next({});
    return next({ headers: { "x-admin-csrf": csrfToken } });
  },
);
