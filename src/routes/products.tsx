import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { categories, products, type CategorySlug } from "@/lib/data";
import { ProductCard } from "@/components/site/ProductCard";
import bannerFestival from "@/assets/banner-festival.jpg";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "All Products — A Banik Jewellers" },
      { name: "description", content: "Browse the complete jewellery catalogue at A Banik Jewellers — gold, diamond, silver, necklaces, rings and bangles." },
      { property: "og:title", content: "All Products — A Banik Jewellers" },
      { property: "og:description", content: "The full catalogue of A Banik Jewellers." },
      { property: "og:url", content: "/products" },
    ],
    links: [{ rel: "canonical", href: "/products" }],
  }),
  component: ProductsPage,
});

const PAGE_SIZE = 12;

function ProductsPage() {
  const [filter, setFilter] = useState<CategorySlug | "all">("all");
  const [page, setPage] = useState(1);

  const list = useMemo(() => {
    if (filter === "all") return products;
    return products.filter((p) => p.category === filter);
  }, [filter]);

  const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  const pageItems = list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <section className="relative h-[36vh] sm:h-[42vh] overflow-hidden">
        <img src={bannerFestival} alt="Products" className="absolute inset-0 w-full h-full object-cover" width={1920} height={900} />
        <div className="absolute inset-0 bg-gradient-to-r from-deep-red/85 via-deep-red/55 to-black/40" />
        <div className="relative h-full flex items-center px-6">
          <div className="max-w-7xl mx-auto w-full text-white reveal">
            <div className="text-gold text-xs font-bold tracking-[0.35em] uppercase mb-3">Catalogue</div>
            <h1 className="text-4xl sm:text-5xl font-bold">All Products</h1>
            <p className="mt-3 text-white/85">Every hallmarked ornament, in one place.</p>
          </div>
        </div>
      </section>

      <section className="py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {[{ slug: "all" as const, name: "All" }, ...categories.map((c) => ({ slug: c.slug, name: c.name }))].map((c) => (
              <button key={c.slug} onClick={() => { setFilter(c.slug); setPage(1); }}
                className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold border transition-elegant ${filter === c.slug ? "gradient-red text-white border-transparent shadow-gold" : "bg-card border-gold/30 text-foreground hover:border-gold hover:text-deep-red"}`}>
                {c.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {pageItems.map((p, i) => (
              <div key={p.id} style={{ animationDelay: `${i * 50}ms` }} className="reveal">
                <ProductCard product={p} />
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-10 flex justify-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button key={i} onClick={() => setPage(i + 1)}
                  className={`w-10 h-10 rounded-full font-bold text-sm transition-elegant ${page === i + 1 ? "gradient-red text-white shadow-gold" : "bg-card border border-gold/30 hover:border-gold"}`}>
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
