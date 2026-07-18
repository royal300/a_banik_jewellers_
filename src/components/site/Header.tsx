import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, Phone, MessageCircle, Gem, TrendingUp, Sparkles } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/jewelleries", label: "Jewelleries" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [rates, setRates] = useState<any>({
    gold22K: "₹ 7,285 / g",
    gold24K: "₹ 7,945 / g",
    silver: "₹ 96 / g",
    updated: "Today",
    announcement: "",
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    async function loadRates() {
      try {
        const res = await fetch("/api/rates");
        const data = await res.json();
        if (data) setRates(data);
      } catch (err) {
        console.error("Rates fetch error:", err);
      }
    }
    loadRates();
  }, []);

  return (
    <>
      {/* Top Ticker Bar showing Live Metal Rates */}
      <div className="bg-[oklch(0.22_0.04_25)] text-gold border-b border-gold/30 px-3 py-2 text-xs font-semibold shadow-inner z-50 relative">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2 tracking-wide">
            <span className="flex items-center gap-1.5 bg-deep-red text-gold px-2.5 py-0.5 rounded-full font-extrabold text-[10px] uppercase shadow-sm">
              <TrendingUp className="w-3 h-3 animate-pulse" /> Live Rates
            </span>
            <span>
              22K Gold: <strong className="text-ivory font-extrabold">{rates.gold22K}</strong>
            </span>
            <span className="text-gold/40">|</span>
            <span>
              24K Gold: <strong className="text-ivory font-extrabold">{rates.gold24K}</strong>
            </span>
            <span className="text-gold/40">|</span>
            <span>
              Silver: <strong className="text-ivory font-extrabold">{rates.silver}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-ivory/80">
            {rates.announcement ? (
              <span className="inline-flex items-center gap-1 text-gold">
                <Sparkles className="w-3 h-3 shrink-0" /> {rates.announcement}
              </span>
            ) : (
              <span>
                Updated: <span className="text-gold font-bold">{rates.updated}</span> · BIS Hallmarked Purity
              </span>
            )}
          </div>
        </div>
      </div>

      <header
        className={`sticky top-0 z-40 transition-elegant border-b ${
          scrolled
            ? "glass border-gold/40 shadow-sm"
            : "bg-background border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20 gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 shrink-0 group">
              <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full gradient-red grid place-items-center shadow-gold group-hover:scale-105 transition-elegant">
                <Gem className="w-6 h-6 text-gold" />
              </div>
              <div className="leading-tight">
                <div className="font-extrabold tracking-wider text-deep-red text-lg sm:text-2xl">
                  A BANIK
                </div>
                <div className="text-xs sm:text-sm tracking-[0.28em] text-gold font-bold">
                  JEWELLERS
                </div>
              </div>
            </Link>

            {/* Center nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {nav.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  activeOptions={{ exact: n.to === "/" }}
                  activeProps={{ className: "text-deep-red" }}
                  inactiveProps={{ className: "text-foreground/80" }}
                  className="relative text-sm font-semibold tracking-wide hover:text-deep-red transition-elegant after:content-[''] after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-gold hover:after:w-full after:transition-all after:duration-300 data-[status=active]:after:w-full"
                >
                  {n.label}
                </Link>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              <a
                href={`tel:${siteConfig.phoneClean}`}
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold/70 text-deep-red hover:bg-gold hover:text-white transition-elegant text-sm font-semibold"
              >
                <Phone className="w-4 h-4" /> Call
              </a>
              <a
                href={`https://wa.me/${siteConfig.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full gradient-red text-white hover:opacity-90 hover:scale-[1.02] transition-elegant text-sm font-semibold shadow-gold"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>
              <button
                onClick={() => setOpen((v) => !v)}
                aria-label="Menu"
                className="lg:hidden p-2 rounded-md text-deep-red"
              >
                {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="lg:hidden glass border-t border-gold/30 animate-hero-fade">
            <div className="px-4 py-4 flex flex-col gap-1">
              {nav.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  activeOptions={{ exact: n.to === "/" }}
                  activeProps={{ className: "bg-gold/15 text-deep-red" }}
                  className="px-4 py-3 rounded-lg text-sm font-semibold hover:bg-gold/10 transition-elegant"
                >
                  {n.label}
                </Link>
              ))}
              <div className="flex gap-2 pt-2">
                <a
                  href={`tel:${siteConfig.phoneClean}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full border border-gold text-deep-red text-sm font-semibold"
                >
                  <Phone className="w-4 h-4" /> Call
                </a>
                <a
                  href={`https://wa.me/${siteConfig.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full gradient-red text-white text-sm font-semibold"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </a>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

