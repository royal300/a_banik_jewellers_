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
    <div className="space-y-8 animate-hero-fade max-w-4xl">
      <div>
        <div className="text-gold text-xs font-bold tracking-[0.3em] uppercase mb-1 flex items-center gap-2">
          <Sparkles className="w-4 h-4" /> Live Market Pricing
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-ivory">Showroom Metal Rates</h1>
        <p className="text-ivory/70 mt-1 text-sm sm:text-base">
          Update today's gold and silver rates. These prices are instantly showcased at the top of the navigation bar across the live website.
        </p>
      </div>

      {saved && (
        <div className="bg-emerald-900/40 border border-emerald-500/60 rounded-2xl p-4 flex items-center gap-3 text-emerald-200 text-sm animate-hero-fade">
          <Check className="w-5 h-5 shrink-0 text-emerald-400" />
          <span className="font-bold">✅ Metal rates updated successfully! Live navbar pricing is now synchronized.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-[oklch(0.22_0.04_25)] border-2 border-gold/40 rounded-3xl p-6 sm:p-10 shadow-gold space-y-6">
        <div className="grid sm:grid-cols-3 gap-6">
          <div>
            <label className="text-xs font-bold tracking-widest text-gold uppercase block mb-2">22K Gold Rate *</label>
            <input
              type="text"
              required
              value={form.rate_22k}
              onChange={(e) => setForm({ ...form, rate_22k: e.target.value })}
              placeholder="e.g. ₹ 7,285 / g"
              className="w-full bg-black/40 border border-gold/30 rounded-xl px-4 py-3.5 text-lg font-extrabold text-ivory focus:border-gold outline-none transition-elegant"
            />
          </div>

          <div>
            <label className="text-xs font-bold tracking-widest text-gold uppercase block mb-2">24K Gold Rate *</label>
            <input
              type="text"
              required
              value={form.rate_24k}
              onChange={(e) => setForm({ ...form, rate_24k: e.target.value })}
              placeholder="e.g. ₹ 7,945 / g"
              className="w-full bg-black/40 border border-gold/30 rounded-xl px-4 py-3.5 text-lg font-extrabold text-ivory focus:border-gold outline-none transition-elegant"
            />
          </div>

          <div>
            <label className="text-xs font-bold tracking-widest text-gold uppercase block mb-2">Silver Rate *</label>
            <input
              type="text"
              required
              value={form.rate_silver}
              onChange={(e) => setForm({ ...form, rate_silver: e.target.value })}
              placeholder="e.g. ₹ 96 / g"
              className="w-full bg-black/40 border border-gold/30 rounded-xl px-4 py-3.5 text-lg font-extrabold text-ivory focus:border-gold outline-none transition-elegant"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 pt-2">
          <div>
            <label className="text-xs font-bold tracking-widest text-gold uppercase block mb-2">Date / Last Updated Label</label>
            <input
              type="text"
              value={form.last_updated}
              onChange={(e) => setForm({ ...form, last_updated: e.target.value })}
              placeholder="e.g. Today or 18 July 2026"
              className="w-full bg-black/40 border border-gold/30 rounded-xl px-4 py-3.5 text-sm font-bold text-ivory focus:border-gold outline-none transition-elegant"
            />
          </div>

          <div>
            <label className="text-xs font-bold tracking-widest text-gold uppercase block mb-2">Navbar Announcement Ticker (Optional)</label>
            <input
              type="text"
              value={form.announcement}
              onChange={(e) => setForm({ ...form, announcement: e.target.value })}
              placeholder="e.g. Special festive offers running all week!"
              className="w-full bg-black/40 border border-gold/30 rounded-xl px-4 py-3.5 text-sm font-bold text-ivory focus:border-gold outline-none transition-elegant"
            />
          </div>
        </div>

        <div className="bg-black/30 border border-gold/20 rounded-2xl p-4 flex items-center gap-3 text-xs text-ivory/70">
          <TrendingUp className="w-5 h-5 text-gold shrink-0" />
          <span>
            Tip: Keep rates updated daily so customers viewing <strong className="text-gold">abanikjewellers.in</strong> see accurate gold & silver pricing before visiting your showroom.
          </span>
        </div>

        <div className="pt-4 flex justify-end border-t border-gold/20">
          <button
            type="submit"
            disabled={loading}
            className="px-10 py-4 rounded-full gradient-gold text-deep-red font-extrabold text-sm tracking-wider shadow-gold hover:scale-105 transition-elegant flex items-center gap-2"
          >
            <Check className="w-5 h-5" /> UPDATE LIVE RATES
          </button>
        </div>
      </form>
    </div>
  );
}
