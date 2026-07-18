import { Section } from "./Section";
import { Reveal } from "./Reveal";
import { Code2, Palette, Wrench, Sparkles, Braces } from "lucide-react";

const groups = [
  {
    icon: Code2,
    title: "Frontend",
    items: ["HTML", "CSS", "JavaScript", "Responsive Design", "UI/UX"],
  },
  {
    icon: Braces,
    title: "Learning",
    items: ["React", "Next.js", "Tailwind CSS", "Python", "C++", "DSA"],
  },
  {
    icon: Wrench,
    title: "Tools",
    items: ["Git", "GitHub", "VS Code", "Canva", "Figma"],
  },
  {
    icon: Palette,
    title: "Design",
    items: ["Visual Design", "Typography", "Motion", "Prototyping"],
  },
];

export function Skills() {
  return (
    <Section
      id="skills"
      eyebrow="03 — Skills"
      title="Sharpening tools. Shipping ideas."
      subtitle="A working toolkit — a mix of comfortable, practicing, and actively learning."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {groups.map((g, i) => {
          const Icon = g.icon;
          return (
            <Reveal key={g.title} delay={i * 0.05}>
              <div className="glass-card glass-hover group relative overflow-hidden p-6">
                <div
                  className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-40 blur-3xl transition group-hover:opacity-70"
                  style={{ background: "radial-gradient(circle, var(--aurora-violet), transparent 60%)" }}
                />
                <div className="relative flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-glass-border bg-glass">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="text-lg font-medium">{g.title}</div>
                  <Sparkles className="ml-auto h-4 w-4 text-muted-foreground" />
                </div>
                <ul className="relative mt-5 flex flex-wrap gap-2">
                  {g.items.map((s) => (
                    <li
                      key={s}
                      className="rounded-full border border-glass-border bg-white/[0.03] px-3 py-1 text-xs text-foreground/90"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
