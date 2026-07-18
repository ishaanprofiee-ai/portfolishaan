import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export function LoadingScreen() {
  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const start = performance.now();
    const duration = 1800;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setPct(Math.floor(p * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => setDone(true), 250);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(10px)" }}
          transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-background"
        >
          <div className="absolute inset-0 grid-bg opacity-40" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, color-mix(in oklab, var(--aurora-violet) 20%, transparent), transparent 60%)",
            }}
          />
          <div className="relative flex flex-col items-center gap-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
              className="relative"
            >
              <div
                className="text-[8rem] font-display italic leading-none text-gradient"
                style={{ letterSpacing: "-0.05em" }}
              >
                IS
              </div>
              <motion.div
                aria-hidden
                className="absolute inset-0 rounded-full blur-3xl"
                style={{ background: "radial-gradient(circle, var(--aurora-violet), transparent 60%)", opacity: 0.4 }}
                animate={{ scale: [0.9, 1.1, 0.9] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
            <div className="flex w-64 flex-col items-center gap-3">
              <div className="h-px w-full overflow-hidden bg-white/10">
                <motion.div
                  className="h-full"
                  style={{
                    width: `${pct}%`,
                    background: "linear-gradient(90deg, var(--aurora-indigo), var(--aurora-violet), var(--aurora-cyan))",
                  }}
                />
              </div>
              <div className="flex w-full justify-between text-xs text-muted-foreground tracking-widest">
                <span>LOADING</span>
                <span className="tabular-nums">{pct.toString().padStart(3, "0")}%</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
