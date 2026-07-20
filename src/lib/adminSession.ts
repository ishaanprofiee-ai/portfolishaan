/**
 * Shared server-only session config for the /admin dashboard.
 * Do not import this from client code.
 *
 * Security notes:
 *  - `httpOnly` keeps the session cookie out of JS.
 *  - `sameSite: "strict"` blocks cross-site requests entirely (defence in
 *    depth against CSRF, on top of our double-submit token).
 *  - `secure` requires HTTPS in production.
 */
export const ADMIN_SESSION_CONFIG = {
  password:
    process.env.ADMIN_SESSION_SECRET ??
    "dev-only-fallback-please-set-ADMIN_SESSION_SECRET-in-prod",
  name: "portfolio-admin",
  maxAge: 60 * 60 * 24 * 7, // 7 days
  cookie: {
    httpOnly: true as const,
    secure: true as const,
    sameSite: "strict" as const,
    path: "/",
  },
};

export type AdminSessionData = {
  admin?: boolean;
  email?: string;
  /** Double-submit CSRF token bound to this session. */
  csrf?: string;
  /** Session issue time (ms since epoch) — used to expire long-lived tokens. */
  issuedAt?: number;
};
