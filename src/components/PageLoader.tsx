import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface Props { onComplete: () => void; }

export default function PageLoader({ onComplete }: Props) {
  const [count, setCount] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const start = performance.now();
    const duration = 1600;
    let raf: number;

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      setCount(Math.floor(eased * 100));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setCount(100);
        setTimeout(() => {
          setExiting(true);
          setTimeout(onComplete, 750);
        }, 250);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          className="fixed inset-0 z-[200] bg-ink overflow-hidden"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.75, ease: EASE }}
        >
          {/* Blueprint grid */}
          <div
            className="absolute inset-0 blueprint-grid"
            style={{ opacity: 0.15 }}
          />

          {/* Top-left brand */}
          <div className="absolute top-8 left-8 md:top-12 md:left-12">
            <div className="flex items-center gap-3">
              <div className="w-px h-8 bg-gold/30" />
              <p className="text-gold/50 text-[10px] tracking-[0.5em] uppercase font-body">
                KALHARE GROUPS
              </p>
            </div>
          </div>

          {/* Right progress bar */}
          <div className="absolute right-0 top-0 h-full w-px bg-white/5">
            <motion.div
              className="w-full bg-gold absolute bottom-0 left-0"
              style={{ height: `${count}%`, originY: 1 }}
              transition={{ duration: 0.05 }}
            />
          </div>

          {/* Bottom-right: big counter */}
          <div className="absolute bottom-6 right-8 md:bottom-10 md:right-14">
            <motion.p
              className="font-heading text-white font-bold leading-none tabular-nums"
              style={{ fontSize: "clamp(5rem, 18vw, 16rem)" }}
            >
              {String(count).padStart(2, "0")}
            </motion.p>
          </div>

          {/* Bottom-left: loading label */}
          <div className="absolute bottom-10 left-8 md:bottom-14 md:left-12">
            <p className="text-white/15 text-[10px] tracking-[0.4em] uppercase font-body">
              Loading Experience
            </p>
          </div>

          {/* Center: thin gold horizontal line that grows */}
          <div className="absolute inset-x-0 top-1/2 flex items-center px-12">
            <motion.div
              className="h-px bg-gold/20"
              style={{ width: `${count}%` }}
              transition={{ duration: 0.05 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}