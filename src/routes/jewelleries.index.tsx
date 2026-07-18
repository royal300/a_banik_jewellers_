import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, ShieldCheck, Award, Gem, HeartHandshake } from "lucide-react";
import { categories as fallbackCategories } from "@/lib/data";

export const Route = createFileRoute("/jewelleries/")({
  component: JewelleriesPage,
});

function JewelleriesPage() {
  const [categories, setCategories] = useState<any[]>(fallbackCategories);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data);
        }
      } catch (err) {
        console.error("Jewelleries load error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="bg-background min-h-screen text-foreground pb-20">
      {/* Hero Header */}
      <section className="relative py-16 sm:py-24 bg-gradient-to-b from-[oklch(0.22_0.04_25)] via-[oklch(0.20_0.04_25)] to-background border-b border-gold/20 overflow-hidden">
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 30%, oklch(0.78 0.13 85) 0%, transparent 60%)",
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/40 bg-gold/10 text-gold text-xs font-bold uppercase tracking-[0.25em] animate-hero-fade">
            <Sparkles className="w-3.5 h-3.5" /> BIS Hallmarked Masterpieces
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-deep-red tracking-tight animate-hero-fade">
            Our Exquisite Jewelleries
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground leading-relaxed animate-hero-fade">
            Explore our curated showroom categories. From 22K Hallmarked Gold and IGI Certified Diamonds to traditional Temple artistry, every category embodies generations of Bengali craftsmanship.
          </p>
        </div>
      </section>

      {/* Shop By Category Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <h2 className="text-xs sm:text-sm uppercase tracking-[0.3em] text-gold font-bold">
            SHOWROOM CATEGORIES
          </h2>
          <div className="text-3xl sm:text-4xl font-extrabold text-deep-red">
            Shop By Category
          </div>
          <p className="text-muted-foreground text-sm sm:text-base">
            Select a category below to browse all available ornaments and heirloom designs.
          </p>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-96 rounded-3xl bg-card animate-pulse border border-gold/20" />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((cat) => (
              <Link
                key={cat.slug || cat.id}
                to={`/jewelleries/${cat.slug}`}
                className="group relative h-96 sm:h-[420px] rounded-3xl overflow-hidden border-2 border-gold/30 hover:border-gold shadow-gold transition-all duration-500 flex flex-col justify-end p-6 sm:p-8 bg-black"
              >
                {/* Background Image */}
                <img
                  src={cat.image || "/assets/cat-gold.jpg"}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover:scale-110 group-hover:opacity-95 transition-all duration-700"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent group-hover:from-black/90 transition-colors" />

                {/* Content */}
                <div className="relative z-10 space-y-3 transform group-hover:-translate-y-2 transition-transform duration-500">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/20 border border-gold/50 text-gold text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                    <Gem className="w-3.5 h-3.5" /> Showroom Collection
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white group-hover:text-gold transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-ivory/80 text-sm line-clamp-2 leading-relaxed">
                    {cat.description || "Handcrafted heritage ornaments certified for purity."}
                  </p>
                  <div className="pt-2 flex items-center gap-2 text-gold font-bold text-sm tracking-wider uppercase group-hover:translate-x-2 transition-transform">
                    <span>Explore All Designs</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Trust & Craftsmanship Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-r from-[oklch(0.22_0.04_25)] via-[oklch(0.26_0.05_25)] to-[oklch(0.22_0.04_25)] border-2 border-gold/40 rounded-3xl p-8 sm:p-12 shadow-gold text-ivory grid md:grid-cols-4 gap-8">
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl gradient-gold grid place-items-center shadow-gold mb-2">
              <ShieldCheck className="w-7 h-7 text-deep-red" />
            </div>
            <div className="font-extrabold text-lg text-gold">100% BIS Hallmarked</div>
            <div className="text-xs text-ivory/75">Guaranteed purity across all 22K & 24K gold ornaments.</div>
          </div>

          <div className="flex flex-col items-center text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl gradient-gold grid place-items-center shadow-gold mb-2">
              <Award className="w-7 h-7 text-deep-red" />
            </div>
            <div className="font-extrabold text-lg text-gold">IGI Certified Diamonds</div>
            <div className="text-xs text-ivory/75">Internationally tested natural diamonds with grading reports.</div>
          </div>

          <div className="flex flex-col items-center text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl gradient-gold grid place-items-center shadow-gold mb-2">
              <Gem className="w-7 h-7 text-deep-red" />
            </div>
            <div className="font-extrabold text-lg text-gold">Custom Bridal Design</div>
            <div className="text-xs text-ivory/75">Master karigars ready to bring your dream bridal set to life.</div>
          </div>

          <div className="flex flex-col items-center text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl gradient-gold grid place-items-center shadow-gold mb-2">
              <HeartHandshake className="w-7 h-7 text-deep-red" />
            </div>
            <div className="font-extrabold text-lg text-gold">Trusted Since Decades</div>
            <div className="text-xs text-ivory/75">A legacy of honest pricing in Madhyamgram, Kolkata.</div>
          </div>
        </div>
      </section>
    </div>
  );
}
