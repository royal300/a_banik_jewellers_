import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Sparkles, Gem, MessageCircle, Eye } from "lucide-react";
import { products as fallbackProducts, categories as fallbackCategories } from "@/lib/data";
import { siteConfig } from "@/lib/site-config";

export const Route = createFileRoute("/jewelleries/$slug")({
  component: CategoryProductsPage,
});

function CategoryProductsPage() {
  const { slug } = Route.useParams();
  const [products, setProducts] = useState<any[]>([]);
  const [categoryInfo, setCategoryInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [pRes, cRes] = await Promise.all([
          fetch(`/api/products?category=${slug}`),
          fetch("/api/categories"),
        ]);
        const [pData, cData] = await Promise.all([pRes.json(), cRes.json()]);

        if (Array.isArray(pData)) {
          setProducts(pData);
        } else {
          setProducts(fallbackProducts.filter((p) => p.category === slug));
        }

        if (Array.isArray(cData)) {
          const found = cData.find((c: any) => c.slug === slug);
          if (found) setCategoryInfo(found);
        } else {
          const found = fallbackCategories.find((c) => c.slug === slug);
          if (found) setCategoryInfo(found);
        }
      } catch (err) {
        console.error(err);
        setProducts(fallbackProducts.filter((p) => p.category === slug));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  const catName = categoryInfo ? categoryInfo.name : `${slug.charAt(0).toUpperCase() + slug.slice(1)} Jewellery`;
  const catDesc = categoryInfo
    ? categoryInfo.description
    : `Explore our hallmarked and certified ${catName} collection right from our Madhyamgram showroom.`;

  return (
    <div className="bg-background min-h-screen text-foreground pb-20">
      {/* Header Banner */}
      <section className="relative py-16 sm:py-24 bg-gradient-to-b from-[oklch(0.22_0.04_25)] via-[oklch(0.20_0.04_25)] to-background border-b border-gold/20 overflow-hidden text-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4 text-center">
          <Link
            to="/jewelleries"
            className="inline-flex items-center gap-2 text-xs font-bold text-gold uppercase tracking-wider hover:underline mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to All Categories
          </Link>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/40 bg-gold/10 text-gold text-xs font-bold uppercase tracking-[0.25em] mx-auto block w-fit">
            <Sparkles className="w-3.5 h-3.5" /> {catName}
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-gold tracking-tight">{catName}</h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-ivory/80 leading-relaxed">{catDesc}</p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between pb-6 border-b border-gold/20 mb-10">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-gold">Showroom Catalogue</div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-deep-red">Available Ornaments</h2>
          </div>
          <div className="text-sm font-semibold text-muted-foreground">
            {loading ? "Loading..." : `${products.length} Designs Available`}
          </div>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-96 rounded-3xl bg-card animate-pulse border border-gold/20" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-card/50 border border-gold/20 rounded-3xl max-w-xl mx-auto p-8 space-y-4">
            <Gem className="w-12 h-12 text-gold mx-auto" />
            <h3 className="text-2xl font-extrabold text-deep-red">Collection Being Curated</h3>
            <p className="text-muted-foreground text-sm">
              Our karigars are currently preparing fresh designs for this category. Please check back shortly or inquire directly via WhatsApp.
            </p>
            <a
              href={`https://wa.me/${siteConfig.whatsapp}?text=Hello!%20I%20am%20looking%20for%20${encodeURIComponent(catName)}%20designs.`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full gradient-gold text-deep-red font-bold text-sm shadow-gold"
            >
              <MessageCircle className="w-4 h-4" /> INQUIRE ON WHATSAPP
            </a>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((prod) => (
              <div
                key={prod.id}
                className="group bg-card border-2 border-gold/30 hover:border-gold rounded-3xl overflow-hidden shadow-gold flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5"
              >
                <div>
                  {/* Image Container */}
                  <Link to={`/product/${prod.id}`} className="block relative h-64 overflow-hidden bg-black/5">
                    <img
                      src={prod.image || "/assets/product-1.jpg"}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md border border-gold/40 text-gold text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                      {prod.weight || "Certified"}
                    </div>
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="bg-gold text-deep-red font-extrabold text-xs px-4 py-2 rounded-full shadow-gold flex items-center gap-1.5 transform scale-95 group-hover:scale-100 transition-transform">
                        <Eye className="w-4 h-4" /> View Details
                      </span>
                    </div>
                  </Link>

                  {/* Details */}
                  <div className="p-6 space-y-2">
                    <div className="text-xs text-gold font-bold uppercase tracking-wider truncate">
                      {prod.purity || "22K Hallmarked Gold"}
                    </div>
                    <Link to={`/product/${prod.id}`}>
                      <h3 className="text-lg font-extrabold text-foreground group-hover:text-deep-red transition-colors line-clamp-1">
                        {prod.name}
                      </h3>
                    </Link>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {prod.description}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-6 pt-0 flex items-center gap-2">
                  <Link
                    to={`/product/${prod.id}`}
                    className="flex-1 py-3 rounded-xl gradient-gold text-deep-red text-center font-extrabold text-xs tracking-wider shadow-gold hover:scale-[1.02] transition-elegant block"
                  >
                    VIEW PRODUCT
                  </Link>
                  <a
                    href={`https://wa.me/${siteConfig.whatsapp}?text=Hello!%20I%20would%20like%20to%20know%20more%20about%20${encodeURIComponent(prod.name)}%20(${prod.weight || ""}).`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-xl gradient-red text-white hover:opacity-90 transition-elegant shadow-gold shrink-0"
                    title="Inquire on WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
