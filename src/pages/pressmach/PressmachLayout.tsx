import { useState, useEffect } from "react";
import { Outlet, NavLink, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/pressmach" },
  { label: "About", href: "/pressmach/about" },
  { label: "Machines", href: "/pressmach/machines" },
  { label: "Custom Machines", href: "/pressmach/custom" },
  { label: "Contact", href: "/pressmach/contact" },
];

function PressmachNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => { setMobileOpen(false); }, [location]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? "rgba(10, 10, 10, 0.97)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(212,175,55,0.12)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex items-center group">
          <img
            src="/images/pressmach-logo.png"
            alt="Pressmach Machine Tools"
            className="h-10 w-auto object-contain opacity-90 group-hover:opacity-100 transition-opacity duration-300"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              end={link.href === "/pressmach"}
              className={({ isActive }) =>
                `relative text-sm font-body font-medium tracking-wide transition-colors duration-300 pb-0.5
                ${isActive ? "text-gold" : "text-white/80 hover:text-white"}`
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  <span
                    className="absolute -bottom-0.5 left-0 h-px bg-gold transition-all duration-300"
                    style={{ width: isActive ? "100%" : "0%" }}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <Link
          to="/pressmach/contact"
          className="hidden md:flex items-center gap-2 border border-gold/40 text-gold text-xs font-body font-medium tracking-widest px-5 py-2.5 hover:bg-gold hover:text-ink transition-all duration-300"
        >
          GET IN TOUCH <ArrowUpRight size={12} />
        </Link>

        <button className="md:hidden text-white p-2" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-ink/98 backdrop-blur-xl border-t border-gold/10"
          >
            <nav className="flex flex-col px-6 py-6 gap-5">
              {navLinks.map((link) => (
                <NavLink key={link.href} to={link.href} end={link.href === "/pressmach"}
                  className={({ isActive }) => `text-base font-body tracking-wide ${isActive ? "text-gold" : "text-white/80"}`}
                >
                  {link.label}
                </NavLink>
              ))}
              <Link to="/pressmach/contact" className="mt-4 border border-gold/40 text-gold text-sm font-body tracking-widest px-5 py-3 text-center">
                GET IN TOUCH
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function PressmachFooter() {
  return (
    <footer className="bg-ink border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 bg-white flex items-center justify-center">
                <span className="font-heading font-bold text-ink text-lg">P</span>
              </div>
              <div>
                <p className="text-white font-semibold text-sm tracking-wider">PRESSMACH</p>
                <p className="text-gold/50 text-[10px] tracking-[0.3em] uppercase">MACHINE TOOLS</p>
              </div>
            </div>
            <p className="text-white/35 font-body font-light text-sm leading-relaxed max-w-xs">
              Precision EDM machine tools engineered for modern manufacturing. Accuracy, reliability, and productive uptime — designed into every unit.
            </p>
            <div className="gold-line mt-8 w-24" />
          </div>
          <div>
            <p className="text-gold/60 text-xs tracking-[0.3em] uppercase font-body mb-5">Navigation</p>
            <ul className="space-y-3">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link to={l.href} className="text-white/40 hover:text-gold text-sm font-body transition-colors duration-300">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-gold/60 text-xs tracking-[0.3em] uppercase font-body mb-5">Contact</p>
            <div className="space-y-3 text-sm font-body font-light text-white/40 leading-relaxed">
              <p>No. 9/2, Kalhare Industrial Area,<br />Kachohalli, Off Magadi Road,<br />Bangalore – 560091</p>
              <p>+91 9008189732</p>
              <p>kalhare@gmail.com</p>
            </div>
          </div>
        </div>
        <div className="gold-line mb-6" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-white/20 text-xs font-body tracking-wider">
            © 2025 PRESSMACH MACHINE TOOLS. A KALHARE GROUP DIVISION.
          </p>
          <Link to="/" className="text-white/20 hover:text-gold/60 text-xs font-body tracking-wider transition-colors duration-300">
            ← KALHARE GROUPS
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default function PressmachLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-ink">
      <PressmachNav />
      <main className="flex-1">
        <Outlet />
      </main>
      <PressmachFooter />
    </div>
  );
}
