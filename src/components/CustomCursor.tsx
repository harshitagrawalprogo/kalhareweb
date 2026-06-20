import { useEffect, useState } from "react";
import { motion, useMotionValue } from "framer-motion";

export default function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  const mx = useMotionValue(-200);
  const my = useMotionValue(-200);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) {
      setIsTouch(true);
      return;
    }
    const onMove = (e: MouseEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
      if (!visible) setVisible(true);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [visible]);

  if (isTouch) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] w-2 h-2 rounded-full bg-white"
      style={{
        x: mx,
        y: my,
        translateX: "-50%",
        translateY: "-50%",
        mixBlendMode: "difference",
      }}
      animate={{ opacity: visible ? 1 : 0 }}
    />
  );
}