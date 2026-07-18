/**
 * /admin — password-protected dashboard for editing all site content.
 *
 * Login: uses the ishaanprofiee@gmail.com email + SITE_ADMIN_PASSWORD secret.
 * Storage: writes to Lovable Cloud `site_content` table; changes go live
 * instantly across the site via realtime subscription.
 */

import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";
import { LogOut, Save, RefreshCw, ExternalLink } from "lucide-react";

import { adminLogin, adminLogout, adminStatus, updateSiteContent } from "@/lib/admin.functions";
import { defaultContent, mergeContent, type SiteContent } from "@/content/site";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Portfolio" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [status, setStatus] = useState<"loading" | "out" | "in">("loading");
  const statusFn = useServerFn(adminStatus);

  useEffect(() => {
    void statusFn().then((r) => setStatus(r.admin ? "in" : "out"));
  }, [statusFn]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {status === "loading" && (
        <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
          Loading…
        </div>
      )}
      {status === "out" && <LoginView onSuccess={() => setStatus("in")} />}
      {status === "in" && <Dashboard onSignOut={() => setStatus("out")} />}
    </div>
  );
}

function LoginView({ onSuccess }: { onSuccess: () => void }) {
  const login = useServerFn(adminLogin);
  const [email, setEmail] = useState(defaultContent.admin.email);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const r = await login({ data: { email, password } });
      if (r.ok) onSuccess();
      else setError(r.error);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form onSubmit={submit} className="glass-card w-full max-w-sm space-y-4 p-8">
        <div>
          <div className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Admin</div>
          <h1 className="mt-2 font-display text-3xl">Sign in</h1>
        </div>
        <label className="block">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 w-full rounded-xl border border-glass-border bg-white/[0.03] px-4 py-2.5 text-sm outline-none focus:border-white/25"
          />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoFocus
            className="mt-1 w-full rounded-xl border border-glass-border bg-white/[0.03] px-4 py-2.5 text-sm outline-none focus:border-white/25"
          />
        </label>
        {error && <div className="text-sm text-red-400">{error}</div>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl border border-white/20 bg-white/10 py-2.5 text-sm hover:bg-white/15 disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
        <p className="text-xs text-muted-foreground">
          Password is set via the <code className="rounded bg-white/5 px-1">SITE_ADMIN_PASSWORD</code> secret.
        </p>
      </form>
    </div>
  );
}

function Dashboard({ onSignOut }: { onSignOut: () => void }) {
  const logout = useServerFn(adminLogout);
  const save = useServerFn(updateSiteContent);
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [text, setText] = useState<string>(() => JSON.stringify(defaultContent, null, 2));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("site_content").select("data").eq("id", 1).maybeSingle();
      if (error) throw error;
      const merged = mergeContent(data?.data);
      setContent(merged);
      setText(JSON.stringify(merged, null, 2));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const parsed = useMemo(() => {
    try {
      return { ok: true as const, value: JSON.parse(text) };
    } catch (e) {
      return { ok: false as const, error: e instanceof Error ? e.message : "Invalid JSON" };
    }
  }, [text]);

  const doSave = async () => {
    if (!parsed.ok) return;
    setSaving(true);
    setError(null);
    try {
      await save({ data: { content: parsed.value } });
      setSavedAt(new Date());
      setContent(mergeContent(parsed.value));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  };

  const doSignOut = async () => {
    await logout();
    onSignOut();
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Admin Dashboard</div>
          <h1 className="mt-1 font-display text-3xl">{content.personal.name}</h1>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-xl border border-glass-border bg-glass px-3 py-2 text-xs hover:border-white/25"
          >
            <ExternalLink className="h-3.5 w-3.5" /> View site
          </a>
          <button
            onClick={load}
            className="inline-flex items-center gap-1.5 rounded-xl border border-glass-border bg-glass px-3 py-2 text-xs hover:border-white/25"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Reload
          </button>
          <button
            onClick={doSignOut}
            className="inline-flex items-center gap-1.5 rounded-xl border border-glass-border bg-glass px-3 py-2 text-xs hover:border-white/25"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </div>
      </header>

      <div className="mb-4 rounded-2xl border border-glass-border bg-glass p-4 text-sm text-muted-foreground">
        Edit the JSON below. Every field on the site — name, hero, education, skills, projects,
        gallery, resume URL, socials — lives here. Save to publish live. Structure and defaults
        live in <code className="rounded bg-white/5 px-1">src/content/site.ts</code>.
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_auto_auto] md:items-center">
        <div className="text-xs text-muted-foreground">
          {loading
            ? "Loading current content…"
            : parsed.ok
              ? savedAt
                ? `Saved at ${savedAt.toLocaleTimeString()}`
                : "Ready"
              : `JSON error: ${parsed.error}`}
        </div>
        <button
          onClick={() => setText(JSON.stringify(defaultContent, null, 2))}
          className="rounded-xl border border-glass-border bg-glass px-3 py-2 text-xs hover:border-white/25"
        >
          Reset to defaults
        </button>
        <button
          disabled={!parsed.ok || saving}
          onClick={doSave}
          className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-xs hover:bg-white/15 disabled:opacity-50"
        >
          <Save className="h-3.5 w-3.5" /> {saving ? "Saving…" : "Save changes"}
        </button>
      </div>

      {error && <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{error}</div>}

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        spellCheck={false}
        className="mt-4 h-[70vh] w-full rounded-2xl border border-glass-border bg-black/40 p-4 font-mono text-xs text-foreground/90 outline-none focus:border-white/25"
      />

      <p className="mt-4 text-xs text-muted-foreground">
        Tip: paste image URLs directly into project/gallery <code>image</code> fields, or drop
        files into <code>public/site-assets/</code> and reference them like{" "}
        <code>/site-assets/your-file.jpg</code>. See <code>src/assets/site/README.md</code>.
      </p>
    </div>
  );
}
