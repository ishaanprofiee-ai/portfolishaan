/**
 * Shared server-only session config for the /admin dashboard.
 * Do not import this from client code.
 */
export const ADMIN_SESSION_CONFIG = {
  password: process.env.ADMIN_SESSION_SECRET ?? "dev-only-fallback-please-set-ADMIN_SESSION_SECRET-in-prod",
  name: "portfolio-admin",
  maxAge: 60 * 60 * 24 * 7, // 7 days
  cookie: {
    httpOnly: true as const,
    secure: true as const,
    sameSite: "lax" as const,
    path: "/",
  },
};

export type AdminSessionData = { admin?: boolean; email?: string };
