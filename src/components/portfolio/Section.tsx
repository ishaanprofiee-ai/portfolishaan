import type { ReactNode } from "react";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal } from "./Reveal";

export function Section({
  id,
  eyebrow,
  title,
  subtitle,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const eyebrowX = useTransform(scrollYProgress, [0, 1], [-30, 30]);

  return (
    <section ref={ref} id={id} className="relative px-6 py-28 md:px-10 md:py-36">
      <motion.div style={{ y }} className="mx-auto w-full max-w-6xl">
        <div className="mb-14 flex flex-col gap-4">
          <Reveal>
            <motion.div
              style={{ x: eyebrowX }}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-muted-foreground"
            >
              <span className="h-px w-8 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
              {eyebrow}
            </motion.div>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="max-w-3xl font-display text-4xl leading-[1.05] tracking-tight md:text-6xl">
              {title}
            </h2>
          </Reveal>
          {subtitle && (
            <Reveal delay={0.1}>
              <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{subtitle}</p>
            </Reveal>
          )}
        </div>
        {children}
      </motion.div>
    </section>
  );
}

