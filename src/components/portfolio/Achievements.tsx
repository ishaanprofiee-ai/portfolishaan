import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { Section } from "./Section";

const stats = [
  { n: 4, suffix: "+", label: "Projects shipped" },
  { n: 800, suffix: "+", label: "Learning hours" },
  { n: 12, suffix: "", label: "Technologies" },
  { n: 3, suffix: "", label: "Languages spoken" },
];

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const view = useInView(ref, { once: true, margin: "-80px" });
  useEffect(() => {
    if (!view) return;
    const dur = 1600;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(eased * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [view, to]);
  return (
    <span ref={ref} className="tabular-nums">
      {n}
      {suffix}
    </span>
  );
}

export function Achievements() {
  return (
    <Section id="achievements" eyebrow="05 — By the numbers" title="Progress is the point.">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="glass-card glass-hover flex flex-col gap-2 p-6">
            <div className="font-display text-5xl leading-none text-gradient md:text-6xl">
              <Counter to={s.n} suffix={s.suffix} />
            </div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}
