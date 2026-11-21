"use client";

import React, { useState, useMemo } from "react";
import { Activity, Gauge, Zap, Sparkles, Scale } from "lucide-react";
import { sounds } from "@/lib/audio";

export default function BiomechanicsLab() {
  const [runnerWeightLbs, setRunnerWeightLbs] = useState(165);
  const [cadenceSpm, setCadenceSpm] = useState(175);
  const [paceMinMile, setPaceMinMile] = useState(6.5);

  const metrics = useMemo(() => {
    const weightKg = runnerWeightLbs * 0.453592;
    const impactFactor = 2.4 + (10 - paceMinMile) * 0.12;
    const peakImpactNewtons = Math.round(weightKg * 9.81 * impactFactor);
    const energyStoredJoules = Math.round((peakImpactNewtons * 0.018) + (cadenceSpm * 0.15));
    const energyReturnedJoules = Math.round(energyStoredJoules * 0.82);
    const jointReliefPct = Math.min(18, Math.round(10 + (cadenceSpm - 160) * 0.25));

    return {
      peakImpactNewtons,
      energyStoredJoules,
      energyReturnedJoules,
      jointReliefPct
    };
  }, [runnerWeightLbs, cadenceSpm, paceMinMile]);

  const handleSliderChange = (setter, val) => {
    sounds.playClick();
    setter(val);
  };

  return (
    <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="rounded-3xl bg-white border border-emerald-200 p-8 sm:p-12 shadow-2xl shadow-emerald-950/5 relative overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-100/70 rounded-full blur-[100px] pointer-events-none" />

        {/* Header */}
        <div className="max-w-3xl space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-300 bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5 text-emerald-600" />
            <span>Interactive Biomechanics Simulation</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-emerald-950 uppercase tracking-tight">
            Kinetic Stride & Rebound Physics Lab
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Adjust your athlete profile parameters below to see how supercritical nitrogen ArearsFoam 
            and the 3K carbon shank dynamically absorb impact and return kinetic forward thrust.
          </p>
        </div>

        {/* Interactive Sliders & Live Physics Telemetry */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Sliders Column */}
          <div className="lg:col-span-6 space-y-6">
            {/* 1. Athlete Weight */}
            <div className="p-5 rounded-2xl bg-[#f4fbf7] border border-emerald-100 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-gray-700 uppercase flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-emerald-600" />
                  Athlete Weight
                </span>
                <span className="font-mono font-black text-emerald-800 text-sm">
                  {runnerWeightLbs} lbs ({Math.round(runnerWeightLbs * 0.45)} kg)
                </span>
              </div>
              <input
                type="range"
                min="110"
                max="230"
                step="5"
                value={runnerWeightLbs}
                onChange={(e) => handleSliderChange(setRunnerWeightLbs, Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* 2. Target Cadence */}
            <div className="p-5 rounded-2xl bg-[#f4fbf7] border border-emerald-100 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-gray-700 uppercase flex items-center gap-1.5">
                  <Gauge className="w-3.5 h-3.5 text-emerald-600" />
                  Step Cadence
                </span>
                <span className="font-mono font-black text-emerald-800 text-sm">
                  {cadenceSpm} SPM
                </span>
              </div>
              <input
                type="range"
                min="150"
                max="195"
                step="1"
                value={cadenceSpm}
                onChange={(e) => handleSliderChange(setCadenceSpm, Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* 3. Pace Target */}
            <div className="p-5 rounded-2xl bg-[#f4fbf7] border border-emerald-100 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-gray-700 uppercase flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-emerald-600" />
                  Velocity Pace
                </span>
                <span className="font-mono font-black text-emerald-800 text-sm">
                  {Math.floor(paceMinMile)}:{(paceMinMile % 1 * 60).toFixed(0).padStart(2, "0")} / mile
                </span>
              </div>
              <input
                type="range"
                min="4.5"
                max="9.5"
                step="0.25"
                value={paceMinMile}
                onChange={(e) => handleSliderChange(setPaceMinMile, Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Real-Time Telemetry Dashboard Column */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="p-6 rounded-3xl bg-[#f4fbf7] border border-emerald-200 space-y-2 shadow-sm">
              <span className="text-[11px] font-bold text-gray-500 uppercase">
                Peak Ground Force
              </span>
              <div className="text-3xl font-black font-mono text-emerald-950">
                {metrics.peakImpactNewtons} <span className="text-sm font-normal text-emerald-700">N</span>
              </div>
              <div className="text-xs text-gray-600">Dispersed via air bubble chambers</div>
            </div>

            <div className="p-6 rounded-3xl bg-[#f4fbf7] border border-emerald-200 space-y-2 shadow-sm">
              <span className="text-[11px] font-bold text-gray-500 uppercase">
                Kinetic Energy Return
              </span>
              <div className="text-3xl font-black font-mono text-emerald-600">
                {metrics.energyReturnedJoules} <span className="text-sm font-normal">Joules</span>
              </div>
              <div className="text-xs text-emerald-700 font-bold">82% Supercritical Rebound</div>
            </div>

            <div className="p-6 rounded-3xl bg-[#f4fbf7] border border-emerald-200 space-y-2 shadow-sm">
              <span className="text-[11px] font-bold text-gray-500 uppercase">
                Ankle Torque Relief
              </span>
              <div className="text-3xl font-black font-mono text-green-700">
                -{metrics.jointReliefPct}%
              </div>
              <div className="text-xs text-gray-600">Via tuned 3K carbon plate flex</div>
            </div>

            <div className="p-6 rounded-3xl bg-emerald-600 text-white space-y-2 shadow-xl shadow-emerald-600/20">
              <span className="text-[11px] font-bold text-emerald-100 uppercase flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Arears Recommendation
              </span>
              <div className="text-lg font-black tracking-tight">Arears Quantum-1</div>
              <div className="text-xs text-emerald-100 leading-tight">
                Optimal stiffness index for {runnerWeightLbs} lbs runners under {paceMinMile} min pace.
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
