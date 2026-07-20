/**
 * /admin — content management system for the portfolio.
 *
 * Data flow (single source of truth):
 *   1. Load site_content row from the DB into a draft.
 *   2. Section editors mutate the draft (via useDraft/setSection).
 *   3. Publish writes the whole draft back to the DB.
 *   4. The public site's SiteContentProvider is subscribed to postgres_changes
 *      on site_content and refreshes every visible component immediately.
 *
 * The portfolio itself never reads its own hardcoded copies of anything —
 * every component consumes `useSite()`.
 */

import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  LogOut,
  Save,
  RefreshCw,
  ExternalLink,
  RotateCcw,
  Home,
  User,
  Sparkles,
  BookOpen,
  GraduationCap,
  Wrench,
  Layers,
  Briefcase,
  Trophy,
  BadgeCheck,
  Heart,
  Image as ImageIcon,
  FileText,
  Link as LinkIcon,
  MessageCircle,
  Compass,
  Search,
  Palette,
  Code2,
  Menu,
  CheckCircle2,
} from "lucide-react";

import { adminLogin, adminLogout, adminStatus } from "@/lib/admin.functions";
import { setAdminCsrf } from "@/lib/adminCsrf";
import { defaultContent } from "@/content/site";
import { DraftProvider, useDraft } from "@/components/admin/store";
import {
  AboutEditor,
  AchievementsEditor,
  AdvancedEditor,
  AppearanceEditor,
  CertificationsEditor,
  ContactEditor,
  DashboardOverview,
  EducationEditor,
  ExperienceEditor,
  GalleryEditor,
  HeroEditor,
  InterestsEditor,
  NavFooterEditor,
  PersonalEditor,
  ProjectsEditor,
  ResumeEditor,
  SeoEditor,
  SkillsEditor,
  SocialEditor,
} from "@/components/admin/sections";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Portfolio" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

// ---------------------------------------------------------------------------
// Auth gate
// ---------------------------------------------------------------------------

function AdminPage() {
  const [status, setStatus] = useState<"loading" | "out" | "in">("loading");
  const statusFn = useServerFn(adminStatus);
  useEffect(() => {
    void statusFn().then((r) => {
      setAdminCsrf(r.csrf ?? null);
      setStatus(r.admin ? "in" : "out");
    });
  }, [statusFn]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {status === "loading" && (
        <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
          Loading…
        </div>
      )}
      {status === "out" && <LoginView onSuccess={() => setStatus("in")} />}
      {status === "in" && (
        <DraftProvider>
          <Dashboard onSignOut={() => setStatus("out")} />
        </DraftProvider>
      )}
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
      if (r.ok) {
        setAdminCsrf(r.csrf ?? null);
        onSuccess();
      } else setError(r.error);
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
      </form>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sidebar nav
// ---------------------------------------------------------------------------

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  render: (go: (id: string) => void) => ReactNode;
}

const NAV: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: Home, render: (go) => <DashboardOverview onGo={go} /> },
  { id: "personal", label: "Personal", icon: User, render: () => <PersonalEditor /> },
  { id: "hero", label: "Hero", icon: Sparkles, render: () => <HeroEditor /> },
  { id: "about", label: "About", icon: BookOpen, render: () => <AboutEditor /> },
  { id: "education", label: "Education & Journey", icon: GraduationCap, render: () => <EducationEditor /> },
  { id: "skills", label: "Skills", icon: Wrench, render: () => <SkillsEditor /> },
  { id: "projects", label: "Projects", icon: Layers, render: () => <ProjectsEditor /> },
  { id: "experience", label: "Experience", icon: Briefcase, render: () => <ExperienceEditor /> },
  { id: "achievements", label: "Achievements", icon: Trophy, render: () => <AchievementsEditor /> },
  { id: "certifications", label: "Certifications", icon: BadgeCheck, render: () => <CertificationsEditor /> },
  { id: "interests", label: "Interests & Hobbies", icon: Heart, render: () => <InterestsEditor /> },
  { id: "gallery", label: "Gallery", icon: ImageIcon, render: () => <GalleryEditor /> },
  { id: "resume", label: "Resume", icon: FileText, render: () => <ResumeEditor /> },
  { id: "social", label: "Social links", icon: LinkIcon, render: () => <SocialEditor /> },
  { id: "contact", label: "Contact", icon: MessageCircle, render: () => <ContactEditor /> },
  { id: "nav", label: "Navigation & Footer", icon: Compass, render: () => <NavFooterEditor /> },
  { id: "seo", label: "SEO & social", icon: Search, render: () => <SeoEditor /> },
  { id: "appearance", label: "Appearance", icon: Palette, render: () => <AppearanceEditor /> },
  { id: "advanced", label: "Advanced (JSON)", icon: Code2, render: () => <AdvancedEditor /> },
];

