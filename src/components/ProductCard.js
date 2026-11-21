"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Star, ArrowRight, ShoppingBag, Sparkles } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

  const activeColor = product.colorways?.[selectedColorIndex] || {
    name: "Default",
    primaryHex: "#10b981",
    image: product.image
  };

  const currentImage = activeColor.image || product.image;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultSize = product.sizes?.[Math.floor(product.sizes.length / 2)] || 10;
    addItem(product, activeColor.name, defaultSize, 1);
  };

  return (
    <div className="group relative rounded-3xl bg-white border border-emerald-100 hover:border-emerald-400 transition-all duration-500 flex flex-col justify-between overflow-hidden shadow-lg shadow-emerald-950/5 hover:shadow-2xl hover:shadow-emerald-500/15">
      {/* Top Tag & Category */}
      <div className="p-6 pb-0 flex items-center justify-between z-10">
        <span className="text-[11px] font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800">
          {product.category}
        </span>
        <div className="flex items-center gap-1 text-xs text-amber-500 font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{product.rating}</span>
        </div>
      </div>

      {/* Visual Product Stage with Real Sneaker Imagery */}
      <Link
        href={`/product/${product.slug}`}
        className="px-6 py-6 flex flex-col items-center justify-center relative cursor-pointer"
      >
        {/* Soft emerald radial glow behind shoe */}
        <div className="w-52 h-52 rounded-full bg-emerald-100/60 blur-2xl absolute -z-0 transition-transform duration-500 group-hover:scale-125" />

        {/* Real High-Resolution Sneaker Image */}
        <div className="w-full h-52 flex items-center justify-center relative z-10 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentImage}
            alt={product.name}
            className="w-full h-full object-contain drop-shadow-[0_15px_20px_rgba(0,0,0,0.18)] group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500"
          />
        </div>

        {/* Colorway Switcher Dots */}
        <div
          className="flex items-center gap-2 pt-3 z-10"
          onClick={(e) => e.preventDefault()}
        >
          {product.colorways?.map((color, idx) => (
            <button
              key={color.name}
              onClick={(e) => {
                e.preventDefault();
                setSelectedColorIndex(idx);
              }}
              className={`w-4 h-4 rounded-full border transition-all ${
                selectedColorIndex === idx
                  ? "border-emerald-600 scale-125 shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                  : "border-gray-300 opacity-70 hover:opacity-100"
              }`}
              style={{ backgroundColor: color.primaryHex }}
              title={color.name}
            />
          ))}
        </div>
      </Link>

      {/* Info & Footer */}
      <div className="p-6 pt-2 border-t border-emerald-50 bg-[#fafdfb] space-y-3">
        <div>
          <h3 className="text-lg font-black text-gray-900 group-hover:text-emerald-700 transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-gray-500 line-clamp-1">{product.tagline}</p>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-xl font-black text-emerald-950 font-mono">
            ${product.basePrice}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleQuickAdd}
              className="p-2.5 rounded-xl bg-emerald-100 hover:bg-emerald-500 hover:text-white text-emerald-900 transition-all shadow-sm"
              title="Quick Add to Bag (Size 10)"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
            <Link
              href={`/product/${product.slug}`}
              className="p-2.5 rounded-xl bg-gray-100 hover:bg-emerald-700 hover:text-white text-gray-700 transition-all flex items-center justify-center shadow-sm"
              title="Explore 3D Customizer"
            >
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
