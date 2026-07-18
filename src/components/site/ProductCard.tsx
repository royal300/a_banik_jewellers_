import { Link } from "@tanstack/react-router";
import type { Product } from "@/lib/data";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to={`/product/${product.id}`}
      className="group block rounded-2xl bg-card overflow-hidden border border-gold/20 shadow-sm hover:shadow-elegant hover:-translate-y-1 transition-elegant"
    >
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-110 transition-[transform] duration-700"
        />
      </div>
      <div className="p-4 sm:p-5">
        <h3 className="font-semibold text-sm sm:text-base text-foreground line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>
        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-gold" />
          Weight: <span className="font-semibold text-foreground">{product.weight}</span>
        </div>
        <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-deep-red group-hover:gap-3 transition-elegant">
          VIEW DETAILS
          <span className="w-6 h-px bg-deep-red group-hover:w-10 transition-all" />
        </div>
      </div>
    </Link>
  );
}
