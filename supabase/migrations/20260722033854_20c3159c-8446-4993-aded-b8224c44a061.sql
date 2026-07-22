
-- Explicit deny-write policies on site_content for anon and authenticated roles.
-- Admin writes flow through the service_role client, which bypasses RLS.
CREATE POLICY "Deny public inserts on site_content"
  ON public.site_content FOR INSERT TO anon, authenticated
  WITH CHECK (false);

CREATE POLICY "Deny public updates on site_content"
  ON public.site_content FOR UPDATE TO anon, authenticated
  USING (false) WITH CHECK (false);

CREATE POLICY "Deny public deletes on site_content"
  ON public.site_content FOR DELETE TO anon, authenticated
  USING (false);

-- Storage: site-assets is a private bucket. Reads are proxied via the
-- server (service_role); no anon/authenticated client should read or write directly.
CREATE POLICY "Deny public reads on site-assets"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id <> 'site-assets');

CREATE POLICY "Deny public inserts on site-assets"
  ON storage.objects FOR INSERT TO anon, authenticated
  WITH CHECK (false);

CREATE POLICY "Deny public updates on site-assets"
  ON storage.objects FOR UPDATE TO anon, authenticated
  USING (false) WITH CHECK (false);

CREATE POLICY "Deny public deletes on site-assets"
  ON storage.objects FOR DELETE TO anon, authenticated
  USING (false);
