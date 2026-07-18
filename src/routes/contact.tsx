import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Phone, MessageCircle, Clock } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { SectionHeading } from "@/components/site/Section";
import banner from "@/assets/promo-2.jpg";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — A Banik Jewellers, Madhyamgram" },
      { name: "description", content: "Visit or contact A Banik Jewellers at Gyayan Bhaban Market, Sodepur Rd, Madhyamgram, Kolkata 700129. Call +91 9748836800." },
      { property: "og:title", content: "Contact A Banik Jewellers" },
      { property: "og:description", content: "Visit our Madhyamgram showroom or reach us on WhatsApp." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const directionsUrl =
    (siteConfig as any).mapDirections ||
    "https://www.google.com/maps/dir//A.+BANIK+JEWELLERS,+MFV5%2BW56,+Gyayan+Bhaban+Market,+Sodepur+Rd,+Madhyamgram+Municipality+ward+20,+Madhyamgram,+Kolkata,+West+Bengal+700129/@22.7433007,88.4306945,15z/data=!4m8!4m7!1m0!1m5!1m1!1s0x39f89f3830dac7b7:0x889c148d0e617d9a!2m2!1d88.4579273!2d22.6947991?entry=ttu&g_ep=EgoyMDI2MDcxNS4wIKXMDSoASAFQAw%3D%3D";

  return (
    <>
      <section className="relative h-[36vh] sm:h-[45vh] overflow-hidden">
        <img src={banner} alt="Contact us" className="absolute inset-0 w-full h-full object-cover" width={1920} height={900} />
        <div className="absolute inset-0 bg-gradient-to-r from-deep-red/85 via-deep-red/55 to-black/40" />
        <div className="relative h-full flex items-center px-6">
          <div className="max-w-7xl mx-auto w-full text-white reveal">
            <div className="text-gold text-xs font-bold tracking-[0.35em] uppercase mb-3">Get in Touch</div>
            <h1 className="text-4xl sm:text-5xl font-bold">Contact Us</h1>
            <p className="mt-3 max-w-xl text-white/85">We'd love to help you find the perfect piece.</p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-6 sm:gap-8">
          {[
            { icon: MapPin, title: "Visit Our Showroom", body: siteConfig.address.full, href: directionsUrl },
            { icon: Phone, title: "Phone Support", body: siteConfig.phone, href: `tel:${siteConfig.phoneClean}` },
            { icon: MessageCircle, title: "WhatsApp Direct", body: siteConfig.phone, href: `https://wa.me/${siteConfig.whatsapp}` },
          ].map((c, i) => (
            <a key={c.title} href={c.href} target="_blank" rel="noreferrer"
              style={{ animationDelay: `${i * 80}ms` }}
              className="reveal group rounded-3xl bg-card border-2 border-gold/35 p-8 sm:p-10 shadow-elegant hover:-translate-y-2 hover:border-gold transition-elegant flex flex-col justify-between">
              <div>
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full gradient-gold grid place-items-center mb-6 shadow-gold group-hover:scale-110 transition-elegant">
                  <c.icon className="w-8 h-8 sm:w-10 sm:h-10 text-deep-red" />
                </div>
                <div className="text-xs font-bold tracking-[0.25em] text-gold uppercase mb-2">Connect</div>
                <h3 className="font-extrabold text-deep-red text-2xl sm:text-3xl">{c.title}</h3>
                <p className="mt-4 text-lg sm:text-2xl font-bold text-foreground leading-relaxed group-hover:text-deep-red transition-elegant">{c.body}</p>
              </div>
              <div className="mt-8 pt-4 border-t border-gold/20 flex items-center justify-between text-sm sm:text-base font-bold text-gold group-hover:text-deep-red transition-elegant">
                <span>Click to Connect</span>
                <span className="text-xl">→</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="py-10 sm:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="text-gold text-xs sm:text-sm font-bold tracking-[0.35em] uppercase mb-1">Our Location</div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-deep-red">Find Us on Google Maps</h2>
            </div>
            <a
              href={directionsUrl}
              target="_blank"
              rel="noreferrer"
              className="px-8 py-4 rounded-full gradient-gold text-deep-red font-bold text-sm sm:text-base tracking-wider shadow-gold hover:scale-105 transition-elegant inline-flex items-center gap-3 shrink-0"
            >
              <MapPin className="w-5 h-5" /> GET DIRECTIONS NOW
            </a>
          </div>
          <div className="reveal rounded-3xl overflow-hidden border-2 border-gold/40 shadow-elegant h-[450px] sm:h-[550px] w-full relative group">
            <iframe
              src={siteConfig.mapEmbed}
              title="A Banik Jewellers on Map"
              className="w-full h-full border-0"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <SectionHeading eyebrow="Store Hours" title="Business Hours" />
          <div className="rounded-3xl bg-card border border-gold/25 overflow-hidden divide-y divide-gold/15">
            {siteConfig.hours.map((h) => (
              <div key={h.day} className="flex items-center justify-between px-6 py-5">
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-gold" />
                  <span className="font-semibold text-base sm:text-lg">{h.day}</span>
                </div>
                <span className="text-deep-red font-bold text-base sm:text-lg">{h.time}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
