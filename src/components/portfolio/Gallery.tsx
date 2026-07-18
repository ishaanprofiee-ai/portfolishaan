import { motion } from "framer-motion";
import { Section } from "./Section";
import { useSite } from "@/hooks/useSiteContent";

export function Gallery() {
  const { heading, subtitle, items } = useSite().gallery;
  return (
    <Section id="gallery" eyebrow="07 — Gallery" title={heading} subtitle={subtitle}>
      <div className="columns-2 gap-4 md:columns-3 lg:columns-4 [&>*]:mb-4 [&>*]:break-inside-avoid">
        {items.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, delay: (i % 4) * 0.05 }}
            className={`glass-card group relative ${t.h} overflow-hidden`}
          >
            {t.image ? (
              <img src={t.image} alt={t.label} className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <div className="absolute inset-0" style={{ background: t.g }} />
            )}
            <div className="absolute inset-0 grid-bg opacity-20" />
            <div
              className="absolute inset-0 opacity-0 backdrop-blur-sm transition-opacity duration-500 group-hover:opacity-100"
              style={{ background: "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.6))" }}
            />
            <div className="absolute inset-x-4 bottom-4 translate-y-2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
              <div className="text-[10px] uppercase tracking-widest text-white/70">— {String(i + 1).padStart(2, "0")}</div>
              <div className="font-display italic text-2xl text-white">{t.label}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
