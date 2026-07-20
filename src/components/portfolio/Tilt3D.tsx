import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { ReactNode } from "react";
import { useRef } from "react";


/**
 * Tilt3D — mouse-tracking 3D tilt with animated gloss sheen.
 * Wraps children in a perspective container. Reduced-motion safe (motion respects it).
 */
export function Tilt3D({
  children,
  className = "",
  max = 10,
  glare = true,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
  glare?: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 180, damping: 18, mass: 0.4 });
  const rotateX = useTransform(sy, [-0.5, 0.5], [max, -max]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-max, max]);
  const glareX = useTransform(sx, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(sy, [-0.5, 0.5], [0, 100]);
  const glareBg = useMotionTemplate`radial-gradient(600px circle at ${glareX}% ${glareY}%, oklch(1 0 0 / 22%), transparent 45%)`;


  return (
    <div
      className={className}
      style={{ perspective: 1200 }}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        x.set((e.clientX - r.left) / r.width - 0.5);
        y.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      <motion.div
        ref={ref}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative h-full w-full"
      >
        {children}
        {glare && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-70 mix-blend-overlay"
            style={{ background: glareBg }}
          />
        )}

      </motion.div>
    </div>
  );
}
