import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, MessageCircle, Phone, Sparkles, CheckCircle2, ShieldCheck, Award, Eye, Scale, Gem } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { products as fallbackProducts } from "@/lib/data";

export const Route = createFileRoute("/product/$id")({
  component: SingleProductPage,
});

function SingleProductPage() {
  const { id } = Route.useParams();
  const [product, setProduct] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [activeImage, setActiveImage] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?id=${id}`);
        const data = await res.json();
        if (data && data.product) {
          setProduct(data.product);
          setActiveImage(data.product.image);
          setRelated(Array.isArray(data.related) ? data.related : []);
        } else if (Array.isArray(data)) {
          const found = data.find((p: any) => String(p.id) === String(id) || p.slug === id);
          if (found) {
            setProduct(found);
            setActiveImage(found.image);
          } else {
            const fallback = fallbackProducts.find((p) => String(p.id) === String(id));
            if (fallback) {
              setProduct(fallback);
              setActiveImage(fallback.image);
            }
          }
        }
      } catch (err) {
        console.error(err);
        const fallback = fallbackProducts.find((p) => String(p.id) === String(id));
        if (fallback) {
          setProduct(fallback);
          setActiveImage(fallback.image);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-24 px-4 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 animate-pulse">
        <div className="h-[500px] bg-card rounded-3xl border border-gold/20" />
        <div className="space-y-6">
          <div className="h-10 w-3/4 bg-card rounded-xl" />
          <div className="h-6 w-1/2 bg-card rounded-xl" />
          <div className="h-32 bg-card rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background py-24 px-4 max-w-xl mx-auto text-center space-y-6">
        <Gem className="w-16 h-16 text-gold mx-auto" />
        <h1 className="text-3xl font-extrabold text-deep-red">Product Not Found</h1>
        <p className="text-muted-foreground">The requested ornament is either archived or being re-designed.</p>
        <Link
          to="/jewelleries"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full gradient-gold text-deep-red font-bold text-sm shadow-gold"
        >
          <ArrowLeft className="w-4 h-4" /> BROWSE ALL JEWELLERIES
        </Link>
      </div>
    );
  }

  const gallery: string[] =
    Array.isArray(product.thumbnails) && product.thumbnails.length > 0
      ? product.thumbnails
      : [product.image];

  return (
    <div className="bg-background min-h-screen text-foreground pb-24">
      {/* Breadcrumb Header */}
      <div className="bg-[oklch(0.22_0.04_25)] border-b border-gold/30 py-4 px-4 text-xs font-bold text-ivory/80">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto">
          <Link to="/" className="hover:text-gold transition-colors">Home</Link>
          <span className="text-gold/50">/</span>
          <Link to="/jewelleries" className="hover:text-gold transition-colors">Jewelleries</Link>
          <span className="text-gold/50">/</span>
          <Link to={`/jewelleries/${product.category_slug || product.category || "gold"}`} className="hover:text-gold transition-colors uppercase">
            {product.category_slug || product.category || "Gold"}
          </Link>
          <span className="text-gold/50">/</span>
          <span className="text-gold font-extrabold truncate">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Image Gallery (Span 7) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative h-[420px] sm:h-[560px] rounded-3xl overflow-hidden border-2 border-gold/40 shadow-gold bg-black grid place-items-center">
              <img
                src={activeImage || product.image || "/assets/product-1.jpg"}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-500"
              />
              <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md border border-gold/50 text-gold text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-gold">
                <Sparkles className="w-3.5 h-3.5" /> {product.purity || "22K Hallmarked"}
              </div>
            </div>

            {/* Thumbnail Gallery Row */}
            {gallery.length > 1 && (
              <div className="flex items-center gap-4 overflow-x-auto pb-2">
                {gallery.map((thumb, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(thumb)}
                    className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 shrink-0 transition-all duration-300 ${
                      activeImage === thumb
                        ? "border-gold ring-4 ring-gold/30 scale-105 shadow-gold"
                        : "border-gold/30 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={thumb} alt={`View ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Labeled Product Specifications & Actions (Span 5) */}
          <div className="lg:col-span-5 space-y-8 bg-card border-2 border-gold/30 rounded-3xl p-6 sm:p-8 shadow-gold">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 border border-gold/40 text-gold text-xs font-bold uppercase tracking-wider mb-3">
                <Gem className="w-3.5 h-3.5" /> Showroom Exclusive Ornament
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-deep-red leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Labeled Specifications Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-background border-2 border-gold/40 rounded-2xl p-4 shadow-sm flex flex-col justify-center">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gold mb-1">
                  <Scale className="w-4 h-4" /> NET ORNAMENT WEIGHT
                </div>
                <div className="text-2xl font-extrabold text-foreground">
                  {product.weight || "N/A"}
                </div>
              </div>

              <div className="bg-background border-2 border-gold/40 rounded-2xl p-4 shadow-sm flex flex-col justify-center">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gold mb-1">
                  <Award className="w-4 h-4" /> PURITY CERTIFICATION
                </div>
                <div className="text-lg sm:text-xl font-extrabold text-foreground truncate">
                  {product.purity || "22K Hallmarked"}
                </div>
              </div>
            </div>

            <div className="bg-background border border-gold/30 rounded-2xl p-5 space-y-3">
              <div className="text-xs font-bold uppercase tracking-widest text-gold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> DETAILED DESCRIPTION & CRAFTSMANSHIP
              </div>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                {product.description ||
                  "Handcrafted with precision by our master karigars. Tested for purity and backed by A Banik Jewellers' lifetime exchange assurance."}
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <a
                href={`https://wa.me/${siteConfig.whatsapp}?text=Hello!%20I%20am%20interested%20in%20inquiring%20about%20the%20${encodeURIComponent(product.name)}%20(Weight:%20${product.weight || ""},%20Purity:%20${product.purity || ""}).`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-4 rounded-2xl gradient-gold text-deep-red font-extrabold text-sm tracking-wider shadow-gold hover:scale-[1.02] active:scale-[0.98] transition-elegant flex items-center justify-center gap-2 block"
              >
                <MessageCircle className="w-5 h-5" />
                <span>INQUIRE ON WHATSAPP FOR PRICING</span>
              </a>

              <a
                href={`tel:${siteConfig.phoneClean}`}
                className="w-full py-4 rounded-2xl border-2 border-gold/60 text-deep-red font-extrabold text-sm tracking-wider hover:bg-gold hover:text-white transition-elegant flex items-center justify-center gap-2 block"
              >
                <Phone className="w-5 h-5" />
                <span>CALL SHOWROOM AT {siteConfig.phoneDisplay}</span>
              </a>
            </div>

            {/* Trust Assurances Footer */}
            <div className="pt-4 border-t border-gold/20 grid grid-cols-2 gap-4 text-xs font-semibold text-muted-foreground">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-gold shrink-0" />
                <span>100% BIS Hallmarked</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gold shrink-0" />
                <span>Lifetime Buyback Policy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {related && related.length > 0 && (
          <div className="mt-20 pt-16 border-t-2 border-gold/30 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-gold mb-1">
                  Complementary Ornaments
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-deep-red">
                  Related Jewellery Products
                </h2>
              </div>
              <Link
                to={`/jewelleries/${product.category_slug || product.category || "gold"}`}
                className="text-sm font-extrabold text-gold hover:underline flex items-center gap-1"
              >
                <span>View More in Category</span>
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((rel) => (
                <div
                  key={rel.id}
                  className="bg-card border-2 border-gold/30 hover:border-gold rounded-3xl overflow-hidden shadow-gold flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5"
                >
                  <div>
                    <Link to={`/product/${rel.id}`} className="block relative h-52 overflow-hidden bg-black/5">
                      <img
                        src={rel.image || "/assets/product-1.jpg"}
                        alt={rel.name}
                        className="w-full h-full object-cover hover:scale-108 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-black/80 border border-gold/40 text-gold text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {rel.weight || "Hallmarked"}
                      </div>
                    </Link>

                    <div className="p-5 space-y-1.5">
                      <div className="text-xs text-gold font-bold uppercase tracking-wider truncate">
                        {rel.purity || "22K Gold"}
                      </div>
                      <Link to={`/product/${rel.id}`}>
                        <h3 className="text-base font-extrabold text-foreground hover:text-deep-red transition-colors line-clamp-1">
                          {rel.name}
                        </h3>
                      </Link>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <Link
                      to={`/product/${rel.id}`}
                      className="w-full py-3 rounded-xl gradient-gold text-deep-red text-center font-extrabold text-xs tracking-wider shadow-gold hover:scale-[1.02] transition-elegant block flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-4 h-4" />
                      <span>VIEW DETAILS & PRICING</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
