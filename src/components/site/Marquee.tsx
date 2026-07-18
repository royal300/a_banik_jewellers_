import { useEffect, useState } from "react";
import { TrendingUp, Sparkles } from "lucide-react";

export function TopMarquee() {
  const [rates, setRates] = useState({
    gold22K: "₹ 7,285 / g",
    gold24K: "₹ 7,945 / g",
    silver: "₹ 96 / g",
    updated: "Today",
    announcement: "BIS Hallmarked Certified Jewellery ✨ Showroom Open Today: 10:30 AM - 9:00 PM",
  });

  useEffect(() => {
    async function loadRates() {
      try {
        const res = await fetch("/api/rates");
        const data = await res.json();
        if (data && typeof data === "object") {
          setRates((prev) => ({ ...prev, ...data }));
        }
      } catch (err) {
        console.error("Marquee rates error:", err);
      }
    }
    loadRates();
  }, []);

  const items = [
    `🔥 Today's Gold Rate (${rates.updated})`,
    `22K Gold: ${rates.gold22K}`,
    `24K Gold: ${rates.gold24K}`,
    `Silver: ${rates.silver}`,
    rates.announcement || "BIS Hallmarked · Certified Purity",
    "Custom Bridal Jewellery on Order",
  ];
  const loop = [...items, ...items];
  return (
    <div className="gradient-red text-white text-xs sm:text-sm border-b border-gold/40 overflow-hidden relative font-semibold">
      <div className="flex animate-marquee whitespace-nowrap py-2 min-w-max">
        {loop.map((t, i) => (
          <span key={i} className="mx-6 inline-flex items-center gap-2">
            <TrendingUp className="w-3.5 h-3.5 text-gold" />
            <span className="opacity-95">{t}</span>
            <span className="text-gold/70">|</span>
          </span>
        ))}
      </div>
    </div>
  );
}
