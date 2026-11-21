"use client";

import React, { useState, useMemo } from "react";
import ProductCard from "./ProductCard";
import { Search, SlidersHorizontal, Sparkles } from "lucide-react";

export default function ProductCatalog({ initialProducts = [] }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [maxPrice, setMaxPrice] = useState(300);

  const categories = ["All", "Running", "Lifestyle", "Basketball", "Training"];

  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter((p) => {
        const matchesCategory =
          selectedCategory === "All" || p.category.toLowerCase() === selectedCategory.toLowerCase();
        const matchesSearch =
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.tagline.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPrice = p.basePrice <= maxPrice;

        return matchesCategory && matchesSearch && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.basePrice - b.basePrice;
        if (sortBy === "price-high") return b.basePrice - a.basePrice;
        if (sortBy === "rating") return b.rating - a.rating;
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [initialProducts, selectedCategory, searchQuery, sortBy, maxPrice]);

  return (
    <section id="catalog" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Title & Filter Bar Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            The Arears Collection
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-emerald-950 tracking-tight uppercase">
            Signature Footwear Lineup
          </h2>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-emerald-700 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search sneaker models, tech..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-emerald-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 shadow-sm transition-colors"
          />
        </div>
      </div>

      {/* Filter Tabs & Sort Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-white border border-emerald-100 shadow-sm mb-10">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25"
                  : "bg-emerald-50 text-gray-700 hover:bg-emerald-100 hover:text-emerald-900 border border-emerald-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort & Price Filter */}
        <div className="flex items-center gap-4 text-xs text-gray-700 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-2 font-medium">
            <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600" />
            <span>Max Price: <strong className="text-emerald-950 font-bold">${maxPrice}</strong></span>
            <input
              type="range"
              min="150"
              max="300"
              step="10"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-20 accent-emerald-600 cursor-pointer"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-gray-800 font-semibold focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="featured">Featured First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Customer Rated</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 p-8 rounded-3xl bg-white border border-emerald-100 space-y-3 shadow-sm">
          <p className="text-gray-500 text-sm">No footwear matches your current search or filters.</p>
          <button
            onClick={() => {
              setSelectedCategory("All");
              setSearchQuery("");
              setMaxPrice(300);
            }}
            className="text-xs font-bold text-emerald-600 underline hover:text-emerald-800"
          >
            Reset all filters
          </button>
        </div>
      )}
    </section>
  );
}
