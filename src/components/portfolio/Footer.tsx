import { ArrowUp } from "lucide-react";
import { useSite } from "@/hooks/useSiteContent";

export function Footer() {
  const site = useSite();
  return (
    <footer className="relative border-t border-white/5 px-6 py-10 md:px-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <span className="font-display italic text-2xl text-gradient leading-none">{site.personal.initials}</span>
          <span className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {site.personal.name} · {site.footer.tagline}
          </span>
        </div>
        <div className="flex items-center gap-6 text-xs text-muted-foreground">
          {site.footer.quickLinks.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-foreground">
              {l.label}
            </a>
          ))}
          <a
            href="#top"
            className="inline-flex items-center gap-1.5 rounded-full border border-glass-border px-3 py-1.5 hover:border-white/25 hover:text-foreground"
          >
            <ArrowUp className="h-3 w-3" /> Top
          </a>
        </div>
      </div>
    </footer>
  );
}
