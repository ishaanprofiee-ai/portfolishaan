import { Download, Eye, FileText } from "lucide-react";
import { Section } from "./Section";
import { Reveal } from "./Reveal";
import { MagneticButton } from "./MagneticButton";
import { useSite } from "@/hooks/useSiteContent";

export function Resume() {
  const { resume } = useSite();
  return (
    <Section id="resume" eyebrow="08 — Resume" title="One page. Everything.">
      <Reveal>
        <div className="glass-card glass-hover relative overflow-hidden p-8 md:p-12">
          <div
            className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full opacity-40 blur-3xl"
            style={{ background: "radial-gradient(circle, var(--aurora-violet), transparent 60%)" }}
          />
          <div className="relative grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div className="flex items-start gap-5">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-glass-border bg-glass">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <div className="font-display text-3xl leading-tight md:text-4xl">{resume.label}</div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Skills, education, projects and current focus.
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
                  <span className="rounded-full border border-glass-border px-2 py-0.5">PDF</span>
                  {resume.updated && (
                    <span className="rounded-full border border-glass-border px-2 py-0.5">Updated · {resume.updated}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <MagneticButton href={resume.url} download={resume.filename}>
                <Download className="h-4 w-4" /> Download
              </MagneticButton>
              <MagneticButton href={resume.url} target="_blank" variant="ghost">
                <Eye className="h-4 w-4" /> View
              </MagneticButton>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
