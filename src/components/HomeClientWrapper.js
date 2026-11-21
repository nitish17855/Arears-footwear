"use client";

import React, { useState } from "react";
import HeroSection from "@/components/HeroSection";
import MarqueeTicker from "@/components/MarqueeTicker";
import ScrollStory from "@/components/ScrollStory";
import BiomechanicsLab from "@/components/BiomechanicsLab";
import ProductCatalog from "@/components/ProductCatalog";
import ShoeComparisonModal from "@/components/ShoeComparisonModal";
import SizeFitAdvisor from "@/components/SizeFitAdvisor";
import { Zap, ShieldCheck, RefreshCw, Award, Layers, Ruler } from "lucide-react";
import { sounds } from "@/lib/audio";

export default function HomeClientWrapper({ products = [] }) {
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);

  const featuredProduct = products.find((p) => p.isFeatured) || products[0];

  const openCompare = () => {
    sounds.playClick();
    setIsCompareOpen(true);
  };

  const openAdvisor = () => {
    sounds.playClick();
    setIsAdvisorOpen(true);
  };

  return (
    <div className="space-y-12">
      {/* 3D WebGL Studio Hero Section */}
      <HeroSection featuredProduct={featuredProduct} />

      {/* Infinite Kinetic Tech Ticker */}
      <MarqueeTicker />

      {/* Trust & Performance Badges Banner */}
      <section className="border-y border-emerald-100 bg-white/70 py-8 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-sm">
              <Zap className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Nitrogen ArearsFoam
            </span>
            <span className="text-[11px] text-gray-500">Supercritical cell matrix</span>
          </div>

          <div className="flex flex-col items-center gap-1.5">
            <div className="w-10 h-10 rounded-2xl bg-green-100 border border-green-200 flex items-center justify-center text-green-700 shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              3K Carbon Chassis
            </span>
            <span className="text-[11px] text-gray-500">Tuned catapult leverage</span>
          </div>

          <div className="flex flex-col items-center gap-1.5">
            <div className="w-10 h-10 rounded-2xl bg-teal-100 border border-teal-200 flex items-center justify-center text-teal-700 shadow-sm">
              <RefreshCw className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Zero-Friction Return
            </span>
            <span className="text-[11px] text-gray-500">30-day wear trial</span>
          </div>

          <div className="flex flex-col items-center gap-1.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-sm">
              <Award className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Global Express
            </span>
            <span className="text-[11px] text-gray-500">Complimentary over $150</span>
          </div>
        </div>
      </section>

      {/* Floating Quick Action Interactive Floating Dock */}
      <div className="fixed bottom-6 right-6 z-30 flex items-center gap-2">
        <button
          onClick={openCompare}
          className="px-4 py-2.5 rounded-full bg-white/95 border border-emerald-200 text-emerald-900 font-bold text-xs shadow-xl backdrop-blur-md flex items-center gap-2 hover:bg-emerald-50 hover:border-emerald-400 transition-all hover:scale-105"
        >
          <Layers className="w-4 h-4 text-emerald-600" />
          <span>Compare Shoes</span>
        </button>
        <button
          onClick={openAdvisor}
          className="px-4 py-2.5 rounded-full bg-emerald-600 text-white font-bold text-xs shadow-xl flex items-center gap-2 hover:bg-emerald-500 transition-all hover:scale-105"
        >
          <Ruler className="w-4 h-4" />
          <span>Fit Advisor</span>
        </button>
      </div>

      {/* Apple/Nike Style Scroll Storytelling */}
      <ScrollStory />

      {/* Interactive Biomechanics & Kinetic Stride Physics Lab */}
      <div id="biomechanics">
        <BiomechanicsLab />
      </div>

      {/* Signature Footwear Catalog */}
      <ProductCatalog initialProducts={products} />

      {/* Comparison Modal */}
      <ShoeComparisonModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        allProducts={products}
      />

      {/* Size Fit Advisor Modal */}
      <SizeFitAdvisor
        isOpen={isAdvisorOpen}
        onClose={() => setIsAdvisorOpen(false)}
      />
    </div>
  );
}
