"use client";

import React, { useState } from "react";
import { X, Check, Sparkles, Ruler } from "lucide-react";
import { sounds } from "@/lib/audio";

export default function SizeFitAdvisor({ isOpen, onClose }) {
  const [footLengthCm, setFootLengthCm] = useState(27.0);
  const [archType, setArchType] = useState("neutral");
  const [fitPreference, setFitPreference] = useState("snug");

  if (!isOpen) return null;

  const recommendedSize = (() => {
    let base = (footLengthCm - 17.5) * 1.25;
    if (fitPreference === "snug") base -= 0.25;
    if (fitPreference === "relaxed") base += 0.5;
    return (Math.round(base * 2) / 2).toFixed(1);
  })();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-emerald-950/50 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-emerald-100 space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-emerald-100">
            <div className="flex items-center gap-2">
              <Ruler className="w-5 h-5 text-emerald-600" />
              <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">
                Arears Sizing & Arch Advisor
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-900 hover:bg-emerald-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-gray-700 uppercase">Foot Length (Heel to Toe)</span>
                <span className="font-mono font-black text-emerald-800 text-sm">
                  {footLengthCm} cm ({(footLengthCm / 2.54).toFixed(1)} inches)
                </span>
              </div>
              <input
                type="range"
                min="24.0"
                max="31.0"
                step="0.5"
                value={footLengthCm}
                onChange={(e) => {
                  sounds.playClick();
                  setFootLengthCm(Number(e.target.value));
                }}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700 uppercase">
                Arch Profile
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["flat", "neutral", "high"].map((arch) => (
                  <button
                    key={arch}
                    onClick={() => {
                      sounds.playClick();
                      setArchType(arch);
                    }}
                    className={`py-2 rounded-xl text-xs font-bold capitalize transition-all border ${
                      archType === arch
                        ? "bg-emerald-600 border-emerald-600 text-white shadow-sm"
                        : "bg-emerald-50 border-emerald-100 text-gray-700 hover:bg-emerald-100"
                    }`}
                  >
                    {arch} Arch
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700 uppercase">
                Lockdown Feel
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "snug", label: "Race Tight" },
                  { id: "standard", label: "True to Fit" },
                  { id: "relaxed", label: "Wide Toe Box" }
                ].map((fit) => (
                  <button
                    key={fit.id}
                    onClick={() => {
                      sounds.playClick();
                      setFitPreference(fit.id);
                    }}
                    className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                      fitPreference === fit.id
                        ? "bg-emerald-600 border-emerald-600 text-white shadow-sm"
                        : "bg-emerald-50 border-emerald-100 text-gray-700 hover:bg-emerald-100"
                    }`}
                  >
                    {fit.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
              <span className="text-xs font-bold text-emerald-800 uppercase flex items-center justify-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Recommended US Size
              </span>
              <div className="text-4xl font-black font-mono text-emerald-950">
                US {recommendedSize}
              </div>
              <p className="text-xs text-gray-600">
                Engineered for {archType} arches with 30-day zero-risk trial wear guarantee.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playSuccess();
              onClose();
            }}
            className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
          >
            <span>Apply Size Recommendation</span>
            <Check className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      </div>
    </div>
  );
}
