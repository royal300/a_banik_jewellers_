import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Shield, Gem as GemIcon, Sparkles, Award, Star } from "lucide-react";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import bannerWedding from "@/assets/banner-wedding.jpg";
import bannerFestival from "@/assets/banner-festival.jpg";
import promo1 from "@/assets/promo-1.jpg";
import promo2 from "@/assets/promo-2.jpg";
import { categories as fallbackCategories, products as fallbackProducts, testimonials, whyChooseUs } from "@/lib/data";
import { ProductCard } from "@/components/site/ProductCard";
import { SectionHeading } from "@/components/site/Section";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "A Banik Jewellers — Timeless Gold, Diamond & Silver Jewellery, Madhyamgram" },
      { name: "description", content: "Explore premium hallmarked gold, certified diamond, and sterling silver jewellery at A Banik Jewellers, Madhyamgram — bridal, festive and custom designs." },
      { property: "og:title", content: "A Banik Jewellers — Premium Jewellery Showroom" },
      { property: "og:description", content: "Timeless elegance. Certified purity. Generations of trust." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

const fallbackSlides = [
  { image: hero1, eyebrow: "Signature Bridal", title: "Premium Jewellery Collection", subtitle: "Timeless Elegance, Handcrafted for You" },
  { image: hero2, eyebrow: "New Season", title: "Radiance in Every Detail", subtitle: "Gold. Diamonds. Pure Artistry." },
];

function Hero() {
  const [slides, setSlides] = useState<any[]>(fallbackSlides);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    async function loadHero() {
      try {
        const res = await fetch("/api/media?type=hero");
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setSlides(data);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadHero();
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5500);
    return () => clearInterval(t);
  }, [slides.length]);

  const go = (n: number) => setIndex((n + slides.length) % slides.length);

  return (
    <section className="relative w-full h-[64vh] min-h-[480px] sm:min-h-[550px] sm:h-[75vh] lg:h-[85vh] max-h-[900px] overflow-hidden">
      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-[1200ms] ${i === index ? "opacity-100" : "opacity-0"}`}
        >
          <img src={s.image} alt={s.title} width={1920} height={900}
               className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-6 sm:px-10 w-full">
              <div className={`max-w-xl text-white ${i === index ? "reveal" : ""}`}>
                <div className="text-gold text-xs sm:text-sm font-bold tracking-[0.35em] uppercase mb-2 sm:mb-4">
                  {s.subtitle || s.eyebrow || "Signature Series"}
                </div>
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] drop-shadow-lg">
                  {s.title}
                </h1>
                <p className="mt-2 sm:mt-4 text-sm sm:text-lg text-white/85 max-w-md">
                  {s.subtitle && s.eyebrow ? s.subtitle : "Timeless Elegance, Handcrafted for You"}
                </p>
                <div className="mt-5 sm:mt-8 flex flex-wrap gap-3">
                  <Link to="/jewelleries"
                    className="px-6 py-3 rounded-full gradient-gold text-deep-red font-bold text-sm tracking-wide shadow-gold hover:scale-105 transition-elegant">
                    SHOP NOW
                  </Link>
                  <Link to="/contact"
                    className="px-6 py-3 rounded-full border border-white/70 text-white font-semibold text-sm tracking-wide hover:bg-white hover:text-deep-red transition-elegant">
                    CONTACT US
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, i) => (
            <button key={i} onClick={() => go(i)} aria-label={`Slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-500 ${i === index ? "w-10 bg-gold" : "w-2 bg-white/60"}`} />
          ))}
        </div>
      )}
    </section>
  );
}

function CategorySection() {
  const [categories, setCategories] = useState<any[]>(fallbackCategories);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/categories?home=1");
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data);
        }
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  return (
    <section className="py-16 sm:py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <SectionHeading eyebrow="Explore" title="Shop by Category"
          subtitle="From heirloom bridal sets to everyday elegance — discover the perfect piece from our curated collections." />
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 sm:gap-6">
          {categories.map((c, i) => (
            <Link key={c.slug || c.id} to={`/jewelleries/${c.slug || c.id}`}
              style={{ animationDelay: `${i * 60}ms` }}
              className="reveal group text-center block">
              <div className="mx-auto aspect-[3/4] w-full rounded-full overflow-hidden border-2 border-gold/40 bg-card shadow-sm group-hover:shadow-gold group-hover:border-gold transition-elegant relative">
                <img src={c.image || "/assets/cat-gold.jpg"} alt={c.name} loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-[transform] duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-deep-red/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="mt-3 text-xs sm:text-sm font-semibold text-foreground group-hover:text-deep-red transition-elegant leading-tight">
                {c.name}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function BannerSection() {
  const [banners, setBanners] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/media?type=promo");
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setBanners(data);
        } else {
          setBanners([
            { image: bannerWedding, subtitle: "Signature Series", title: "Wedding Collection", link: "/jewelleries/necklace" },
            { image: bannerFestival, subtitle: "Limited Edition", title: "Festival Offers", link: "/jewelleries/gold" },
            { image: promo1, subtitle: "Gold Bangles", title: "Everyday Radiance", link: "/jewelleries/bangles" },
            { image: promo2, subtitle: "Diamond Series", title: "Brilliance Reimagined", link: "/jewelleries/diamond" },
          ]);
        }
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  if (banners.length === 0) return null;

  return (
    <section className="py-6 sm:py-10 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map((b, i) => (
          <Link key={i} to={b.link || "/jewelleries"} className="reveal group relative rounded-3xl overflow-hidden shadow-elegant h-[360px] sm:h-[440px] md:h-[480px] block w-full">
            <img src={b.image} alt={b.title} loading="lazy"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-[transform] duration-[900ms]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end text-white">
              <div className="text-gold text-xs font-bold tracking-[0.35em] uppercase mb-1 sm:mb-2">{b.subtitle || "Signature Series"}</div>
              <h3 className="text-2xl sm:text-3xl font-bold">{b.title}</h3>
              <div className="mt-3 sm:mt-4 inline-flex items-center gap-2 text-xs sm:text-sm font-semibold group-hover:gap-4 transition-all">
                EXPLORE COLLECTION
                <span className="h-px w-8 bg-gold group-hover:w-14 transition-all" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function FeaturedCarousel() {
  const [featured, setFeatured] = useState<any[]>(fallbackProducts.slice(0, 8));

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/products?featured=1");
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setFeatured(data);
        } else {
          // If no products marked featured yet, show all
          const allRes = await fetch("/api/products");
          const allData = await allRes.json();
          if (Array.isArray(allData) && allData.length > 0) {
            setFeatured(allData.slice(0, 8));
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  const loop = [...featured, ...featured];

  return (
    <section className="py-16 sm:py-24 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <SectionHeading eyebrow="Best of A Banik" title="Featured Collection"
          subtitle="Handpicked masterpieces from our latest showcase — crafted for those who love the timeless." />
      </div>
      <div className="relative">
        <div className="flex gap-4 sm:gap-6 animate-scroll-x w-max">
          {loop.map((p, i) => (
            <div key={i} className="w-[42vw] sm:w-[32vw] md:w-[26vw] lg:w-[22vw] max-w-[300px] shrink-0">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent" />
      </div>
      <div className="max-w-7xl mx-auto text-center mt-10">
        <Link to="/jewelleries" className="inline-flex px-8 py-3 rounded-full gradient-red text-white font-bold text-sm tracking-wider shadow-gold hover:scale-105 transition-elegant">
          VIEW ALL JEWELLERIES
        </Link>
      </div>
    </section>
  );
}

const iconMap = { shield: Shield, gem: GemIcon, sparkles: Sparkles, award: Award } as const;

function WhyChoose() {
  return (
    <section className="py-16 sm:py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <SectionHeading eyebrow="Our Promise" title="Why Choose Us" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {whyChooseUs.map((w, i) => {
            const Icon = iconMap[w.icon];
            return (
              <div key={w.title} style={{ animationDelay: `${i * 80}ms` }}
                className="reveal rounded-3xl bg-card border border-gold/25 p-6 sm:p-8 text-center hover:-translate-y-1 hover:shadow-elegant transition-elegant">
                <div className="mx-auto w-16 h-16 rounded-full gradient-gold grid place-items-center mb-4 shadow-gold">
                  <Icon className="w-7 h-7 text-deep-red" />
                </div>
                <h3 className="font-bold text-base sm:text-lg text-deep-red">{w.title}</h3>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">{w.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % testimonials.length), 6000);
    return () => clearInterval(t);
  }, []);
  const prev = () => setI((v) => (v - 1 + testimonials.length) % testimonials.length);
  const next = () => setI((v) => (v + 1) % testimonials.length);

  const current = testimonials[i];

  return (
    <section className="py-16 sm:py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <SectionHeading eyebrow="Kind Words" title="Happy Customers" subtitle="See what our valued patrons have to say about their experience with us." />
        <div className="max-w-3xl mx-auto relative px-2 sm:px-12">
          <div className="rounded-3xl bg-card border-2 border-gold/30 p-8 sm:p-12 shadow-elegant relative overflow-hidden min-h-[260px] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-4">
                  <img src={current.image} alt={current.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-gold shadow-md" />
                  <div>
                    <div className="font-bold text-lg sm:text-xl text-deep-red">{current.name}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">{current.role}</div>
                  </div>
                </div>
                <div className="flex gap-1 text-gold">
                  {Array.from({ length: current.rating }).map((_, k) => (
                    <Star key={k} className="w-5 h-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="mt-6 sm:mt-8 text-base sm:text-xl text-foreground leading-relaxed italic">
                &ldquo;{current.review}&rdquo;
              </p>
            </div>
            <div className="mt-8 flex items-center justify-between pt-4 border-t border-gold/15">
              <div className="flex gap-2">
                {testimonials.map((_, idx) => (
                  <button key={idx} onClick={() => setI(idx)} aria-label={`Testimonial ${idx + 1}`}
                    className={`h-2.5 rounded-full transition-all duration-500 ${idx === i ? "w-8 bg-gold" : "w-2.5 bg-muted-foreground/30"}`} />
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={prev} aria-label="Previous testimonial"
                  className="w-10 h-10 rounded-full border border-gold/40 grid place-items-center text-deep-red hover:bg-gold hover:text-white transition-elegant">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={next} aria-label="Next testimonial"
                  className="w-10 h-10 rounded-full border border-gold/40 grid place-items-center text-deep-red hover:bg-gold hover:text-white transition-elegant">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HomePage() {
  return (
    <>
      <Hero />
      <CategorySection />
      <BannerSection />
      <FeaturedCarousel />
      <WhyChoose />
      <Testimonials />
    </>
  );
}