// ---------------------------------------------------------------------------
// Dashboard shell
// ---------------------------------------------------------------------------

function Dashboard({ onSignOut }: { onSignOut: () => void }) {
  const logout = useServerFn(adminLogout);
  const { draft, dirty, saving, save, reset, reload, loading, lastSavedAt } = useDraft();
  const [active, setActive] = useState<string>(() => {
    if (typeof window === "undefined") return "dashboard";
    return window.location.hash.replace(/^#/, "") || "dashboard";
  });
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.history.replaceState(null, "", `#${active}`);
  }, [active]);

  // Cmd/Ctrl+S to publish
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (dirty && !saving) void save();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [dirty, saving, save]);

  const filtered = useMemo(
    () => (query.trim() ? NAV.filter((n) => n.label.toLowerCase().includes(query.trim().toLowerCase())) : NAV),
    [query],
  );

  const activeItem = NAV.find((n) => n.id === active) ?? NAV[0];

  const doSignOut = async () => {
    if (dirty && !confirm("You have unsaved changes. Sign out anyway?")) return;
    await logout();
    setAdminCsrf(null);
    onSignOut();
  };

  return (
    <div className="grid min-h-screen w-full bg-background text-foreground md:grid-cols-[260px_1fr]">
      {/* Sidebar */}
      <aside
        className={cn(
          "border-r border-glass-border bg-black/40 backdrop-blur-xl md:sticky md:top-0 md:h-screen md:overflow-hidden",
          "fixed inset-y-0 left-0 z-40 w-[260px] transform transition-transform md:static md:transform-none",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="flex h-full flex-col">
          <div className="border-b border-glass-border px-4 py-4">
            <div className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">Portfolio CMS</div>
            <div className="mt-1 truncate font-display text-lg">{draft.personal.name}</div>
          </div>
          <div className="border-b border-glass-border p-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search sections…"
                className="w-full rounded-xl border border-glass-border bg-white/[0.03] py-2 pl-8 pr-3 text-xs outline-none focus:border-white/25"
              />
            </div>
          </div>
          <nav className="flex-1 overflow-y-auto p-2">
            {filtered.map((n) => {
              const Icon = n.icon;
              return (
                <button
                  key={n.id}
                  onClick={() => {
                    setActive(n.id);
                    setMobileOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm transition-colors",
                    active === n.id
                      ? "border border-white/15 bg-white/[0.06] text-foreground"
                      : "border border-transparent text-muted-foreground hover:bg-white/[0.03] hover:text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="truncate">{n.label}</span>
                </button>
              );
            })}
          </nav>
          <div className="border-t border-glass-border p-3">
            <button
              onClick={doSignOut}
              className="flex w-full items-center gap-2 rounded-xl border border-glass-border bg-white/[0.02] px-3 py-2 text-xs text-muted-foreground hover:border-white/25 hover:text-foreground"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </div>
        </div>
      </aside>

      {mobileOpen && (
        <button
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
        />
      )}

      {/* Main */}
      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-glass-border bg-background/80 px-4 py-3 backdrop-blur-xl md:px-8">
          <button
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
            className="rounded-lg border border-glass-border bg-white/[0.03] p-2 md:hidden"
          >
            <Menu className="h-4 w-4" />
          </button>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
              {activeItem.label}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px]",
                  dirty
                    ? "border-amber-400/40 bg-amber-400/10 text-amber-200"
                    : "border-emerald-400/40 bg-emerald-400/10 text-emerald-200",
                )}
              >
                {dirty ? (
                  <>
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-300" /> Unsaved
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-3 w-3" /> Saved
                  </>
                )}
              </span>
              {loading && <span className="text-xs text-muted-foreground">Loading…</span>}
              {lastSavedAt && !dirty && (
                <span className="text-xs text-muted-foreground">
                  Last published {lastSavedAt.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-glass-border bg-white/[0.02] px-3 py-2 text-xs hover:border-white/25"
            >
              <ExternalLink className="h-3.5 w-3.5" /> View site
            </a>
            <button
              onClick={() => void reload()}
              className="inline-flex items-center gap-1.5 rounded-xl border border-glass-border bg-white/[0.02] px-3 py-2 text-xs hover:border-white/25"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Reload
            </button>
            <button
              onClick={reset}
              disabled={!dirty}
              className="inline-flex items-center gap-1.5 rounded-xl border border-glass-border bg-white/[0.02] px-3 py-2 text-xs hover:border-white/25 disabled:opacity-40"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Discard
            </button>
            <button
              onClick={() => void save()}
              disabled={!dirty || saving}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-xs hover:bg-white/15 disabled:opacity-50"
            >
              <Save className="h-3.5 w-3.5" /> {saving ? "Publishing…" : "Publish"}
            </button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-4xl px-4 py-8 md:px-8">
          {activeItem.render(setActive)}
          <div className="h-24" />
        </main>
      </div>
    </div>
  );
}
