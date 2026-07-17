import { TrendingUp } from "lucide-react";
import { metalRates } from "@/lib/site-config";

export function TopMarquee() {
  const items = [
    `Today's Gold Rate (${metalRates.updated})`,
    `22K Gold ${metalRates.gold22K}`,
    `24K Gold ${metalRates.gold24K}`,
    `Silver ${metalRates.silver}`,
    "BIS Hallmarked · Certified Purity",
    "Custom Bridal Jewellery on Order",
  ];
  const loop = [...items, ...items];
  return (
    <div className="gradient-red text-white text-xs sm:text-sm border-b border-gold/40 overflow-hidden relative">
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
