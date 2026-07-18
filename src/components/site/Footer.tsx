import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, MessageCircle, Phone, MapPin, Gem } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { categories } from "@/lib/data";

export function Footer() {
  return (
    <footer className="mt-24 bg-[oklch(0.18_0.04_25)] text-ivory relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, oklch(0.78 0.13 85) 0%, transparent 40%), radial-gradient(circle at 80% 80%, oklch(0.42 0.19 27) 0%, transparent 40%)",
        }}
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-full gradient-gold grid place-items-center">
              <Gem className="w-5 h-5 text-deep-red" />
            </div>
            <div>
              <div className="font-bold tracking-wider">A BANIK</div>
              <div className="text-xs tracking-[0.25em] text-gold">JEWELLERS</div>
            </div>
          </div>
          <p className="text-sm text-ivory/70 leading-relaxed">
            Crafting timeless jewellery for generations of families across
            Madhyamgram, Kolkata and beyond.
          </p>
          <div className="flex gap-3 mt-6">
            {[
              { href: siteConfig.social.facebook, icon: Facebook, label: "Facebook" },
              { href: siteConfig.social.instagram, icon: Instagram, label: "Instagram" },
              { href: siteConfig.social.whatsapp, icon: MessageCircle, label: "WhatsApp" },
            ].map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full border border-gold/40 grid place-items-center hover:bg-gold hover:text-deep-red hover:scale-110 transition-elegant"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-gold font-semibold tracking-wider text-sm mb-4">QUICK LINKS</h4>
          <ul className="space-y-2 text-sm">
            {[
              { to: "/", label: "Home" },
              { to: "/about", label: "About Us" },
              { to: "/collections", label: "Collections" },
              { to: "/products", label: "Products" },
              { to: "/contact", label: "Contact" },
            ].map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-ivory/75 hover:text-gold transition-elegant">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-gold font-semibold tracking-wider text-sm mb-4">COLLECTIONS</h4>
          <ul className="space-y-2 text-sm">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  to="/collections/$slug"
                  params={{ slug: c.slug }}
                  className="text-ivory/75 hover:text-gold transition-elegant"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-gold font-semibold tracking-wider text-sm mb-4">CONTACT</h4>
          <ul className="space-y-3 text-sm text-ivory/80">
            <li className="flex gap-3">
              <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
              <span>
                {siteConfig.address.line1},<br />
                {siteConfig.address.line2},<br />
                {siteConfig.address.city}, {siteConfig.address.state} {siteConfig.address.pincode}
              </span>
            </li>
            <li className="flex gap-3">
              <Phone className="w-4 h-4 text-gold shrink-0 mt-0.5" />
              <a href={`tel:${siteConfig.phoneClean}`} className="hover:text-gold">
                {siteConfig.phone}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="relative border-t border-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-ivory/60">
          <div>© 2026 A BANIK JEWELLERS. All Rights Reserved.</div>
          <div>
            Designed &amp; Developed by <span className="text-gold font-semibold">ROYAL300</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
