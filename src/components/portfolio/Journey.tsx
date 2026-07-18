import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Section } from "./Section";
import { Reveal } from "./Reveal";
import { useSite } from "@/hooks/useSiteContent";

export function Journey() {
  const site = useSite();
  const items = site.education;
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 30%"] });
  const h = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <Section id="journey" eyebrow="02 — Journey" title="A short timeline. A long game.">
      <div ref={ref} className="relative">
        <div className="absolute left-4 top-0 h-full w-px bg-white/10 md:left-1/2" />
        <motion.div
          className="absolute left-4 top-0 w-px md:left-1/2"
          style={{
            height: h,
            background: "linear-gradient(180deg, var(--aurora-indigo), var(--aurora-violet), var(--aurora-cyan))",
            boxShadow: "0 0 20px var(--aurora-violet)",
          }}
        />
        <ul className="flex flex-col gap-10">
          {items.map((it, i) => {
            const left = i % 2 === 0;
            return (
              <li key={`${it.year}-${it.title}`} className="relative pl-12 md:grid md:grid-cols-2 md:gap-10 md:pl-0">
                <span className="absolute left-4 top-3 flex h-3 w-3 -translate-x-1/2 items-center justify-center rounded-full bg-background ring-2 ring-white/30 md:left-1/2">
                  <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-br from-[oklch(0.85_0.15_285)] to-[oklch(0.75_0.15_200)]" />
                </span>
                <Reveal className={left ? "md:pr-10 md:text-right" : "md:col-start-2 md:pl-10"}>
                  <div className="glass-card glass-hover p-5">
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">{it.year}</div>
                    <div className="mt-1 text-lg font-medium">{it.title}</div>
                    <p className="mt-2 text-sm text-muted-foreground">{it.desc}</p>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}
