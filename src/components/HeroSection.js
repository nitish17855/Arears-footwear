"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, ShoppingBag, Sparkles, Cpu, Activity } from "lucide-react";
import Sneaker3DViewer from "./Sneaker3DViewer";
import { useCart } from "@/context/CartContext";

export default function HeroSection({ featuredProduct }) {
  const { addItem } = useCart();
  const colorways = featuredProduct?.colorways || [
    {
      name: "Crimson Blaze",
      primaryHex: "#dc2626",
      secondaryHex: "#10b981",
      accentHex: "#ffffff",
      soleHex: "#ffffff"
    },
    {
      name: "Cyber Mint",
      primaryHex: "#10b981",
      secondaryHex: "#065f46",
      accentHex: "#34d399",
      soleHex: "#f0fdf4"
    },
    {
      name: "Volt Pulse",
      primaryHex: "#84cc16",
      secondaryHex: "#1e293b",
      accentHex: "#ffffff",
      soleHex: "#0f172a"
    },
    {
      name: "Stealth Onyx",
      primaryHex: "#1e293b",
      secondaryHex: "#10b981",
      accentHex: "#94a3b8",
      soleHex: "#0f172a"
    }
  ];

  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const activeColorway = colorways[selectedColorIndex];

  const handleQuickAdd = () => {
    if (featuredProduct) {
      addItem(featuredProduct, activeColorway.name, 10, 1);
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-8 pb-16 overflow-hidden">
      {/* Light Green Ambient Glows */}
      <div className="absolute top-1/4 -left-36 w-96 h-96 bg-emerald-200/50 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 -right-36 w-96 h-96 bg-green-200/40 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Flashy Headline & Narrative */}
          <div className="lg:col-span-5 space-y-6 z-10 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-300 bg-emerald-100 text-emerald-900 text-xs font-bold tracking-wider uppercase shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              <span>Next-Gen Propulsion Series</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.05] text-emerald-950 uppercase">
              KINETIC <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-green-500">
                VELOCITY
              </span>
              <br />
              UNBOUND.
            </h1>

            <p className="text-base sm:text-lg text-gray-700 font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
              Meet the <strong>Arears Quantum-1</strong>. Engineered with supercritical nitrogen-infused 
              ArearsFoam and an anatomical 3K carbon propulsion shank. Rotatable in real-time 3D space below.
            </p>

            {/* Interactive Colorway Selector */}
            <div className="space-y-2.5 pt-2">
              <div className="text-xs font-bold uppercase tracking-wider text-gray-600">
                Select Colorway: <span className="text-emerald-900 font-black">{activeColorway.name}</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-3">
                {colorways.map((c, i) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColorIndex(i)}
                    className={`relative p-1 rounded-full transition-all duration-300 ${
                      selectedColorIndex === i
                        ? "ring-2 ring-emerald-500 scale-110 shadow-md shadow-emerald-500/30"
                        : "opacity-70 hover:opacity-100 hover:scale-105"
                    }`}
                    title={c.name}
                  >
                    <div
                      className="w-7 h-7 rounded-full border border-gray-300 shadow-inner"
                      style={{ backgroundColor: c.primaryHex }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                onClick={handleQuickAdd}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add To Bag • ${featuredProduct?.basePrice || 220}</span>
              </button>

              <Link
                href={`/product/${featuredProduct?.slug || "arears-quantum-one"}`}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl border border-emerald-200 bg-white hover:bg-emerald-50 text-emerald-900 font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <span>3D Customizer & Specs</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Live Metrics Row */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-emerald-100">
              <div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-950 font-mono">82%</div>
                <div className="text-xs text-gray-600 font-semibold">Energy Return</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono">215g</div>
                <div className="text-xs text-gray-600 font-semibold">Ultralight Chassis</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-green-700 font-mono">3K</div>
                <div className="text-xs text-gray-600 font-semibold">Carbon Fiber Plate</div>
              </div>
            </div>
          </div>

          {/* Right Column: Real 3D Interactive WebGL Stage */}
          <div className="lg:col-span-7 relative">
            <div className="relative z-10">
              <Sneaker3DViewer colorway={activeColorway} height="560px" interactive={true} />
            </div>

            {/* Floating Spec Badges */}
            <div className="hidden sm:flex items-center gap-3 absolute -bottom-6 left-8 z-20 px-4 py-2.5 rounded-2xl bg-white border border-emerald-200 text-xs font-semibold text-emerald-900 shadow-xl">
              <Cpu className="w-4 h-4 text-emerald-600" />
              <span>Real 3D GLTF Footwear Engine</span>
            </div>

            <div className="hidden sm:flex items-center gap-3 absolute -top-4 right-8 z-20 px-4 py-2.5 rounded-2xl bg-white border border-emerald-200 text-xs font-semibold text-emerald-900 shadow-xl">
              <Activity className="w-4 h-4 text-emerald-600" />
              <span>Biomechanical Telemetry Tested</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
