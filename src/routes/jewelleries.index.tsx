import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, ShieldCheck, Award, Gem, HeartHandshake } from "lucide-react";
import { categories as fallbackCategories } from "@/lib/data";
import aboutHero from "@/assets/about-hero.jpg";

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
      {/* Reddish Gradient Image Hero Header (matching About/Contact) */}
      <section className="relative h-[36vh] sm:h-[45vh] overflow-hidden">
        <img
          src={aboutHero}
          alt="Exquisite Jewelleries"
          width={1920}
          height={900}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-deep-red/85 via-deep-red/60 to-black/40" />
        <div className="relative h-full flex items-center px-4 sm:px-8">
          <div className="max-w-7xl mx-auto w-full text-white space-y-3">
            <div className="inline-flex items-center gap-2 text-gold text-xs font-bold tracking-[0.3em] uppercase">
              <Sparkles className="w-3.5 h-3.5" /> BIS Hallmarked Masterpieces
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
              Our Exquisite Jewelleries
            </h1>
            <p className="max-w-xl text-white/85 text-sm sm:text-base leading-relaxed">
              Explore our curated showroom categories. From 22K Hallmarked Gold to IGI Certified Diamonds and traditional Bengali Karigar artistry.
            </p>
          </div>
        </div>
      </section>

      {/* Shop By Category Oval Grid (6 columns desktop, 2 columns mobile) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-[3/4] rounded-full bg-card animate-pulse border border-gold/20" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 sm:gap-6">
            {categories.map((c) => (
              <Link
                key={c.slug || c.id}
                to={`/jewelleries/${c.slug || c.id}`}
                className="group text-center block"
              >
                <div className="mx-auto aspect-[3/4] w-full rounded-full overflow-hidden border-2 border-gold/40 bg-card shadow-xs group-hover:shadow-gold group-hover:border-gold transition-all duration-300 relative">
                  <img
                    src={c.image || "/assets/cat-gold.jpg"}
                    alt={c.name}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-deep-red/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="mt-3 text-xs sm:text-sm font-bold text-foreground group-hover:text-deep-red transition-colors leading-tight">
                  {c.name}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Trust & Craftsmanship Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
