import { Reveal } from "./Reveal";
import { Section } from "./Section";
import { useSite } from "@/hooks/useSiteContent";

export function About() {
  const site = useSite();
  const { about, personal } = site;

  return (
    <Section id="about" eyebrow="01 — About" title={about.heading}>
      <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <div className="glass-card relative aspect-[4/5] overflow-hidden">
            {personal.profilePhoto ? (
              <img
                src={personal.profilePhoto}
                alt={personal.name}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <>
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(circle at 30% 20%, color-mix(in oklab, var(--aurora-violet) 40%, transparent), transparent 60%), radial-gradient(circle at 80% 80%, color-mix(in oklab, var(--aurora-cyan) 35%, transparent), transparent 55%)",
                  }}
                />
                <div className="absolute inset-0 grid-bg opacity-30" />
              </>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
            <div className="relative flex h-full flex-col justify-between p-6">
              <div className="flex items-center justify-between text-xs uppercase tracking-widest text-white/80">
                <span>PORTRAIT</span>
                <span>{new Date().getFullYear()}</span>
              </div>
              <div className="text-xs tracking-widest text-white/80">
                {personal.name.toUpperCase()} · {personal.location.toUpperCase()}
              </div>
            </div>
          </div>
        </Reveal>

        <div className="flex flex-col gap-8">
          <Reveal delay={0.1}>
            <p className="text-lg leading-relaxed text-foreground/90 md:text-xl">{about.body}</p>
          </Reveal>

          <div className="grid grid-cols-2 gap-3">
            {about.values.map((v, i) => (
              <Reveal key={v.label + i} delay={0.15 + i * 0.05}>
                <div className="glass-card glass-hover p-5">
                  <div className="text-sm font-medium">{v.label}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{v.desc}</div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.35}>
            <div className="glass-card divide-y divide-white/5">
              {about.facts.map((f) => (
                <div key={f.k} className="flex items-center justify-between px-5 py-3 text-sm">
                  <span className="text-muted-foreground">{f.k}</span>
                  <span className="text-foreground">{f.v}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
