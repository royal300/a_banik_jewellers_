import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp, Check, Sparkles, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/admin/rates")({
  component: AdminRates,
});

function AdminRates() {
  const [form, setForm] = useState({
    rate_22k: "₹ 7,285 / g",
    rate_24k: "₹ 7,945 / g",
    rate_silver: "₹ 96 / g",
    last_updated: "Today",
    announcement: "Special festive discounts on diamond making charges!",
  });
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/rates");
        const data = await res.json();
        if (data) {
          setForm({
            rate_22k: data.gold22K || "₹ 7,285 / g",
            rate_24k: data.gold24K || "₹ 7,945 / g",
            rate_silver: data.silver || "₹ 96 / g",
            last_updated: data.updated || "Today",
            announcement: data.announcement || "",
          });
        }
      } catch (err) {
        console.error("Load rates error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(false);
    try {
      await fetch("/api/rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl animate-hero-fade">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Showroom Metal Rates & Ticker</h1>
        <p className="text-gray-600 mt-1 text-xs sm:text-sm">
          Update the gold and silver rates shown instantly across the navbar, top ticker, and live site banners.
        </p>
      </div>

      {msg && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3 text-emerald-800 text-xs sm:text-sm font-bold shadow-sm">
          <Check className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-700 text-xs sm:text-sm font-bold shadow-sm">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="grid sm:grid-cols-3 gap-5">
          <div>
            <label className="text-[11px] font-bold tracking-wider text-gray-700 uppercase block mb-1.5">22K Gold Rate *</label>
            <input
              type="text"
              required
              value={form.rate_gold_22k}
              onChange={(e) => setForm({ ...form, rate_gold_22k: e.target.value })}
              placeholder="e.g. ₹ 7,150 / g"
              className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-3 text-base sm:text-lg font-extrabold text-gray-900 focus:border-red-600 focus:ring-2 focus:ring-red-100 outline-none transition-all"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold tracking-wider text-gray-700 uppercase block mb-1.5">24K Gold Rate *</label>
            <input
              type="text"
              required
              value={form.rate_gold_24k}
              onChange={(e) => setForm({ ...form, rate_gold_24k: e.target.value })}
              placeholder="e.g. ₹ 7,800 / g"
              className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-3 text-base sm:text-lg font-extrabold text-gray-900 focus:border-red-600 focus:ring-2 focus:ring-red-100 outline-none transition-all"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold tracking-wider text-gray-700 uppercase block mb-1.5">Silver Rate *</label>
            <input
              type="text"
              required
              value={form.rate_silver}
              onChange={(e) => setForm({ ...form, rate_silver: e.target.value })}
              placeholder="e.g. ₹ 96 / g"
              className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-3 text-base sm:text-lg font-extrabold text-gray-900 focus:border-red-600 focus:ring-2 focus:ring-red-100 outline-none transition-all"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5 pt-2">
          <div>
            <label className="text-[11px] font-bold tracking-wider text-gray-700 uppercase block mb-1.5">Date / Last Updated Label</label>
            <input
              type="text"
              value={form.last_updated}
              onChange={(e) => setForm({ ...form, last_updated: e.target.value })}
              placeholder="e.g. Today or 18 July 2026"
              className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm font-bold text-gray-900 focus:border-red-600 focus:ring-2 focus:ring-red-100 outline-none transition-all"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold tracking-wider text-gray-700 uppercase block mb-1.5">Navbar Announcement Ticker (Optional)</label>
            <input
              type="text"
              value={form.announcement}
              onChange={(e) => setForm({ ...form, announcement: e.target.value })}
              placeholder="e.g. Special festive offers running all week!"
              className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm font-bold text-gray-900 focus:border-red-600 focus:ring-2 focus:ring-red-100 outline-none transition-all"
            />
          </div>
        </div>

        <div className="bg-red-50/70 border border-red-100 rounded-xl p-4 flex items-center gap-3 text-xs text-gray-700">
          <TrendingUp className="w-5 h-5 text-red-600 shrink-0" />
          <span>
            Tip: Keep rates updated daily so customers viewing <strong className="text-red-700">abanikjewellers.in</strong> see accurate gold & silver pricing before visiting your showroom.
          </span>
        </div>

        <div className="pt-4 flex justify-end border-t border-gray-100">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs tracking-wider shadow-sm transition-all flex items-center gap-2"
          >
            <Check className="w-4 h-4" /> UPDATE LIVE RATES
          </button>
        </div>
      </form>
    </div>
  );
}
