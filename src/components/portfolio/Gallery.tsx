import { motion } from "framer-motion";
import { Section } from "./Section";

const tiles = [
  { h: "aspect-[3/4]", g: "linear-gradient(135deg, oklch(0.55 0.22 275), oklch(0.7 0.22 310))", label: "Aurora Study" },
  { h: "aspect-square", g: "linear-gradient(135deg, oklch(0.75 0.15 200), oklch(0.55 0.22 275))", label: "Grid System" },
  { h: "aspect-[4/5]", g: "linear-gradient(135deg, oklch(0.7 0.2 340), oklch(0.6 0.22 30))", label: "Type Poster" },
  { h: "aspect-square", g: "linear-gradient(135deg, oklch(0.6 0.2 160), oklch(0.55 0.22 260))", label: "Motion Frame" },
  { h: "aspect-[3/4]", g: "linear-gradient(135deg, oklch(0.65 0.18 30), oklch(0.7 0.2 340))", label: "Composition" },
  { h: "aspect-[4/3]", g: "linear-gradient(135deg, oklch(0.5 0.15 265), oklch(0.75 0.15 200))", label: "UI Study" },
  { h: "aspect-square", g: "linear-gradient(135deg, oklch(0.7 0.22 310), oklch(0.55 0.22 275))", label: "Cover" },
  { h: "aspect-[3/4]", g: "linear-gradient(135deg, oklch(0.55 0.2 200), oklch(0.6 0.22 310))", label: "Layout" },
];

export function Gallery() {
  return (
    <Section
      id="gallery"
      eyebrow="07 — Gallery"
      title="Fragments from the sketchbook."
      subtitle="A masonry of design explorations, moodboards, and moments in progress."
    >
      <div className="columns-2 gap-4 md:columns-3 lg:columns-4 [&>*]:mb-4 [&>*]:break-inside-avoid">
        {tiles.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, delay: (i % 4) * 0.05 }}
            className={`glass-card group relative ${t.h} overflow-hidden`}
          >
            <div className="absolute inset-0" style={{ background: t.g }} />
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
