import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ChevronRight,
  ChevronLeft,
  Heart,
  Share2,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  Award,
  ArrowLeft,
  Eye,
  Gem,
} from "lucide-react";
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
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-16 px-4 max-w-7xl mx-auto grid lg:grid-cols-12 gap-10 animate-pulse">
        <div className="lg:col-span-6 flex justify-center">
          <div className="w-[500px] h-[500px] max-w-full bg-card rounded-2xl border border-border/40" />
        </div>
        <div className="lg:col-span-6 space-y-5">
          <div className="h-8 w-3/4 bg-card rounded-lg" />
          <div className="h-4 w-1/3 bg-card rounded-md" />
          <div className="h-20 bg-card rounded-xl" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background py-24 px-4 max-w-xl mx-auto text-center space-y-6">
        <Gem className="w-16 h-16 text-gold mx-auto" />
        <h1 className="text-2xl font-bold text-deep-red">Product Not Found</h1>
        <p className="text-muted-foreground text-sm">The requested ornament is either archived or being re-crafted.</p>
        <Link
          to="/jewelleries"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full gradient-gold text-deep-red font-semibold text-sm shadow-sm"
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

  const currentIdx = gallery.indexOf(activeImage);
  const handlePrevImage = () => {
    if (gallery.length <= 1) return;
    const prev = (currentIdx - 1 + gallery.length) % gallery.length;
    setActiveImage(gallery[prev]);
  };
  const handleNextImage = () => {
    if (gallery.length <= 1) return;
    const next = (currentIdx + 1) % gallery.length;
    setActiveImage(gallery[next]);
  };

  const skuCode = `ABJ-${String(product.id || "001").toUpperCase()}`;

  return (
    <div className="bg-background min-h-screen text-foreground pb-20">
      {/* Clean Light Breadcrumb Header */}
      <div className="py-4 px-4 sm:px-8 border-b border-border/40 text-xs font-medium text-muted-foreground">
        <div className="max-w-7xl mx-auto flex items-center gap-1.5 overflow-x-auto">
          <Link to="/" className="hover:text-gold transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-60" />
          <Link to="/jewelleries" className="hover:text-gold transition-colors">Jewelleries</Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-60" />
          <Link
            to={`/jewelleries/${product.category_slug || product.category || "gold"}`}
            className="hover:text-gold transition-colors capitalize"
          >
            {product.category_slug || product.category || "Gold"}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-60" />
          <span className="text-foreground font-semibold truncate max-w-[200px] sm:max-w-none">{product.name}</span>
        </div>
      </div>

      {/* Main Single Product Layout (500x500 Image Left, Borderless Compact Info Right) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: 500x500 Product Image & Gallery (Span 6) */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <div className="relative w-[500px] h-[500px] max-w-full aspect-square rounded-2xl overflow-hidden bg-card border border-border/30 shadow-xs grid place-items-center group">
              <img
                src={activeImage || product.image || "/assets/product-1.jpg"}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-300"
              />

              {/* Prev / Next Arrows */}
              {gallery.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-3 p-2.5 rounded-md bg-black/40 text-white hover:bg-black/70 transition-all opacity-80 hover:opacity-100"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-3 p-2.5 rounded-md bg-black/40 text-white hover:bg-black/70 transition-all opacity-80 hover:opacity-100"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Gallery Thumbnails */}
            {gallery.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto mt-4 pb-2">
                {gallery.map((thumb, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(thumb)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                      activeImage === thumb
                        ? "border-gold ring-2 ring-gold/40 scale-105"
                        : "border-border/40 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={thumb} alt={`View ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Borderless Compact Product Information (Span 6) */}
          <div className="lg:col-span-6 space-y-6 pt-1">
            {/* Header: Made in India Badge & Wishlist/Share */}
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full border border-border/40">
                <span>Made in India</span>
                <span className="text-base leading-none">🇮🇳</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsWishlisted((v) => !v)}
                  className={`p-2 rounded-full border border-border/50 hover:bg-secondary/60 transition-colors ${
                    isWishlisted ? "text-red-500 fill-red-500" : "text-muted-foreground"
                  }`}
                  aria-label="Save to wishlist"
                >
                  <Heart className="w-5 h-5" />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 rounded-full border border-border/50 hover:bg-secondary/60 transition-colors text-muted-foreground relative"
                  aria-label="Share product"
                >
                  <Share2 className="w-5 h-5" />
                  {copied && (
                    <span className="absolute -bottom-8 right-0 bg-black text-white text-[10px] px-2 py-0.5 rounded shadow">
                      Copied!
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Product Title & Compact Meta */}
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground leading-snug">
                {product.name}
              </h1>
              <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                SKU: {skuCode}
              </div>
            </div>

            {/* Compact Specifications Bar (Without heavy boxes/borders) */}
            <div className="py-4 border-y border-border/40 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <div className="text-muted-foreground font-medium mb-0.5">Metal / Purity</div>
                <div className="font-semibold text-foreground">{product.purity || "22K Gold"}</div>
              </div>
              <div>
                <div className="text-muted-foreground font-medium mb-0.5">Net Weight</div>
                <div className="font-semibold text-foreground">{product.weight || "N/A"}</div>
              </div>
              <div>
                <div className="text-muted-foreground font-medium mb-0.5">Purity Cert.</div>
                <div className="font-semibold text-foreground">BIS Hallmarked</div>
              </div>
              <div>
                <div className="text-muted-foreground font-medium mb-0.5">Availability</div>
                <div className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {product.availability || "In Stock"}
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Description & Artistry
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed">
                {product.description ||
                  "Handcrafted with precision by our master karigars in Madhyamgram. BIS Hallmarked for purity assurance and backed by A Banik Jewellers' legacy of trust."}
              </p>
            </div>

            {/* Showroom Availability & Actions */}
            <div className="pt-3 space-y-3">
              <a
                href={`https://wa.me/${siteConfig.whatsapp}?text=Hello!%20I%20am%20interested%20in%20inquiring%20about%20the%20${encodeURIComponent(product.name)}%20(SKU:%20${skuCode},%20Weight:%20${product.weight || ""},%20Purity:%20${product.purity || ""}).`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 rounded-xl gradient-gold text-deep-red font-semibold text-sm tracking-wide shadow-xs hover:opacity-95 transition-all flex items-center justify-center gap-2 block text-center"
              >
                <MessageCircle className="w-4 h-4" />
                <span>INQUIRE ON WHATSAPP FOR PRICING</span>
              </a>

              <a
                href={`tel:${siteConfig.phoneClean}`}
                className="w-full py-3.5 rounded-xl border border-gold/50 text-foreground font-semibold text-sm tracking-wide hover:bg-gold/10 transition-colors flex items-center justify-center gap-2 block text-center"
              >
                <Phone className="w-4 h-4 text-gold" />
                <span>CALL SHOWROOM AT {siteConfig.phoneDisplay}</span>
              </a>
            </div>

            {/* Clean Assurance Footer Badges (Like Reference Image) */}
            <div className="pt-4 flex items-center justify-between gap-2 border-t border-border/30 text-[11px] font-medium text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>100% BIS Hallmarked</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-gold shrink-0" />
                <span>Certified Purity</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-gold shrink-0" />
                <span>Lifetime Exchange</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {related && related.length > 0 && (
          <div className="mt-16 pt-12 border-t border-border/40 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-gold">Complementary Ornaments</div>
                <h2 className="text-xl font-bold text-foreground">Related Jewellery Products</h2>
              </div>
              <Link
                to={`/jewelleries/${product.category_slug || product.category || "gold"}`}
                className="text-xs font-semibold text-gold hover:underline flex items-center gap-1"
              >
                <span>View Category</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((rel) => (
                <div
                  key={rel.id}
                  className="group bg-card border border-border/30 rounded-2xl overflow-hidden shadow-xs hover:border-gold/50 transition-all flex flex-col justify-between"
                >
                  <div>
                    <Link to={`/product/${rel.id}`} className="block relative h-52 overflow-hidden bg-secondary/30">
                      <img
                        src={rel.image || "/assets/product-1.jpg"}
                        alt={rel.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2.5 left-2.5 bg-black/70 text-gold text-[10px] font-semibold px-2.5 py-0.5 rounded-full uppercase">
                        {rel.weight || "Hallmarked"}
                      </div>
                    </Link>

                    <div className="p-4 space-y-1">
                      <div className="text-[11px] text-gold font-medium uppercase tracking-wider truncate">
                        {rel.purity || "22K Gold"}
                      </div>
                      <Link to={`/product/${rel.id}`}>
                        <h3 className="text-sm font-semibold text-foreground group-hover:text-gold transition-colors line-clamp-1">
                          {rel.name}
                        </h3>
                      </Link>
                    </div>
                  </div>

                  <div className="p-4 pt-0">
                    <Link
                      to={`/product/${rel.id}`}
                      className="w-full py-2.5 rounded-lg border border-gold/40 text-foreground text-center font-semibold text-xs tracking-wider hover:bg-gold hover:text-deep-red transition-all flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>VIEW DETAILS</span>
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

