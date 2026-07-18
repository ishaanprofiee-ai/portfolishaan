/**
 * Provides the merged site content (DB overrides on top of defaults) to
 * every portfolio component. Read via `useSite()`.
 *
 * Reads are public and use the browser Supabase client with the site_content
 * SELECT policy that allows anon reads. Writes go through the server function
 * `updateSiteContent` (see src/lib/admin.functions.ts).
 */

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "@/integrations/supabase/client";
import { defaultContent, mergeContent, type SiteContent } from "@/content/site";

interface SiteContentContextValue {
  content: SiteContent;
  loading: boolean;
  refresh: () => Promise<void>;
}

const SiteContentContext = createContext<SiteContentContextValue>({
  content: defaultContent,
  loading: false,
  refresh: async () => {},
});

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const { data, error } = await supabase
        .from("site_content")
        .select("data")
        .eq("id", 1)
        .maybeSingle();
      if (error) throw error;
      if (data?.data) setContent(mergeContent(data.data));
    } catch (err) {
      console.warn("[site-content] Falling back to defaults:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // Live updates when admin saves changes.
    const channel = supabase
      .channel("site-content-updates")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "site_content" },
        () => {
          void load();
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(
    () => ({ content, loading, refresh: load }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [content, loading],
  );

  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>;
}

export function useSite(): SiteContent {
  return useContext(SiteContentContext).content;
}

export function useSiteContent() {
  return useContext(SiteContentContext);
}
