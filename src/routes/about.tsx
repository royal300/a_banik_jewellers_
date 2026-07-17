import { createFileRoute, Link } from "@tanstack/react-router";
import { Shield, Gem, Sparkles, Award, Target, Eye, HeartHandshake } from "lucide-react";
import aboutHero from "@/assets/about-hero.jpg";
import { SectionHeading } from "@/components/site/Section";
import promo1 from "@/assets/promo-1.jpg";
import promo2 from "@/assets/promo-2.jpg";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import cat1 from "@/assets/cat-necklace.jpg";
import cat2 from "@/assets/cat-bangles.jpg";
import { whyChooseUs } from "@/lib/data";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — A Banik Jewellers, Madhyamgram" },
      { name: "description", content: "The story of A Banik Jewellers — generations of craftsmanship, hallmarked gold, certified diamonds and unwavering trust from our Madhyamgram showroom." },
      { property: "og:title", content: "About A Banik Jewellers" },
      { property: "og:description", content: "Our story, mission and vision — jewellery crafted with generations of trust." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

const iconMap = { shield: Shield, gem: Gem, sparkles: Sparkles, award: Award } as const;

function AboutPage() {
  return (
    <>
      <section className="relative h-[45vh] sm:h-[55vh] overflow-hidden">
        <img src={aboutHero} alt="A Banik Jewellers showroom" width={1920} height={900} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-deep-red/80 via-deep-red/50 to-black/40" />
        <div className="relative h-full flex items-center px-6">
          <div className="max-w-7xl mx-auto w-full text-white reveal">
            <div className="text-gold text-xs sm:text-sm font-bold tracking-[0.35em] uppercase mb-3">Our Legacy</div>
            <h1 className="text-4xl sm:text-6xl font-bold">About A Banik Jewellers</h1>
            <p className="mt-4 max-w-xl text-white/85">
              A trusted name in Madhyamgram — where every ornament carries generations of craftsmanship, care and celebration.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="reveal">
            <div className="text-gold text-xs font-bold tracking-[0.35em] uppercase mb-3">Our Story</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-deep-red">A Legacy of Craftsmanship</h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              A Banik Jewellers began as a small family workshop in the heart of Madhyamgram — a place
              where every ornament was drawn by hand, hammered with care and finished with pride.
              Decades later, we still make jewellery the same way: by valuing the karigar, the customer,
              and the story that binds them.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Today our showroom on Sodepur Road brings together traditional Bengal craftsmanship,
              contemporary bridal design, and certified purity — trusted by generations of families
              across Kolkata.
            </p>
          </div>
          <div className="reveal grid grid-cols-2 gap-4">
            <img src={hero1} alt="Craftsmanship" className="rounded-3xl aspect-[3/4] object-cover shadow-elegant" loading="lazy" />
            <img src={cat1} alt="Necklace" className="rounded-3xl aspect-[3/4] object-cover mt-8 shadow-gold" loading="lazy" />
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-card/60 border-y border-gold/20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          {[
            { icon: Target, title: "Mission", body: "To craft jewellery that carries certified purity, timeless design and unwavering trust — one family at a time." },
            { icon: Eye, title: "Vision", body: "To be Bengal's most loved jewellery house, where tradition and modern design live side by side." },
            { icon: HeartHandshake, title: "Values", body: "Honesty in weight. Purity in metal. Warmth in service. Every day. Every ornament." },
          ].map((v, i) => (
            <div key={v.title} style={{ animationDelay: `${i * 80}ms` }}
              className="reveal rounded-3xl bg-background border border-gold/25 p-8 hover:-translate-y-1 hover:shadow-elegant transition-elegant">
              <div className="w-14 h-14 rounded-full gradient-gold grid place-items-center mb-4 shadow-gold">
                <v.icon className="w-6 h-6 text-deep-red" />
              </div>
              <h3 className="text-xl font-bold text-deep-red">{v.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 sm:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <SectionHeading eyebrow="Our Promise" title="Why Choose Us" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {whyChooseUs.map((w) => {
              const Icon = iconMap[w.icon];
              return (
                <div key={w.title} className="reveal rounded-3xl bg-card border border-gold/25 p-6 text-center hover:-translate-y-1 hover:shadow-elegant transition-elegant">
                  <div className="mx-auto w-14 h-14 rounded-full gradient-gold grid place-items-center mb-4">
                    <Icon className="w-6 h-6 text-deep-red" />
                  </div>
                  <h3 className="font-bold text-deep-red">{w.title}</h3>
                  <p className="mt-2 text-xs text-muted-foreground">{w.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <SectionHeading eyebrow="Inside" title="Store Gallery" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[aboutHero, hero1, hero2, promo1, cat1, cat2, promo2, aboutHero].map((img, i) => (
              <div key={i} className="reveal rounded-2xl overflow-hidden aspect-square group border border-gold/20"
                style={{ animationDelay: `${i * 60}ms` }}>
                <img src={img} alt={`Gallery ${i + 1}`} loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-[transform] duration-700" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center reveal rounded-3xl gradient-red text-white p-10 shadow-elegant">
          <h3 className="text-2xl sm:text-3xl font-bold">Visit our Madhyamgram Showroom</h3>
          <p className="mt-3 text-white/85">Experience our full collection in person — our team is delighted to guide you.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/contact" className="px-6 py-3 rounded-full gradient-gold text-deep-red font-bold text-sm shadow-gold hover:scale-105 transition-elegant">GET DIRECTIONS</Link>
            <Link to="/collections" className="px-6 py-3 rounded-full border border-white/70 text-white font-semibold text-sm hover:bg-white hover:text-deep-red transition-elegant">VIEW COLLECTIONS</Link>
          </div>
        </div>
      </section>
    </>
  );
}
