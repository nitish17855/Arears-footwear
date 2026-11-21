import React from "react";
import { Sparkles, Zap, Shield, RefreshCw } from "lucide-react";

export default function MarqueeTicker() {
  const items = [
    { label: "SUPERCRITICAL NITROGEN AREARS-FOAM", icon: Zap },
    { label: "82% REBOUND MECHANICAL RETURN", icon: Sparkles },
    { label: "FULL-LENGTH 3K DUAL CARBON CATAPULT", icon: Shield },
    { label: "ZERO-WASTE AEROKNIT PRECISION JACQUARD", icon: RefreshCw },
    { label: "BIOMECHANICALLY CALIBRATED AT ATHLETIC LABS", icon: Sparkles },
    { label: "FREE GLOBAL COURIER DISPATCH OVER $150", icon: Zap }
  ];

  return (
    <div className="relative w-full overflow-hidden border-y border-emerald-200/60 bg-[#edf8f1]/80 py-3.5 select-none">
      <div className="flex w-max animate-marquee space-x-10 text-xs font-black tracking-widest text-emerald-950 uppercase font-mono">
        {[...items, ...items, ...items].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-center gap-2.5">
              <Icon className="w-3.5 h-3.5 text-emerald-600" />
              <span>{item.label}</span>
              <span className="text-emerald-400">✦</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
