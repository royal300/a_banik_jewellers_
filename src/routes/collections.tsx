import { createFileRoute, Link } from "@tanstack/react-router";
import { categories } from "@/lib/data";
import { SectionHeading } from "@/components/site/Section";
import bannerWedding from "@/assets/banner-wedding.jpg";

export const Route = createFileRoute("/collections")({
  head: () => ({
    meta: [
      { title: "Collections — A Banik Jewellers" },
      { name: "description", content: "Browse our gold, diamond, silver, necklace, ring and bangle collections at A Banik Jewellers, Madhyamgram." },
      { property: "og:title", content: "Collections — A Banik Jewellers" },
      { property: "og:description", content: "Our full range of hallmarked and certified jewellery collections." },
      { property: "og:url", content: "/collections" },
    ],
    links: [{ rel: "canonical", href: "/collections" }],
  }),
  component: CollectionsPage,
});

function CollectionsPage() {
  return (
    <>
      <section className="relative h-[38vh] sm:h-[45vh] overflow-hidden">
        <img src={bannerWedding} alt="Collections" width={1920} height={900} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-deep-red/85 via-deep-red/55 to-black/40" />
        <div className="relative h-full flex items-center px-6">
          <div className="max-w-7xl mx-auto w-full text-white reveal">
            <div className="text-gold text-xs font-bold tracking-[0.35em] uppercase mb-3">Discover</div>
            <h1 className="text-4xl sm:text-5xl font-bold">Our Collections</h1>
            <p className="mt-3 max-w-xl text-white/85">Six curated worlds of jewellery — for every celebration and every day.</p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <SectionHeading eyebrow="Categories" title="Browse Collections" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {categories.map((c, i) => (
              <Link key={c.slug} to="/collections/$slug" params={{ slug: c.slug }}
                style={{ animationDelay: `${i * 80}ms` }}
                className="reveal group rounded-3xl overflow-hidden bg-card border border-gold/25 shadow-sm hover:shadow-elegant hover:-translate-y-1 transition-elegant">
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  <img src={c.image} alt={c.name} loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-[transform] duration-700" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-deep-red">{c.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{c.description}</p>
                  <div className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-gold group-hover:gap-3 transition-elegant">
                    EXPLORE COLLECTION
                    <span className="h-px w-8 bg-gold group-hover:w-14 transition-all" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
