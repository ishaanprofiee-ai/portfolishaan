import { Reveal } from "./Reveal";
import { Section } from "./Section";

const values = [
  { label: "Integrity", desc: "Do the right thing, quietly." },
  { label: "Creativity", desc: "Design like it matters." },
  { label: "Discipline", desc: "Show up. Every day." },
  { label: "Curiosity", desc: "Ask better questions." },
];

const facts = [
  { k: "Based in", v: "West Bengal, India" },
  { k: "Education", v: "Class 12 · PCM" },
  { k: "Languages", v: "English · Hindi · Bengali" },
  { k: "Motto", v: "Learn. Build. Improve. Repeat." },
];

export function About() {
  return (
    <Section id="about" eyebrow="01 — About" title="A student, a designer, a builder.">
      <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <div className="glass-card relative aspect-[4/5] overflow-hidden">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at 30% 20%, color-mix(in oklab, var(--aurora-violet) 40%, transparent), transparent 60%), radial-gradient(circle at 80% 80%, color-mix(in oklab, var(--aurora-cyan) 35%, transparent), transparent 55%)",
              }}
            />
            <div className="absolute inset-0 grid-bg opacity-30" />
            <div className="relative flex h-full flex-col justify-between p-6">
              <div className="flex items-center justify-between text-xs uppercase tracking-widest text-muted-foreground">
                <span>PORTRAIT</span>
                <span>2026</span>
              </div>
              <div className="font-display italic text-[10rem] leading-[0.85] text-gradient" style={{ letterSpacing: "-0.06em" }}>
                Ishaan<br />
                <span className="text-muted-foreground/60">Singh</span>
              </div>
              <div className="text-xs tracking-widest text-muted-foreground">
                18 · WEST BENGAL, IN
              </div>
            </div>
          </div>
        </Reveal>

        <div className="flex flex-col gap-8">
          <Reveal delay={0.1}>
            <p className="text-lg leading-relaxed text-foreground/90 md:text-xl">
              I'm an aspiring software developer passionate about creating clean, interactive, and user-focused digital experiences. I enjoy learning new technologies, designing modern interfaces, and solving real-world problems through code.
            </p>
          </Reveal>

          <div className="grid grid-cols-2 gap-3">
            {values.map((v, i) => (
              <Reveal key={v.label} delay={0.15 + i * 0.05}>
                <div className="glass-card glass-hover p-5">
                  <div className="text-sm font-medium">{v.label}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{v.desc}</div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.35}>
            <div className="glass-card divide-y divide-white/5">
              {facts.map((f) => (
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
