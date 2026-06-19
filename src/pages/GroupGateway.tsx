import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const divisions = [
  {
    id: "kalhare",
    label: "Division I",
    name: "KALHARE\nENTERPRISES",
    tagline: "Premium Transformer Manufacturing",
    description:
      "Precision-engineered transformers for industrial, commercial, and infrastructure applications. Proudly built in India.",
    image: "/images/kalhare/hero.jpeg",
    href: "/kalhare",
  },
  {
    id: "pressmach",
    label: "Division II",
    name: "PRESSMACH\nMACHINE TOOLS",
    tagline: "Precision EDM Solutions",
    description:
      "Advanced EDM machine tools â€” the G-Series â€” engineered for maximum productivity, accuracy, and uptime.",
    image: "/images/pressmach/g60-studio.jpeg",
    href: "/pressmach",
  },
];

function DivisionCard({ division, index }: { division: (typeof divisions)[0]; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 1.0 + index * 0.15, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      className="relative flex-1 overflow-hidden cursor-pointer group"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      <Link to={division.href} className="block h-full">
        {/* Background image */}
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${division.image})` }}
          animate={{ scale: hovered ? 1.07 : 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        />

        {/* Multi-layer overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
        <motion.div
          className="absolute inset-0 bg-navy-950/60"
          animate={{ opacity: hovered ? 0.4 : 0.65 }}
          transition={{ duration: 0.6 }}
        />

        {/* Blueprint grid texture */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(212,175,55,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.15) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
          {/* Category label */}
          <motion.p
            className="text-gold/70 text-xs tracking-[0.35em] uppercase mb-4 font-body"
            animate={{ opacity: hovered ? 1 : 0.7 }}
          >
            {division.label}
          </motion.p>

          {/* Gold divider */}
          <motion.div
            className="h-px bg-gold/40 mb-6"
            animate={{ width: hovered ? "80px" : "40px" }}
            transition={{ duration: 0.4 }}
            style={{ width: "40px" }}
          />

          {/* Name */}
          <h2
            className="text-white font-body font-bold text-2xl md:text-3xl lg:text-4xl tracking-tight leading-tight mb-3"
            style={{ whiteSpace: "pre-line" }}
          >
            {division.name}
          </h2>

          {/* Tagline */}
          <p className="text-gold/80 text-sm tracking-widest uppercase mb-4 font-body font-medium">
            {division.tagline}
          </p>

          {/* Description */}
          <motion.p
            className="text-white/60 text-sm font-body font-light leading-relaxed max-w-xs mb-8"
            animate={{ opacity: hovered ? 0.8 : 0.5 }}
            transition={{ duration: 0.4 }}
          >
            {division.description}
          </motion.p>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <motion.span
              className="text-white text-sm font-body font-medium tracking-wider uppercase"
              animate={{ x: hovered ? 0 : 0 }}
            >
              Explore Division
            </motion.span>
            <motion.div
              animate={{ x: hovered ? 8 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ArrowRight size={16} className="text-gold" />
            </motion.div>
          </div>

          {/* Gold bottom border â€” animates in on hover */}
          <motion.div
            className="absolute bottom-0 left-0 h-0.5 bg-gold"
            animate={{ scaleX: hovered ? 1 : 0 }}
            initial={{ scaleX: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            style={{ transformOrigin: "left" }}
          />
        </div>
      </Link>
    </motion.div>
  );
}

export default function GroupGateway() {
  return (
    <div className="h-screen overflow-hidden flex flex-col bg-ink relative">
      {/* Blueprint grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(212,175,55,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.03) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Diagonal accent line */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg className="absolute w-full h-full" preserveAspectRatio="none">
          <line x1="0" y1="100%" x2="100%" y2="0" stroke="rgba(212,175,55,0.04)" strokeWidth="1" />
          <line x1="0" y1="80%" x2="80%" y2="0" stroke="rgba(212,175,55,0.03)" strokeWidth="1" />
        </svg>
      </div>

      {/* Top section â€” logo + headline */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 text-center"
        style={{ flex: "0 0 45vh", minHeight: "45vh" }}
      >
        {/* Group name */}
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-gold/60 text-xs tracking-[0.5em] uppercase font-body mb-8"
        >
          KALHARE GROUPS &nbsp;Â·&nbsp; EST. BANGALORE, INDIA
        </motion.p>

        {/* Gold line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className="gold-line w-24 mb-10"
        />

        {/* Main headline */}
        <div className="overflow-hidden mb-3">
          <motion.h1
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="font-heading text-white font-bold leading-[0.95]"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
          >
            Engineering Excellence.
          </motion.h1>
        </div>
        <div className="overflow-hidden mb-8">
          <motion.h1
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 0.75, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="font-heading text-white/40 font-bold leading-[0.95]"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
          >
            Built for Industry.
          </motion.h1>
        </div>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="text-white/40 font-body font-light text-sm md:text-base max-w-lg leading-relaxed"
        >
          A diversified engineering and manufacturing group delivering world-class transformers,
          electrical solutions, and precision machine tools proudly engineered in India.
        </motion.p>
      </div>

      {/* Horizontal divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.0, delay: 0.9, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        className="gold-line mx-0 relative z-10"
        style={{ transformOrigin: "left" }}
      />

      {/* Division cards */}
      <div className="relative z-10 flex flex-col md:flex-row" style={{ flex: "1 1 55vh" }}>
        {divisions.map((d, i) => (
          <DivisionCard key={d.id} division={d} index={i} />
        ))}

        {/* Vertical divider between cards */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.8, delay: 1.2, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gold/20"
          style={{ transformOrigin: "top" }}
        />
      </div>

      {/* Bottom meta */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.8 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 text-center"
      >
        <p className="text-white/20 text-xs font-body tracking-widest">
          KACHOHALLI Â· BANGALORE Â· INDIA
        </p>
      </motion.div>
    </div>
  );
}
