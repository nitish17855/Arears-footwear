"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Star, ArrowLeft, Check, ShoppingBag, Truck, RefreshCw } from "lucide-react";
import Sneaker3DViewer from "@/components/Sneaker3DViewer";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/context/CartContext";

export default function ProductDetailClient({ product, relatedProducts = [] }) {
  const { addItem } = useCart();
  const colorways = product.colorways || [];
  const sizes = product.sizes || [];

  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState(sizes[Math.floor(sizes.length / 2)] || 10);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("specs");
  const [addedToast, setAddedToast] = useState(false);

  const activeColor = colorways[selectedColorIdx] || {
    name: "Standard",
    primaryHex: "#10b981",
    image: product.image
  };

  const currentVariant = product.variants?.find(
    (v) =>
      v.colorName.toLowerCase() === activeColor.name.toLowerCase() &&
      Math.abs(v.size - selectedSize) < 0.1
  );

  const stock = currentVariant ? currentVariant.stockQuantity : 12;

  const handleAddToCart = () => {
    addItem(product, activeColor.name, selectedSize, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Back button */}
      <Link
        href="/#catalog"
        className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-emerald-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Collection</span>
      </Link>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Real 3D WebGL Canvas */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative">
            <Sneaker3DViewer colorway={activeColor} height="580px" interactive={true} />
            {addedToast && (
              <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 px-5 py-2.5 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center gap-2 shadow-xl animate-in fade-in slide-in-from-top-4">
                <Check className="w-4 h-4 stroke-[3]" />
                Added {quantity} pair to your bag!
              </div>
            )}
          </div>
          <div className="text-center text-xs text-gray-500 font-mono">
            * Drag to rotate 360°, inspect textures and carbon fiber shank in real-time 3D space.
          </div>
        </div>

        {/* Product Config Column */}
        <div className="lg:col-span-5 space-y-8 bg-white p-8 rounded-3xl border border-emerald-100 shadow-xl shadow-emerald-950/5">
          {/* Header & Badges */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800">
                {product.category} Series
              </span>
              <div className="flex items-center gap-1.5 text-xs text-amber-500 font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{product.rating}</span>
                <span className="text-gray-500 font-normal">({product.reviewsCount} reviews)</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-emerald-950 uppercase tracking-tight">
              {product.name}
            </h1>
            <p className="text-sm text-emerald-700 font-semibold">{product.tagline}</p>
            <div className="text-2xl font-black text-gray-900 font-mono pt-1">
              ${product.basePrice} <span className="text-xs font-normal text-gray-500">USD</span>
            </div>
          </div>

          {/* Colorway Selection */}
          <div className="space-y-3 pt-2 border-t border-emerald-100">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500 uppercase font-bold">Colorway</span>
              <span className="text-gray-900 font-black">{activeColor.name}</span>
            </div>
            <div className="flex items-center gap-3">
              {colorways.map((c, i) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColorIdx(i)}
                  className={`p-1 rounded-full border transition-all ${
                    selectedColorIdx === i
                      ? "border-emerald-600 scale-110 shadow-md shadow-emerald-500/40"
                      : "border-gray-300 opacity-70 hover:opacity-100"
                  }`}
                  title={c.name}
                >
                  <div
                    className="w-7 h-7 rounded-full border border-gray-200 shadow-inner"
                    style={{ backgroundColor: c.primaryHex }}
                  />
                </button>
              ))}
            </div>
            {activeColor.description && (
              <p className="text-xs text-gray-600 italic">{activeColor.description}</p>
            )}
          </div>

          {/* Size Picker */}
          <div className="space-y-3 pt-2 border-t border-emerald-100">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500 uppercase font-bold">Select US Size</span>
              <span className="text-xs text-emerald-700 font-medium">True athletic sizing</span>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {sizes.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                    selectedSize === sz
                      ? "bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-600/20"
                      : "bg-emerald-50/50 border-emerald-100 text-gray-700 hover:border-emerald-300"
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>

            {/* Inventory Stock Indicator */}
            <div className="text-xs flex items-center gap-1.5 pt-1">
              <span
                className={`w-2 h-2 rounded-full ${
                  stock <= 5 ? "bg-amber-500 animate-pulse" : "bg-emerald-500"
                }`}
              />
              <span className="text-gray-600 font-medium">
                {stock <= 5
                  ? `Only ${stock} pairs remaining in Size ${selectedSize}!`
                  : `In Stock (${stock} available for express courier)`}
              </span>
            </div>
          </div>

          {/* Quantity & Add to Cart */}
          <div className="space-y-4 pt-2 border-t border-emerald-100">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-emerald-200 rounded-xl bg-emerald-50/50 px-2 py-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-gray-600 hover:text-black font-bold"
                >
                  -
                </button>
                <span className="px-3 py-2 text-sm font-bold text-gray-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-gray-600 hover:text-black font-bold"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={stock === 0}
                className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 disabled:opacity-50 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Bag • ${(product.basePrice * quantity).toFixed(2)}</span>
              </button>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-gray-600">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-100">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span>Complimentary Express</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-100">
                <RefreshCw className="w-4 h-4 text-emerald-600" />
                <span>30-Day Wear Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Specifications & Customer Reviews */}
      <div className="bg-white rounded-3xl border border-emerald-100 p-8 space-y-8 shadow-sm">
        <div className="flex gap-4 border-b border-emerald-100 pb-4">
          <button
            onClick={() => setActiveTab("specs")}
            className={`pb-2 text-sm font-bold tracking-wider uppercase transition-colors relative ${
              activeTab === "specs" ? "text-emerald-800" : "text-gray-400 hover:text-gray-700"
            }`}
          >
            Engineering Blueprint
            {activeTab === "specs" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`pb-2 text-sm font-bold tracking-wider uppercase transition-colors relative ${
              activeTab === "reviews" ? "text-emerald-800" : "text-gray-400 hover:text-gray-700"
            }`}
          >
            Biomechanical Feedback ({product.reviewsCount})
            {activeTab === "reviews" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600" />
            )}
          </button>
        </div>

        {activeTab === "specs" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {product.specs &&
              Object.entries(product.specs).map(([key, value]) => (
                <div key={key} className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-1">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-700 font-bold">
                    {key.replace(/([A-Z])/g, " $1")}
                  </span>
                  <p className="text-sm font-semibold text-gray-900">{value}</p>
                </div>
              ))}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex items-center justify-between">
              <div>
                <div className="text-3xl font-black text-emerald-950">{product.rating} / 5.0</div>
                <div className="text-xs text-gray-600">Based on 128 verified athlete reviews</div>
              </div>
              <div className="flex gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400" />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-emerald-100 bg-[#fafdfb] space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-gray-900">Marcus Sterling — Marathon Competitor</span>
                  <span className="text-gray-500">2 days ago</span>
                </div>
                <p className="text-xs text-gray-700">
                  "The energy return off the forefoot carbon plate is unlike any conventional super-shoe. The 3D viewer accurately reflected the shoe textures and finish."
                </p>
              </div>

              <div className="p-4 rounded-xl border border-emerald-100 bg-[#fafdfb] space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-gray-900">Dr. Sarah Chen — Sports Podiatrist</span>
                  <span className="text-gray-500">1 week ago</span>
                </div>
                <p className="text-xs text-gray-700">
                  "Exceptional torsional stability. The lateral TPU wings prevent eversion fatigue during high-mileage blocks."
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Related Products Recommendation */}
      {relatedProducts.length > 0 && (
        <div className="space-y-8 pt-8">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-emerald-950 uppercase tracking-tight">
              Recommended In The Arears Line
            </h3>
            <Link href="/#catalog" className="text-xs font-bold text-emerald-700 hover:underline">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
