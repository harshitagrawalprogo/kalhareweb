import { useState, useRef, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import Marquee from "../components/Marquee";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const divisions = [
  {
    id: "kalhare",
    label: "Division I",
    name: "KALHARE\nENTERPRISES",
    tagline: "Premium Transformer Manufacturing",
    description: "Precision-engineered transformers for industrial, commercial, and infrastructure applications. IS/IEC certified. Bangalore made.",
    image: "/images/kalhare/hero.jpeg",
    href: "/kalhare",
    accent: "#001040",
  },
  {
    id: "pressmach",
    label: "Division II",
    name: "PRESSMACH\nMACHINE TOOLS",
    tagline: "Precision EDM Solutions",
    description: "Advanced EDM machine tools, the G-Series, engineered for maximum productivity, accuracy, and uptime.",
    image: "/images/pressmach/g60-studio.jpeg",
    href: "/pressmach",
    accent: "#0A0A0A",
  },
];

const marqueeItems = [
  "KALHARE GROUPS",
  "TRANSFORMER MANUFACTURER",
  "PRECISION EDM MACHINES",
  "BANGALORE, INDIA",
  "ENGINEERING EXCELLENCE",
  "IS / IEC CERTIFIED",
  "EST. 1990s",
];

function BlurWord({ word, delay }: { word: string; delay: number }) {
  return (
    <motion.span
      className="inline-block"
      initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.85, delay, ease: EASE }}
    >
      {word}
    </motion.span>
  );
}

function MagneticCTA({ href, children, onClick }: { href: string; children: ReactNode; onClick?: () => void }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useSpring(0, { stiffness: 200, damping: 20 });
  const y = useSpring(0, { stiffness: 200, damping: 20 });

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * 0.35);
    y.set((e.clientY - (rect.top + rect.height / 2)) * 0.35);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.a
      ref={ref}
      href={href}
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x, y }}
      className="inline-flex items-center gap-3 bg-gold text-ink text-xs font-body font-bold tracking-[0.2em] uppercase px-6 py-3 hover:bg-white transition-colors duration-300"
    >
      {children}
    </motion.a>
  );
}

