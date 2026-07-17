import { useMemo, useState } from "react";
import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { categories, products, type CategorySlug } from "@/lib/data";
import { ProductCard } from "@/components/site/ProductCard";
import { ArrowLeft, SlidersHorizontal } from "lucide-react";

export const Route = createFileRoute("/collections/$slug")({
  loader: ({ params }) => {
    const cat = categories.find((c) => c.slug === params.slug);
    if (!cat) throw notFound();
    return { category: cat };
  },
  head: ({ loaderData }) => {
    const title = loaderData ? `${loaderData.category.name} — A Banik Jewellers` : "Collection — A Banik Jewellers";
    const desc = loaderData?.category.description ?? "Explore our jewellery collection.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:url", content: loaderData ? `/collections/${loaderData.category.slug}` : "/collections" },
      ],
      links: loaderData ? [{ rel: "canonical", href: `/collections/${loaderData.category.slug}` }] : [],
    };
  },
  component: CollectionDetail,
});

const PAGE_SIZE = 8;

function CollectionDetail() {
  const { category } = Route.useLoaderData();
  const [sort, setSort] = useState<"default" | "weight-asc" | "weight-desc">("default");
  const [page, setPage] = useState(1);

  const list = useMemo(() => {
    const filtered = products.filter((p) => p.category === (category.slug as CategorySlug));
    const parse = (w: string) => parseFloat(w);
    const sorted = [...filtered];
    if (sort === "weight-asc") sorted.sort((a, b) => parse(a.weight) - parse(b.weight));
    if (sort === "weight-desc") sorted.sort((a, b) => parse(b.weight) - parse(a.weight));
    return sorted;
  }, [category.slug, sort]);

  const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  const pageItems = list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <section className="relative h-[36vh] sm:h-[45vh] overflow-hidden">
        <img src={category.image} alt={category.name} className="absolute inset-0 w-full h-full object-cover" width={1920} height={900} />
        <div className="absolute inset-0 bg-gradient-to-r from-deep-red/85 via-deep-red/55 to-black/40" />
        <div className="relative h-full flex items-center px-6">
          <div className="max-w-7xl mx-auto w-full text-white reveal">
            <Link to="/collections" className="inline-flex items-center gap-2 text-gold text-xs font-bold tracking-[0.3em] uppercase mb-3 hover:gap-3 transition-all">
              <ArrowLeft className="w-4 h-4" /> ALL COLLECTIONS
            </Link>
            <h1 className="text-4xl sm:text-5xl font-bold">{category.name}</h1>
            <p className="mt-3 max-w-xl text-white/85">{category.description}</p>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-bold text-foreground">{pageItems.length}</span> of <span className="font-bold text-foreground">{list.length}</span> pieces
            </div>
            <label className="inline-flex items-center gap-2 rounded-full bg-card border border-gold/30 px-4 py-2 text-sm">
              <SlidersHorizontal className="w-4 h-4 text-gold" />
              <span className="font-semibold">Sort</span>
              <select
                value={sort}
                onChange={(e) => { setSort(e.target.value as typeof sort); setPage(1); }}
                className="bg-transparent outline-none font-semibold text-deep-red"
              >
                <option value="default">Featured</option>
                <option value="weight-asc">Weight: Low to High</option>
                <option value="weight-desc">Weight: High to Low</option>
              </select>
            </label>
          </div>

          {list.length === 0 ? (
            <div className="rounded-3xl bg-card border border-gold/20 p-16 text-center">
              <p className="text-muted-foreground">More pieces from this collection are coming soon.</p>
              <Link to="/products" className="mt-6 inline-flex px-6 py-3 rounded-full gradient-red text-white font-bold text-sm shadow-gold hover:scale-105 transition-elegant">
                BROWSE ALL PRODUCTS
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {pageItems.map((p, i) => (
                  <div key={p.id} style={{ animationDelay: `${i * 60}ms` }} className="reveal">
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
            </>
          )}
        </div>
      </section>
    </>
  );
}
