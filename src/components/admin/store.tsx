/**
 * Admin draft store — single source of truth for the /admin dashboard.
 *
 * Design:
 *   • `savedSnapshot` (STATE, not ref) holds the last known DB-persisted copy.
 *   • `draft` holds in-progress edits.
 *   • `dirty` = deep-equal comparison of the two.
 *
 * After a successful save we re-hydrate BOTH from the server response, so a
 * browser refresh (or the realtime subscription on the public site) always
 * reflects exactly what's in the database. There is no other local state.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";

import { supabase } from "@/integrations/supabase/client";
import { defaultContent, mergeContent, type SiteContent } from "@/content/site";
import { updateSiteContent } from "@/lib/admin.functions";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

type SetPathFn = <K extends keyof SiteContent>(key: K, value: SiteContent[K]) => void;

interface DraftContextValue {
  draft: SiteContent;
  live: SiteContent;
  dirty: boolean;
  loading: boolean;
  saving: boolean;
  status: SaveStatus;
  errorMessage: string | null;
  lastSavedAt: Date | null;
  lastPublishedAt: Date | null;
  autosave: boolean;
  setAutosave: (v: boolean) => void;
  setSection: SetPathFn;
  update: (updater: (prev: SiteContent) => SiteContent) => void;
  reset: () => void;
  reload: () => Promise<void>;
  save: () => Promise<boolean>;
  loadDefaults: () => void;
}

const DraftContext = createContext<DraftContextValue | null>(null);

/** Stable stringify so key ordering can't produce false-positive dirty flags. */
function stableStringify(value: unknown): string {
  return JSON.stringify(value, (_k, v) => {
    if (v && typeof v === "object" && !Array.isArray(v)) {
      const sorted: Record<string, unknown> = {};
      for (const k of Object.keys(v as Record<string, unknown>).sort()) {
        sorted[k] = (v as Record<string, unknown>)[k];
      }
      return sorted;
    }
    return v;
  });
}

export function DraftProvider({ children }: { children: ReactNode }) {
  const saveFn = useServerFn(updateSiteContent);
  const [savedSnapshot, setSavedSnapshot] = useState<SiteContent>(defaultContent);
  const [draft, setDraft] = useState<SiteContent>(defaultContent);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [lastPublishedAt, setLastPublishedAt] = useState<Date | null>(null);
  const [autosave, setAutosaveState] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem("admin.autosave") === "1";
  });

  const setAutosave = useCallback((v: boolean) => {
    setAutosaveState(v);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("admin.autosave", v ? "1" : "0");
    }
  }, []);

  const dirty = useMemo(
    () => stableStringify(draft) !== stableStringify(savedSnapshot),
    [draft, savedSnapshot],
  );

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("site_content")
        .select("data, updated_at")
        .eq("id", 1)
        .maybeSingle();
      if (error) throw error;
      const merged = mergeContent(data?.data);
      setSavedSnapshot(merged);
      setDraft(merged);
      if (data?.updated_at) setLastPublishedAt(new Date(data.updated_at));
    } catch (err) {
      console.warn("[admin] Failed to load site_content, using defaults:", err);
      setSavedSnapshot(defaultContent);
      setDraft(defaultContent);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  // Warn on unload if there are unsaved changes.
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!dirty) return;
      e.preventDefault();
      e.returnValue = "You have unsaved changes.";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  const setSection = useCallback<SetPathFn>((key, value) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }, []);

  const update = useCallback((updater: (prev: SiteContent) => SiteContent) => {
    setDraft((prev) => updater(prev));
  }, []);

  const reset = useCallback(() => setDraft(savedSnapshot), [savedSnapshot]);
  const loadDefaults = useCallback(() => setDraft(defaultContent), []);

  const doSave = useCallback(async (): Promise<boolean> => {
    setStatus("saving");
    setErrorMessage(null);
    // Snapshot the draft at call-time so late edits don't reset dirty falsely.
    const snapshot = draft;
    try {
      const res = await saveFn({
        data: { content: snapshot as unknown as Record<string, unknown> },
      });
      // Re-hydrate from the value we just committed (the DB now matches).
      setSavedSnapshot(snapshot);
      setDraft((cur) =>
        stableStringify(cur) === stableStringify(snapshot) ? snapshot : cur,
      );
      const when = res?.updated_at ? new Date(res.updated_at) : new Date();
      setLastSavedAt(when);
      setLastPublishedAt(when);
      setStatus("saved");
      toast.success("Published — live site updated");
      return true;
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to publish";
      setErrorMessage(message);
      setStatus("error");
      toast.error(message);
      return false;
    }
  }, [draft, saveFn]);

  // Auto-flip "saved" back to "idle" after a short delay for UX.
  useEffect(() => {
    if (status !== "saved") return;
    const t = window.setTimeout(() => setStatus("idle"), 2400);
    return () => window.clearTimeout(t);
  }, [status]);

  // Optional autosave every 30s while dirty.
  const savingRef = useRef(false);
  useEffect(() => {
    savingRef.current = status === "saving";
  }, [status]);
  useEffect(() => {
    if (!autosave) return;
    const interval = window.setInterval(() => {
      if (!dirty || savingRef.current) return;
      void doSave();
    }, 30_000);
    return () => window.clearInterval(interval);
  }, [autosave, dirty, doSave]);

  const value = useMemo<DraftContextValue>(
    () => ({
      draft,
      live: savedSnapshot,
      dirty,
      loading,
      saving: status === "saving",
      status,
      errorMessage,
      lastSavedAt,
      lastPublishedAt,
      autosave,
      setAutosave,
      setSection,
      update,
      reset,
      reload: load,
      save: doSave,
      loadDefaults,
    }),
    [
      draft,
      savedSnapshot,
      dirty,
      loading,
      status,
      errorMessage,
      lastSavedAt,
      lastPublishedAt,
      autosave,
      setAutosave,
      setSection,
      update,
      reset,
      load,
      doSave,
      loadDefaults,
    ],
  );

  return <DraftContext.Provider value={value}>{children}</DraftContext.Provider>;
}

export function useDraft() {
  const ctx = useContext(DraftContext);
  if (!ctx) throw new Error("useDraft must be used inside <DraftProvider>");
  return ctx;
}

/** Convenience: bind a single top-level section to a { value, onChange } pair. */
export function useSection<K extends keyof SiteContent>(key: K) {
  const { draft, setSection } = useDraft();
  return [draft[key], (v: SiteContent[K]) => setSection(key, v)] as const;
}