function Particles() {
  const dots = [
    { x: 10, y: 25 }, { x: 20, y: 65 }, { x: 30, y: 40 },
    { x: 40, y: 80 }, { x: 55, y: 20 }, { x: 65, y: 55 },
    { x: 75, y: 35 }, { x: 85, y: 70 },
  ];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {dots.map((d, i) => (
        <motion.div
          key={i}
          className="absolute w-0.5 h-0.5 rounded-full bg-gold/30"
          style={{ left: `${d.x}%`, top: `${d.y}%` }}
          animate={{ y: [0, -16, 0], opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 4 + (i % 3), delay: i * 0.5, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function DivisionCard({ division, index, showBorder }: { division: (typeof divisions)[0]; index: number; showBorder: boolean }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotX = useTransform(my, [-0.5, 0.5], ["3deg", "-3deg"]);
  const rotY = useTransform(mx, [-0.5, 0.5], ["-3deg", "3deg"]);

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => { mx.set(0); my.set(0); };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 1.2 + index * 0.15, ease: EASE }}
      className="relative flex-1 overflow-hidden cursor-none group"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{ perspective: 1000 }}
    >
      <Link to={division.href} className="block h-full">
        <motion.div
          className="absolute inset-0 h-full"
          style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <motion.div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${division.image})` }}
            animate={{ scale: hovered ? 1.08 : 1.0 }}
            transition={{ duration: 0.9, ease: EASE }}
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/92 via-black/55 to-black/20" />
          <motion.div
            className="absolute inset-0"
            style={{ background: division.accent }}
            animate={{ opacity: hovered ? 0.35 : 0.6 }}
            transition={{ duration: 0.5 }}
          />
          <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(212,175,55,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.06) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
            <motion.p
              className="text-gold/60 text-[10px] tracking-[0.45em] uppercase mb-3 font-body"
              animate={{ opacity: hovered ? 1 : 0.6, y: hovered ? 0 : 4 }}
              transition={{ duration: 0.4 }}
            >
              {division.label}
            </motion.p>
            <motion.div
              className="h-px bg-gold/40 mb-4 origin-left"
              animate={{ scaleX: hovered ? 1.8 : 1 }}
              style={{ width: 40 }}
              transition={{ duration: 0.4, ease: EASE }}
            />
            <h2
              className="text-white font-heading font-bold text-2xl md:text-3xl lg:text-4xl leading-tight mb-2"
              style={{ whiteSpace: "pre-line" }}
            >
              {division.name}
            </h2>
            <p className="text-gold/80 text-xs tracking-[0.3em] uppercase mb-3 font-body font-medium">
              {division.tagline}
            </p>
            <motion.p
              className="text-white/55 text-sm font-body font-light leading-relaxed max-w-xs mb-6"
              animate={{ opacity: hovered ? 0.85 : 0.5, y: hovered ? 0 : 6 }}
              transition={{ duration: 0.4 }}
            >
              {division.description}
            </motion.p>
            <motion.div
              className="flex items-center gap-3"
              animate={{ x: hovered ? 6 : 0 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              <span className="text-white text-sm font-body font-medium tracking-[0.2em] uppercase">
                Explore Division
              </span>
              <motion.div animate={{ x: hovered ? 6 : 0 }} transition={{ duration: 0.3, ease: EASE }}>
                <ArrowRight size={14} className="text-gold" />
              </motion.div>
            </motion.div>
            <motion.div
              className="absolute bottom-0 left-0 h-0.5 bg-gold origin-left"
              animate={{ scaleX: hovered ? 1 : 0 }}
              initial={{ scaleX: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
            />
          </div>
        </motion.div>

        {/* Running gold border */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-20"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <motion.rect
            x="0.75" y="0.75" width="98.5" height="98.5"
            fill="none"
            stroke="#D4AF37"
            strokeWidth="0.8"
            pathLength={1}
            strokeDasharray="0.28 0.72"
            animate={showBorder
              ? { strokeDashoffset: [0, -1], opacity: 1 }
              : { opacity: 0, strokeDashoffset: 0 }
            }
            transition={showBorder
              ? {
                  strokeDashoffset: { duration: 0.65, repeat: Infinity, ease: "linear" },
                  opacity: { duration: 0.2 },
                }
              : { opacity: { duration: 0.2 } }
            }
          />
        </svg>
      </Link>
    </motion.div>
  );
}

export default function GroupGateway() {
  const [activeBorder, setActiveBorder] = useState<null | 0 | 1>(null);
  const glowX = useMotionValue(0);
  const glowY = useMotionValue(0);
  const smoothX = useSpring(glowX, { stiffness: 60, damping: 20 });
  const smoothY = useSpring(glowY, { stiffness: 60, damping: 20 });

  return (
    <motion.div
      className="h-screen flex flex-col bg-ink relative cursor-none"
      onMouseMove={(e) => { glowX.set(e.clientX); glowY.set(e.clientY); }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="absolute inset-0 pointer-events-none blueprint-grid" style={{ opacity: 0.8 }} />
      <Particles />

      {/* Group logo — top left */}
      <motion.div
        className="absolute top-5 left-6 z-30"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
      >
        <Link to="/">
          <img
            src="/images/kalhare-logo.jpeg"
            alt="Kalhare Groups"
            className="h-10 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity duration-300"
          />
        </Link>
      </motion.div>

      {/* Animated accent lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg className="absolute w-full h-full" preserveAspectRatio="none">
          <motion.line x1="0" y1="100%" x2="100%" y2="0" stroke="rgba(212,175,55,0.05)" strokeWidth="1"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 0.5, ease: EASE }} />
          <motion.line x1="0" y1="75%" x2="75%" y2="0" stroke="rgba(212,175,55,0.03)" strokeWidth="1"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 0.8, ease: EASE }} />
        </svg>
      </div>

      {/* Mouse glow */}
      <motion.div
        className="absolute pointer-events-none rounded-full"
        style={{
          x: smoothX, y: smoothY,
          translateX: "-50%", translateY: "-50%",
          width: 500, height: 500,
          background: "radial-gradient(circle, rgba(212,175,55,0.07) 0%, transparent 70%)",
        }}
      />

      {/* TOP SECTION — auto height, no fixed vh */}
      <div
        className="relative z-10 flex flex-col items-center justify-center px-6 py-8 md:py-10 text-center overflow-hidden"
        style={{ flex: "0 0 auto", maxHeight: "50vh" }}
      >
        <motion.div
          initial={{ opacity: 0, y: -12, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          className="flex items-center gap-4 mb-4"
        >
          <div className="h-px w-8 bg-gold/40" />
          <p className="text-gold/50 text-[10px] tracking-[0.5em] uppercase font-body">
            KALHARE GROUPS &nbsp;&middot;&nbsp; EST. BANGALORE, INDIA
          </p>
          <div className="h-px w-8 bg-gold/40" />
        </motion.div>

        <motion.div
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, delay: 0.4, ease: EASE }}
          className="gold-line w-16 mb-5"
        />

        <h1
          className="font-heading text-white font-bold leading-[0.95] mb-2 flex flex-wrap justify-center gap-x-[0.22em]"
          style={{ fontSize: "clamp(1.8rem, 4.5vw, 4.5rem)" }}
        >
          <BlurWord word="Engineering" delay={0.5} />
          <BlurWord word="Excellence." delay={0.68} />
        </h1>
        <h1
          className="font-heading text-white/30 font-bold leading-[0.95] mb-5 flex flex-wrap justify-center gap-x-[0.22em]"
          style={{ fontSize: "clamp(1.8rem, 4.5vw, 4.5rem)" }}
        >
          <BlurWord word="Built" delay={0.82} />
          <BlurWord word="for" delay={0.92} />
          <BlurWord word="Industry." delay={1.02} />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0, ease: EASE }}
          className="text-white/35 font-body font-light text-sm max-w-md leading-relaxed mb-5 hidden sm:block"
        >
          A diversified engineering group delivering world-class transformers and precision machine tools. Proudly engineered in India.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.15, ease: EASE }}
        >
          <MagneticCTA href="#divisions" onClick={() => { setActiveBorder(0); setTimeout(() => setActiveBorder(1), 2000); setTimeout(() => setActiveBorder(null), 4000); }}>
            Explore Divisions <ArrowRight size={12} />
          </MagneticCTA>
        </motion.div>
      </div>

      {/* MARQUEE */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.8 }}
        className="relative z-10 py-2.5 border-t border-b border-gold/10 bg-white/2 shrink-0"
      >
        <Marquee speed={35} gap={56}>
          {marqueeItems.map((item, i) => (
            <span key={i} className="flex items-center gap-10">
              <span className="text-[10px] font-body font-medium tracking-[0.35em] uppercase text-white/30">{item}</span>
              <span className="text-gold/20 text-xs">&middot;</span>
            </span>
          ))}
        </Marquee>
      </motion.div>

      {/* DIVISION CARDS */}
      <div id="divisions" className="relative z-10 flex flex-col md:flex-row flex-1 min-h-0">
        {divisions.map((d, i) => (
          <DivisionCard key={d.id} division={d} index={i} showBorder={activeBorder === i} />
        ))}
        <motion.div
          initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
          transition={{ duration: 0.9, delay: 1.4, ease: EASE }}
          className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gold/15"
          style={{ transformOrigin: "top" }}
        />
      </div>

      {/* BOTTOM META */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.8 }}
        className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1"
      >
        <p className="text-white/15 text-[10px] font-body tracking-[0.4em] uppercase">
          KACHOHALLI &middot; BANGALORE &middot; INDIA
        </p>
        <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}>
          <ChevronDown size={14} className="text-white/15" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}