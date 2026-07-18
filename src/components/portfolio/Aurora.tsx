import { motion } from "framer-motion";

export function Aurora() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden noise"
    >
      <div className="absolute inset-0 grid-bg opacity-60" />
      <motion.div
        className="absolute -top-40 -left-40 h-[60vw] w-[60vw] rounded-full blur-[120px]"
        style={{ background: "radial-gradient(circle, var(--aurora-indigo), transparent 60%)", opacity: 0.35 }}
        animate={{ x: [0, 80, -40, 0], y: [0, 40, -30, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-[30%] -right-40 h-[55vw] w-[55vw] rounded-full blur-[120px]"
        style={{ background: "radial-gradient(circle, var(--aurora-violet), transparent 60%)", opacity: 0.3 }}
        animate={{ x: [0, -60, 40, 0], y: [0, -50, 30, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-20%] left-[20%] h-[50vw] w-[50vw] rounded-full blur-[120px]"
        style={{ background: "radial-gradient(circle, var(--aurora-cyan), transparent 60%)", opacity: 0.22 }}
        animate={{ x: [0, 50, -30, 0], y: [0, -40, 20, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, transparent 40%, oklch(0.14 0.02 265) 80%)",
        }}
      />
    </div>
  );
}
