import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef, type ReactNode, type MouseEvent } from "react";

type Props = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "ghost";
  className?: string;
  download?: string;
  target?: string;
};

export function MagneticButton({
  children,
  href,
  onClick,
  variant = "primary",
  className = "",
  download,
  target,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 });
  const sy = useSpring(y, { stiffness: 200, damping: 15 });

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.25);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.25);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const base =
    "relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-medium tracking-tight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";
  const styles =
    variant === "primary"
      ? "text-primary-foreground bg-gradient-to-br from-[oklch(0.85_0.16_285)] to-[oklch(0.72_0.18_285)] shadow-[0_10px_40px_-10px_oklch(0.72_0.18_285/0.6)] hover:shadow-[0_20px_60px_-10px_oklch(0.72_0.18_285/0.8)]"
      : "text-foreground border border-glass-border bg-glass backdrop-blur-md hover:border-white/25";

  const inner = (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      className={`${base} ${styles} ${className}`}
    >
      {children}
    </motion.div>
  );

  if (href) {
    return (
      <a href={href} onClick={onClick} download={download} target={target} rel={target === "_blank" ? "noreferrer" : undefined} className="inline-block">
        {inner}
      </a>
    );
  }
  return (
    <button onClick={onClick} className="inline-block">
      {inner}
    </button>
  );
}
