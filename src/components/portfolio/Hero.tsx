import { motion } from "framer-motion";
import { ArrowUpRight, Download, MessageCircle } from "lucide-react";
import { MagneticButton } from "./MagneticButton";
import { useSite } from "@/hooks/useSiteContent";

export function Hero() {
  const site = useSite();
  const { hero, personal } = site;

  return (
    <section id="top" className="relative flex min-h-screen items-center px-6 pt-32 pb-20 md:px-10">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-16 md:grid-cols-[1.15fr_0.85fr] md:items-center">
        <div className="flex flex-col gap-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.0, duration: 0.7 }}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-glass-border bg-glass px-3 py-1 text-xs tracking-widest text-muted-foreground backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            {hero.availabilityBadge}
          </motion.div>

          <div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.1, duration: 0.6 }}
              className="mb-4 text-sm uppercase tracking-[0.3em] text-muted-foreground"
            >
              {personal.name} — {personal.location}
            </motion.p>
            <h1 className="font-display leading-[0.95] tracking-tight text-5xl md:text-7xl lg:text-8xl">
              {hero.line1.split("").map((c, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.15 + i * 0.03, duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
                  className="inline-block"
                >
                  {c}
                </motion.span>
              ))}
              <br />
              <motion.span
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.4, duration: 0.7 }}
                className="italic text-gradient"
              >
                {hero.line2}
              </motion.span>
              <br />
              <motion.span
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.55, duration: 0.7 }}
                className="inline-block text-muted-foreground/80"
              >
                {hero.line3}
              </motion.span>
            </h1>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.7, duration: 0.7 }}
            className="max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            {hero.intro}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.85, duration: 0.7 }}
            className="flex flex-wrap items-center gap-3"
          >
            <MagneticButton href={hero.ctaPrimary.href}>
              {hero.ctaPrimary.label} <ArrowUpRight className="h-4 w-4" />
            </MagneticButton>
            <MagneticButton href={hero.ctaResume.href} variant="ghost">
              {hero.ctaResume.label} <Download className="h-4 w-4" />
            </MagneticButton>
            <MagneticButton href={hero.ctaContact.href} variant="ghost">
              {hero.ctaContact.label} <MessageCircle className="h-4 w-4" />
            </MagneticButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.1, duration: 0.7 }}
            className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs uppercase tracking-widest text-muted-foreground"
          >
            {hero.titles.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </motion.div>
        </div>

        <HeroOrb initials={personal.initials} />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.3, duration: 1 }}
        className="absolute inset-x-0 bottom-8 flex justify-center text-[10px] tracking-[0.4em] text-muted-foreground"
      >
        <motion.span animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          SCROLL ↓
        </motion.span>
      </motion.div>
    </section>
  );
}

function HeroOrb({ initials }: { initials: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 2.2, duration: 1.2, ease: [0.2, 0.8, 0.2, 1] }}
      className="relative mx-auto aspect-square w-full max-w-md"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0"
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "conic-gradient(from 0deg, var(--aurora-indigo), var(--aurora-violet), var(--aurora-cyan), var(--aurora-indigo))",
            filter: "blur(40px)",
            opacity: 0.55,
          }}
        />
      </motion.div>
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="glass-card absolute inset-8 flex items-center justify-center overflow-hidden"
        style={{ borderRadius: "50%" }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, oklch(1 0 0 / 20%), transparent 40%), radial-gradient(circle at 70% 70%, color-mix(in oklab, var(--aurora-violet) 40%, transparent), transparent 60%)",
          }}
        />
        <span
          className="relative font-display italic text-[10rem] leading-none text-gradient"
          style={{ letterSpacing: "-0.08em" }}
        >
          {initials}
        </span>
      </motion.div>
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 rounded-full border border-white/10"
      />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        className="absolute inset-4 rounded-full border border-white/5"
      />
    </motion.div>
  );
}
