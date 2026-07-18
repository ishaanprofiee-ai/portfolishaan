import { motion } from "framer-motion";
import { Section } from "./Section";
import { Code2, Dumbbell, Palette, Brain, Cpu, Music } from "lucide-react";

const items = [
  { icon: Code2, label: "Coding", desc: "Long sessions. Clean commits." },
  { icon: Dumbbell, label: "Gym", desc: "Discipline transfers." },
  { icon: Palette, label: "Design", desc: "Type, color, restraint." },
  { icon: Brain, label: "AI", desc: "The next interface." },
  { icon: Cpu, label: "Technology", desc: "How things actually work." },
  { icon: Music, label: "Music", desc: "The best coding co-pilot." },
];

export function Interests() {
  return (
    <Section id="interests" eyebrow="06 — Off the clock" title="What keeps me curious.">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {items.map((it, i) => {
          const Icon = it.icon;
          return (
            <motion.div
              key={it.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              whileHover={{ y: -6, rotate: -1 }}
              className="glass-card group relative overflow-hidden p-6"
            >
              <div
                className="pointer-events-none absolute -bottom-16 -right-16 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity group-hover:opacity-60"
                style={{ background: "radial-gradient(circle, var(--aurora-violet), transparent 60%)" }}
              />
              <Icon className="h-6 w-6 text-foreground/90 transition-transform group-hover:-rotate-6 group-hover:scale-110" />
              <div className="mt-6 text-lg font-medium">{it.label}</div>
              <div className="text-xs text-muted-foreground">{it.desc}</div>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}
