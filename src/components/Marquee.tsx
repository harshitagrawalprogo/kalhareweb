import { motion } from "framer-motion";
import { ReactNode } from "react";

interface MarqueeProps {
  children: ReactNode;
  speed?: number;
  direction?: "left" | "right";
  className?: string;
  gap?: number;
}

export default function Marquee({ children, speed = 40, direction = "left", className = "", gap = 48 }: MarqueeProps) {
  const xFrom = direction === "left" ? "0%" : "-50%";
  const xTo = direction === "left" ? "-50%" : "0%";

  return (
    <div
      className={`overflow-hidden w-full ${className}`}
      style={{
        maskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
        WebkitMaskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
      }}
    >
      <motion.div
        className="flex whitespace-nowrap w-max"
        animate={{ x: [xFrom, xTo] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
        style={{ gap }}
      >
        {/* Duplicate twice for seamless loop */}
        <span className="flex items-center" style={{ gap }}>{children}</span>
        <span className="flex items-center" style={{ gap }}>{children}</span>
      </motion.div>
    </div>
  );
}