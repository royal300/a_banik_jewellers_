import { useState } from "react";
import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { products, categories } from "@/lib/data";
import { siteConfig } from "@/lib/site-config";
import { MessageCircle, Check, ShieldCheck, Truck, ArrowLeft } from "lucide-react";
import { ProductCard } from "@/components/site/ProductCard";
import { SectionHeading } from "@/components/site/Section";

export const Route = createFileRoute("/products/$id")({
  loader: ({ params }) => {
    const product = products.find((p) => p.id === params.id);
    if (!product) throw notFound();
    const category = categories.find((c) => c.slug === product.category);
    const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
    return { product, category, related };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Product — A Banik Jewellers" }] };
    const { product } = loaderData;
    return {
      meta: [
        { title: `${product.name} — A Banik Jewellers` },
        { name: "description", content: product.description },
        { property: "og:title", content: product.name },
        { property: "og:description", content: product.description },
        { property: "og:image", content: product.image },
        { property: "og:url", content: `/products/${product.id}` },
        { property: "og:type", content: "product" },
      ],
      links: [{ rel: "canonical", href: `/products/${product.id}` }],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { product, category, related } = Route.useLoaderData();
  const gallery = [product.image, product.image, product.image, product.image];
  const [active, setActive] = useState(0);

  const waMessage = encodeURIComponent(
    `Hello,\nI am interested in this jewellery.\nProduct Name: ${product.name}\nWeight: ${product.weight}`
  );
  const waLink = `https://wa.me/${siteConfig.whatsapp}?text=${waMessage}`;

  return (
    <>
      <section className="pt-8 sm:pt-12 px-4">
        <div className="max-w-7xl mx-auto">
          <Link to="/products" className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.3em] uppercase text-deep-red hover:gap-3 transition-all">
            <ArrowLeft className="w-4 h-4" /> BACK TO PRODUCTS
          </Link>
          <div className="mt-8 grid lg:grid-cols-2 gap-10 lg:gap-16">
            <div className="reveal">
              <div className="rounded-3xl overflow-hidden bg-card border border-gold/25 shadow-elegant aspect-square group">
                <img src={gallery[active]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-[transform] duration-[900ms]" />
              </div>
              <div className="mt-4 grid grid-cols-4 gap-3">
                {gallery.map((g, i) => (
                  <button key={i} onClick={() => setActive(i)}
                    className={`rounded-2xl overflow-hidden aspect-square border-2 transition-elegant ${i === active ? "border-gold shadow-gold" : "border-gold/20 hover:border-gold/60"}`}>
                    <img src={g} alt={`${product.name} ${i + 1}`} loading="lazy" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="reveal">
              {category && (
                <Link to="/collections/$slug" params={{ slug: category.slug }} className="text-gold text-xs font-bold tracking-[0.35em] uppercase">
                  {category.name}
                </Link>
              )}
              <h1 className="mt-3 text-3xl sm:text-4xl font-bold text-deep-red">{product.name}</h1>
              <div className="mt-3 flex items-center gap-3 text-sm">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 text-deep-red font-semibold">
                  <Check className="w-3.5 h-3.5" /> {product.availability}
                </span>
                <span className="text-muted-foreground">·</span>
                <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                  <ShieldCheck className="w-4 h-4 text-gold" /> Hallmarked
                </span>
              </div>

              <p className="mt-6 text-muted-foreground leading-relaxed">{product.description}</p>

              <dl className="mt-8 rounded-3xl border border-gold/25 bg-card overflow-hidden divide-y divide-gold/15">
                {[
                  ["Category", category?.name ?? "Jewellery"],
                  ["Weight", product.weight],
                  ["Purity", product.purity],
                  ["Availability", product.availability],
                  ["Product Code", product.id.toUpperCase()],
                ].map(([k, v]) => (
                  <div key={k} className="grid grid-cols-3 px-6 py-4">
                    <dt className="text-xs font-bold tracking-widest uppercase text-muted-foreground col-span-1">{k}</dt>
                    <dd className="text-sm font-semibold text-foreground col-span-2">{v}</dd>
                  </div>
                ))}
              </dl>

              <a href={waLink} target="_blank" rel="noreferrer"
                className="mt-8 flex items-center justify-center gap-3 w-full py-5 rounded-2xl bg-[#25D366] text-white font-bold text-base shadow-elegant hover:scale-[1.02] transition-elegant">
                <MessageCircle className="w-6 h-6" /> ORDER ON WHATSAPP
              </a>

              <div className="mt-6 grid grid-cols-2 gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-2"><Truck className="w-4 h-4 text-gold" /> In-store try-on available</div>
                <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-gold" /> Certified purity</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="py-16 sm:py-24 px-4 mt-10">
          <div className="max-w-7xl mx-auto">
            <SectionHeading eyebrow="You may also love" title="Related Products" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
