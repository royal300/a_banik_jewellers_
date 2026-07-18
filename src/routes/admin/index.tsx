import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Grid, ShoppingBag, Image as ImageIcon, TrendingUp, ArrowRight, Sparkles } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const [stats, setStats] = useState({ categories: 0, products: 0, banners: 0 });
  const [rates, setRates] = useState<any>({ gold22K: "Loading...", gold24K: "Loading...", silver: "Loading..." });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [catsRes, prodsRes, mediaRes, ratesRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/products"),
          fetch("/api/media?type=all"),
          fetch("/api/rates"),
        ]);
        const [cats, prods, media, rateData] = await Promise.all([
          catsRes.json(),
          prodsRes.json(),
          mediaRes.json(),
          ratesRes.json(),
        ]);
        setStats({
          categories: Array.isArray(cats) ? cats.length : 0,
          products: Array.isArray(prods) ? prods.length : 0,
          banners: Array.isArray(media) ? media.length : 0,
        });
        if (rateData) setRates(rateData);
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-8 animate-hero-fade">
      <div>
        <div className="text-gold text-xs font-bold tracking-[0.3em] uppercase mb-1 flex items-center gap-2">
          <Sparkles className="w-4 h-4" /> Welcome Back, Admin
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-ivory">Dashboard Overview</h1>
        <p className="text-ivory/70 mt-1 text-sm sm:text-base">
          Manage your live showroom categories, jewellery products, promo banners, and metal rates right here.
        </p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link
          to="/admin/categories"
          className="bg-[oklch(0.22_0.04_25)] border-2 border-gold/30 rounded-3xl p-6 hover:border-gold transition-elegant group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl gradient-gold grid place-items-center shadow-gold">
              <Grid className="w-6 h-6 text-deep-red" />
            </div>
            <ArrowRight className="w-5 h-5 text-gold group-hover:translate-x-1 transition-transform" />
          </div>
          <div>
            <div className="text-3xl font-extrabold text-ivory">{loading ? "-" : stats.categories}</div>
            <div className="text-xs font-bold tracking-wider text-gold uppercase mt-1">Showroom Categories</div>
          </div>
        </Link>

        <Link
          to="/admin/products"
          className="bg-[oklch(0.22_0.04_25)] border-2 border-gold/30 rounded-3xl p-6 hover:border-gold transition-elegant group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl gradient-gold grid place-items-center shadow-gold">
              <ShoppingBag className="w-6 h-6 text-deep-red" />
            </div>
            <ArrowRight className="w-5 h-5 text-gold group-hover:translate-x-1 transition-transform" />
          </div>
          <div>
            <div className="text-3xl font-extrabold text-ivory">{loading ? "-" : stats.products}</div>
            <div className="text-xs font-bold tracking-wider text-gold uppercase mt-1">Jewellery Products</div>
          </div>
        </Link>

        <Link
          to="/admin/media-manager"
          className="bg-[oklch(0.22_0.04_25)] border-2 border-gold/30 rounded-3xl p-6 hover:border-gold transition-elegant group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl gradient-gold grid place-items-center shadow-gold">
              <ImageIcon className="w-6 h-6 text-deep-red" />
            </div>
            <ArrowRight className="w-5 h-5 text-gold group-hover:translate-x-1 transition-transform" />
          </div>
          <div>
            <div className="text-3xl font-extrabold text-ivory">{loading ? "-" : stats.banners}</div>
            <div className="text-xs font-bold tracking-wider text-gold uppercase mt-1">Active Banners & Media</div>
          </div>
        </Link>

        <Link
          to="/admin/rates"
          className="bg-[oklch(0.22_0.04_25)] border-2 border-gold/30 rounded-3xl p-6 hover:border-gold transition-elegant group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl gradient-gold grid place-items-center shadow-gold">
              <TrendingUp className="w-6 h-6 text-deep-red" />
            </div>
            <ArrowRight className="w-5 h-5 text-gold group-hover:translate-x-1 transition-transform" />
          </div>
          <div>
            <div className="text-lg font-bold text-ivory truncate">{rates.gold22K}</div>
            <div className="text-xs font-bold tracking-wider text-gold uppercase mt-1">Live 22K Gold Rate</div>
          </div>
        </Link>
      </div>

      {/* Live Metal Rates Preview Box */}
      <div className="bg-[oklch(0.22_0.04_25)] border-2 border-gold/40 rounded-3xl p-6 sm:p-8 shadow-gold">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gold/20">
          <div>
            <div className="text-gold text-xs font-bold tracking-widest uppercase">Navbar Live Feed Status</div>
            <h2 className="text-2xl font-extrabold text-ivory">Current Showroom Metal Rates</h2>
          </div>
          <Link
            to="/admin/rates"
            className="px-6 py-3 rounded-full gradient-gold text-deep-red font-bold text-sm tracking-wider shadow-gold hover:scale-105 transition-elegant inline-flex items-center gap-2"
          >
            <span>UPDATE RATES</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          <div className="bg-black/40 border border-gold/30 rounded-2xl p-5">
            <div className="text-xs text-gold/80 font-bold uppercase tracking-wider mb-1">22K Gold (Per Gram)</div>
            <div className="text-2xl font-extrabold text-ivory">{rates.gold22K}</div>
          </div>
          <div className="bg-black/40 border border-gold/30 rounded-2xl p-5">
            <div className="text-xs text-gold/80 font-bold uppercase tracking-wider mb-1">24K Gold (Per Gram)</div>
            <div className="text-2xl font-extrabold text-ivory">{rates.gold24K}</div>
          </div>
          <div className="bg-black/40 border border-gold/30 rounded-2xl p-5">
            <div className="text-xs text-gold/80 font-bold uppercase tracking-wider mb-1">Silver (Per Gram)</div>
            <div className="text-2xl font-extrabold text-ivory">{rates.silver}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
