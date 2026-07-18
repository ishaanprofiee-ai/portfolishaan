import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { useSite } from "@/hooks/useSiteContent";

export function Navbar() {
  const site = useSite();
  const links = site.nav;
  const { scrollYProgress } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <>
      <motion.div
        className="fixed left-0 right-0 top-0 z-50 h-[2px] origin-left"
        style={{
          scaleX,
          background: "linear-gradient(90deg, var(--aurora-indigo), var(--aurora-violet), var(--aurora-cyan))",
        }}
      />
      <div className="fixed inset-x-0 top-4 z-40 flex justify-center px-4">
        <motion.nav
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1], delay: 1.9 }}
          className={`flex w-full max-w-4xl items-center justify-between rounded-full border border-glass-border px-4 py-2.5 backdrop-blur-xl transition-all ${
            scrolled ? "bg-background/70" : "bg-glass"
          }`}
        >
          <a href="#top" className="flex items-center gap-2 font-display italic text-lg leading-none">
            {site.personal.logo ? (
              <img src={site.personal.logo} alt={site.personal.name} className="h-6 w-auto" />
            ) : (
              <span className="text-gradient">{site.personal.initials}</span>
            )}
          </a>
          <ul className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#contact"
            className="hidden rounded-full border border-glass-border px-4 py-1.5 text-sm text-foreground transition-colors hover:border-white/25 md:inline-flex"
          >
            Let's talk
          </a>
          <button
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-glass-border md:hidden"
          >
            <span className="relative block h-2.5 w-4">
              <span className={`absolute left-0 top-0 h-px w-full bg-foreground transition ${open ? "translate-y-[5px] rotate-45" : ""}`} />
              <span className={`absolute bottom-0 left-0 h-px w-full bg-foreground transition ${open ? "-translate-y-[5px] -rotate-45" : ""}`} />
            </span>
          </button>
        </motion.nav>
      </div>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed inset-x-4 top-20 z-40 rounded-3xl border border-glass-border bg-background/85 p-4 backdrop-blur-xl md:hidden"
        >
          <ul className="flex flex-col">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-3 text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </>
  );
}
