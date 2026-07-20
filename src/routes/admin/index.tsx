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
    <div className="space-y-6 animate-hero-fade">
      <div>
        <div className="text-red-600 text-xs font-bold tracking-[0.2em] uppercase mb-1 flex items-center gap-2">
          <Sparkles className="w-4 h-4" /> Welcome Back, Admin
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1 text-xs sm:text-sm">
          Manage your live showroom categories, jewellery products, promo banners, and metal rates right here.
        </p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/admin/categories"
          className="bg-white border border-gray-200/80 rounded-2xl p-5 hover:border-red-600 transition-all group flex flex-col justify-between shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 grid place-items-center">
              <Grid className="w-5 h-5 text-red-600" />
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-gray-900">{loading ? "-" : stats.categories}</div>
            <div className="text-[11px] font-bold tracking-wider text-gray-500 uppercase mt-0.5">Showroom Categories</div>
          </div>
        </Link>

        <Link
          to="/admin/products"
          className="bg-white border border-gray-200/80 rounded-2xl p-5 hover:border-red-600 transition-all group flex flex-col justify-between shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 grid place-items-center">
              <ShoppingBag className="w-5 h-5 text-red-600" />
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-gray-900">{loading ? "-" : stats.products}</div>
            <div className="text-[11px] font-bold tracking-wider text-gray-500 uppercase mt-0.5">Jewellery Products</div>
          </div>
        </Link>

        <Link
          to="/admin/media-manager"
          className="bg-white border border-gray-200/80 rounded-2xl p-5 hover:border-red-600 transition-all group flex flex-col justify-between shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 grid place-items-center">
              <ImageIcon className="w-5 h-5 text-red-600" />
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-gray-900">{loading ? "-" : stats.banners}</div>
            <div className="text-[11px] font-bold tracking-wider text-gray-500 uppercase mt-0.5">Active Banners & Media</div>
          </div>
        </Link>

        <Link
          to="/admin/rates"
          className="bg-white border border-gray-200/80 rounded-2xl p-5 hover:border-red-600 transition-all group flex flex-col justify-between shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 grid place-items-center">
              <TrendingUp className="w-5 h-5 text-red-600" />
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
          </div>
          <div>
            <div className="text-base font-bold text-gray-900 truncate">{rates.gold22K}</div>
            <div className="text-[11px] font-bold tracking-wider text-gray-500 uppercase mt-0.5">Live 22K Gold Rate</div>
          </div>
        </Link>
      </div>

      {/* Live Metal Rates Preview Box */}
      <div className="bg-white border border-gray-200/80 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-gray-100">
          <div>
            <div className="text-red-600 text-[11px] font-bold tracking-widest uppercase">Navbar Live Feed Status</div>
            <h2 className="text-lg sm:text-xl font-extrabold text-gray-900">Current Showroom Metal Rates</h2>
          </div>
          <Link
            to="/admin/rates"
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs tracking-wider shadow-sm transition-all inline-flex items-center gap-2"
          >
            <span>UPDATE RATES</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="bg-gray-50/80 border border-gray-200 rounded-xl p-4">
            <div className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-1">22K Gold (Per Gram)</div>
            <div className="text-xl font-extrabold text-gray-900">{rates.gold22K}</div>
          </div>
          <div className="bg-gray-50/80 border border-gray-200 rounded-xl p-4">
            <div className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-1">24K Gold (Per Gram)</div>
            <div className="text-xl font-extrabold text-gray-900">{rates.gold24K}</div>
          </div>
          <div className="bg-gray-50/80 border border-gray-200 rounded-xl p-4">
            <div className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-1">Silver (Per Gram)</div>
            <div className="text-xl font-extrabold text-gray-900">{rates.silver}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
