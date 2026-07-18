import type { ReactNode } from "react";
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
  return (
    <section id={id} className="relative px-6 py-28 md:px-10 md:py-36">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-14 flex flex-col gap-4">
          <Reveal>
            <div className="text-xs uppercase tracking-[0.4em] text-muted-foreground">{eyebrow}</div>
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
      </div>
    </section>
  );
}
