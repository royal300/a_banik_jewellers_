import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, Phone, MessageCircle, Gem } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/collections", label: "Collections" },
  { to: "/products", label: "Products" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
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
          <Link to="/" className="flex items-center gap-2 shrink-0 group">
            <div className="w-10 h-10 rounded-full gradient-red grid place-items-center shadow-gold group-hover:scale-105 transition-elegant">
              <Gem className="w-5 h-5 text-gold" />
            </div>
            <div className="leading-tight">
              <div className="font-bold tracking-wider text-deep-red text-sm sm:text-base">
                A BANIK
              </div>
              <div className="text-[10px] sm:text-xs tracking-[0.25em] text-gold font-semibold">
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
  );
}
