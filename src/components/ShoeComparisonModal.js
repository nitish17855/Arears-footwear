"use client";

import React, { useState } from "react";
import { X, Layers, Scale, Zap, Shield } from "lucide-react";
import { sounds } from "@/lib/audio";
import { useCart } from "@/context/CartContext";

export default function ShoeComparisonModal({ isOpen, onClose, allProducts = [] }) {
  const { addItem } = useCart();
  const [shoeAId, setShoeAId] = useState(allProducts[0]?.id || "");
  const [shoeBId, setShoeBId] = useState(allProducts[1]?.id || "");

  if (!isOpen) return null;

  const shoeA = allProducts.find((p) => p.id === shoeAId) || allProducts[0];
  const shoeB = allProducts.find((p) => p.id === shoeBId) || allProducts[1];

  const handleSelectA = (id) => {
    sounds.playClick();
    setShoeAId(id);
  };

  const handleSelectB = (id) => {
    sounds.playClick();
    setShoeBId(id);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-emerald-950/50 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-10 shadow-2xl border border-emerald-100 space-y-8 animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-emerald-100">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                Footwear Matrix
              </span>
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
                Dual Sneaker Biomechanical Comparison
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-900 hover:bg-emerald-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Selectors & Visual Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Shoe A Column */}
            <div className="p-6 rounded-3xl bg-[#f4fbf7] border border-emerald-100 space-y-4">
              <label className="block text-xs font-bold text-gray-500 uppercase">
                Primary Model
              </label>
              <select
                value={shoeA?.id}
                onChange={(e) => handleSelectA(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-emerald-200 bg-white text-sm font-bold text-gray-900 focus:outline-none focus:border-emerald-500"
              >
                {allProducts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (${p.basePrice})
                  </option>
                ))}
              </select>

              <div className="h-44 flex items-center justify-center overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={shoeA?.image}
                  alt={shoeA?.name}
                  className="max-h-full object-contain drop-shadow-md"
                />
              </div>

              <div className="text-center">
                <div className="text-xl font-black text-gray-900">{shoeA?.name}</div>
                <div className="text-xs text-emerald-700 font-semibold">{shoeA?.category}</div>
                <div className="text-lg font-black font-mono text-emerald-900 mt-1">
                  ${shoeA?.basePrice}
                </div>
              </div>
            </div>

            {/* Shoe B Column */}
            <div className="p-6 rounded-3xl bg-[#f4fbf7] border border-emerald-100 space-y-4">
              <label className="block text-xs font-bold text-gray-500 uppercase">
                Comparison Model
              </label>
              <select
                value={shoeB?.id}
                onChange={(e) => handleSelectB(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-emerald-200 bg-white text-sm font-bold text-gray-900 focus:outline-none focus:border-emerald-500"
              >
                {allProducts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (${p.basePrice})
                  </option>
                ))}
              </select>

              <div className="h-44 flex items-center justify-center overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={shoeB?.image}
                  alt={shoeB?.name}
                  className="max-h-full object-contain drop-shadow-md"
                />
              </div>

              <div className="text-center">
                <div className="text-xl font-black text-gray-900">{shoeB?.name}</div>
                <div className="text-xs text-emerald-700 font-semibold">{shoeB?.category}</div>
                <div className="text-lg font-black font-mono text-emerald-900 mt-1">
                  ${shoeB?.basePrice}
                </div>
              </div>
            </div>
          </div>

          {/* Technical Specs Comparison Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-emerald-50 text-emerald-900 font-bold uppercase font-mono border-b border-emerald-100">
                <tr>
                  <th className="p-3.5">Engineering Parameter</th>
                  <th className="p-3.5">{shoeA?.name}</th>
                  <th className="p-3.5">{shoeB?.name}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-100 text-gray-700">
                <tr>
                  <td className="p-3.5 font-bold text-gray-900 flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-emerald-600" /> Total Shoe Weight
                  </td>
                  <td className="p-3.5 font-mono font-bold">{shoeA?.specs?.weight || "215g"}</td>
                  <td className="p-3.5 font-mono font-bold">{shoeB?.specs?.weight || "260g"}</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-gray-900 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-emerald-600" /> Midsole Foam Core
                  </td>
                  <td className="p-3.5">{shoeA?.specs?.midsole || "Nitrogen ArearsFoam"}</td>
                  <td className="p-3.5">{shoeB?.specs?.midsole || "ArearsGel Dynamic"}</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-gray-900 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-emerald-600" /> Propulsion Plate
                  </td>
                  <td className="p-3.5">{shoeA?.specs?.plate || "3K Dual Carbon Shank"}</td>
                  <td className="p-3.5">{shoeB?.specs?.plate || "TPU Lateral Wings"}</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-gray-900 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-emerald-600" /> Heel-To-Toe Drop
                  </td>
                  <td className="p-3.5 font-mono">{shoeA?.specs?.heelDrop || "8mm"}</td>
                  <td className="p-3.5 font-mono">{shoeB?.specs?.heelDrop || "10mm"}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-emerald-100">
            <button
              onClick={() => {
                addItem(shoeA, shoeA.colorways?.[0]?.name || "Standard", 10, 1);
                onClose();
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20"
            >
              Add {shoeA?.name} to Bag
            </button>
            <button
              onClick={() => {
                addItem(shoeB, shoeB.colorways?.[0]?.name || "Standard", 10, 1);
                onClose();
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl border border-emerald-200 hover:bg-emerald-50 text-emerald-900 font-bold text-xs"
            >
              Add {shoeB?.name} to Bag
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
