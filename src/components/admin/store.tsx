/**
 * Admin draft store — the single stateful hub of the /admin dashboard.
 *
 * Keeps the "draft" copy of SiteContent in memory (initialised from the
 * live DB row, falling back to defaults) and exposes helpers to:
 *   - read the whole draft or a slice
 *   - patch any path in the tree with strong typing
 *   - track dirty state, save, and reload
 *
 * The portfolio itself keeps reading from `useSite()`; the admin edits are
 * only visible to visitors once `save()` succeeds, at which point every
 * component refreshes via the realtime subscription in useSiteContent.
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

type SetPathFn = <K extends keyof SiteContent>(key: K, value: SiteContent[K]) => void;

interface DraftContextValue {
  draft: SiteContent;
  live: SiteContent;
  dirty: boolean;
  loading: boolean;
  saving: boolean;
  lastSavedAt: Date | null;
  setSection: SetPathFn;
  update: (updater: (prev: SiteContent) => SiteContent) => void;
  reset: () => void;
  reload: () => Promise<void>;
  save: () => Promise<void>;
  loadDefaults: () => void;
}

const DraftContext = createContext<DraftContextValue | null>(null);

export function DraftProvider({ children }: { children: ReactNode }) {
  const save = useServerFn(updateSiteContent);
  const [live, setLive] = useState<SiteContent>(defaultContent);
  const [draft, setDraft] = useState<SiteContent>(defaultContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const initial = useRef<string>(JSON.stringify(defaultContent));

  const dirty = useMemo(() => JSON.stringify(draft) !== initial.current, [draft]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("site_content")
        .select("data")
        .eq("id", 1)
        .maybeSingle();
      if (error) throw error;
      const merged = mergeContent(data?.data);
      setLive(merged);
      setDraft(merged);
      initial.current = JSON.stringify(merged);
    } catch (err) {
      console.warn("[admin] Failed to load site_content, using defaults:", err);
      setLive(defaultContent);
      setDraft(defaultContent);
      initial.current = JSON.stringify(defaultContent);
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

  const reset = useCallback(() => setDraft(live), [live]);
  const loadDefaults = useCallback(() => setDraft(defaultContent), []);

  const doSave = useCallback(async () => {
    setSaving(true);
    try {
      await save({ data: { content: draft as unknown as Record<string, unknown> } });
      setLive(draft);
      initial.current = JSON.stringify(draft);
      setLastSavedAt(new Date());
      toast.success("Changes published to the live site");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to publish");
    } finally {
      setSaving(false);
    }
  }, [draft, save]);

  const value = useMemo<DraftContextValue>(
    () => ({
      draft,
      live,
      dirty,
      loading,
      saving,
      lastSavedAt,
      setSection,
      update,
      reset,
      reload: load,
      save: doSave,
      loadDefaults,
    }),
    [draft, live, dirty, loading, saving, lastSavedAt, setSection, update, reset, load, doSave, loadDefaults],
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
