import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { ArrowUpRight, Github } from "lucide-react";
import { Section } from "./Section";

type Cat = "All" | "Web" | "Design" | "AI";

const projects = [
  {
    title: "Personal Portfolio",
    desc: "The site you're on. Awwwards-level motion, glassmorphism, and typography.",
    tech: ["React", "TanStack", "Framer Motion", "Tailwind"],
    cats: ["Web", "Design"] as Cat[],
    status: "Live",
    accent: "linear-gradient(135deg, oklch(0.55 0.22 275), oklch(0.7 0.22 310))",
  },
  {
    title: "EduNest360",
    desc: "An education platform concept focused on structured learning and clean UX.",
    tech: ["Next.js", "Tailwind", "UI/UX"],
    cats: ["Web"] as Cat[],
    status: "In progress",
    accent: "linear-gradient(135deg, oklch(0.6 0.18 200), oklch(0.65 0.2 260))",
  },
  {
    title: "Pinterest Creative Designs",
    desc: "A visual explorations series — moodboards, posters, typography studies.",
    tech: ["Canva", "Design", "Typography"],
    cats: ["Design"] as Cat[],
    status: "Ongoing",
    accent: "linear-gradient(135deg, oklch(0.7 0.2 340), oklch(0.75 0.18 30))",
  },
  {
    title: "AI Web Projects",
    desc: "Small AI-powered utilities and interfaces exploring LLMs and generative UX.",
    tech: ["AI", "React", "APIs"],
    cats: ["AI", "Web"] as Cat[],
    status: "Upcoming",
    accent: "linear-gradient(135deg, oklch(0.7 0.18 160), oklch(0.6 0.2 260))",
  },
];

const cats: Cat[] = ["All", "Web", "Design", "AI"];

export function Projects() {
  const [active, setActive] = useState<Cat>("All");
  const visible = projects.filter((p) => active === "All" || p.cats.includes(active));

  return (
    <Section
      id="projects"
      eyebrow="04 — Selected Work"
      title="Projects, prototypes & experiments."
      subtitle="A growing collection. Each one taught me something I still use."
    >
      <div className="mb-8 flex flex-wrap gap-2">
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={`rounded-full border px-4 py-1.5 text-xs tracking-wide transition-all ${
              active === c
                ? "border-white/30 bg-white/10 text-foreground"
                : "border-glass-border bg-glass text-muted-foreground hover:text-foreground"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {visible.map((p, i) => (
            <motion.a
              key={p.title}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: i * 0.05, ease: [0.2, 0.8, 0.2, 1] }}
              href="#"
              className="glass-card glass-hover group relative flex flex-col overflow-hidden"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <div className="absolute inset-0" style={{ background: p.accent }} />
                <div className="absolute inset-0 grid-bg opacity-30" />
                <div
                  className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
                  style={{
                    background:
                      "radial-gradient(circle at 30% 30%, oklch(1 0 0 / 20%), transparent 50%)",
                  }}
                />
                <div className="absolute inset-0 flex items-end p-6">
                  <div className="font-display italic text-4xl leading-none text-white/95">
                    {p.title}
                  </div>
                </div>
                <div className="absolute right-4 top-4 rounded-full border border-white/20 bg-black/30 px-3 py-1 text-[10px] uppercase tracking-widest text-white/90 backdrop-blur">
                  {p.status}
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-4 p-6">
                <p className="text-sm text-muted-foreground">{p.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {p.tech.map((t) => (
                    <span key={t} className="rounded-full border border-glass-border bg-white/[0.03] px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span className="inline-flex items-center gap-1.5 hover:text-foreground"><ArrowUpRight className="h-3.5 w-3.5" /> Live</span>
                    <span className="inline-flex items-center gap-1.5 hover:text-foreground"><Github className="h-3.5 w-3.5" /> Code</span>
                  </div>
                  <span className="opacity-60">Case study →</span>
                </div>
              </div>
            </motion.a>
          ))}
        </AnimatePresence>
      </div>
    </Section>
  );
}
