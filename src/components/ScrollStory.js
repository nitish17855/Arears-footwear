"use client";

import React from "react";
import { motion } from "framer-motion";
import { Zap, Shield, Wind, Layers } from "lucide-react";

export default function ScrollStory() {
  const stories = [
    {
      id: "01",
      title: "Supercritical Nitrogen ArearsFoam v3",
      category: "CUSHIONING ARCHITECTURE",
      subtitle: "82% Mechanical Energy Return",
      description:
        "Standard EVA foams fatigue over race distances. ArearsFoam is injected with supercritical nitrogen, creating an elastic micro-cellular lattice that rebounds instantaneously with zero mechanical pack-down.",
      stat: "82%",
      statLabel: "Rebound Efficiency",
      icon: Zap,
      accentColor: "#10b981",
      bgClass: "bg-emerald-50",
      borderClass: "border-emerald-200"
    },
    {
      id: "02",
      title: "Full-Length 3K Carbon Propulsion Plate",
      category: "BIOMECHANICAL LEVERAGE",
      subtitle: "Catapult Flex Dynamics",
      description:
        "Tuned with variable longitudinal flex stiffness, our carbon plate acts as a spring during terminal stance, reducing ankle joint workload by 14% while amplifying stride turnover.",
      stat: "14%",
      statLabel: "Reduced Joint Load",
      icon: Shield,
      accentColor: "#059669",
      bgClass: "bg-green-50",
      borderClass: "border-green-200"
    },
    {
      id: "03",
      title: "Seamless AeroKnit Jacquard Shell",
      category: "UPPER ERGONOMICS",
      subtitle: "Zero Friction. Zero Waste.",
      description:
        "Woven in a single uninterrupted piece from engineered recycled polymer filaments. Variable gauge mesh breathes freely over the forefoot while securing the midfoot.",
      stat: "215g",
      statLabel: "Total Shoe Weight",
      icon: Wind,
      accentColor: "#047857",
      bgClass: "bg-teal-50",
      borderClass: "border-teal-200"
    },
    {
      id: "04",
      title: "LiquidTraction Multi-Directional Lug Outsole",
      category: "SURFACE INTERFACE",
      subtitle: "Max Wet & Dry Grip",
      description:
        "Computer-simulated razor siping channels water away on wet asphalt, providing instantaneous grip and confidence through aggressive 90-degree cornering.",
      stat: "2.4x",
      statLabel: "Wet-Surface Traction",
      icon: Layers,
      accentColor: "#0f766e",
      bgClass: "bg-emerald-50",
      borderClass: "border-emerald-200"
    }
  ];

  return (
    <section id="story" className="relative py-28 border-t border-emerald-100 bg-[#edf8f1]/60 overflow-hidden">
      {/* Light Green Section Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-200/40 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-300 bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-widest">
            <span>Scroll-Driven Storytelling</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-emerald-950 tracking-tight uppercase">
            Dissecting The <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 to-green-600">Anatomy</span> Of Speed
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            Every millimeter of Arears footwear is engineered using computational biomechanics 
            and athlete telemetry.
          </p>
        </div>

        {/* Story Cards Breakdown */}
        <div className="space-y-16">
          {stories.map((story, index) => {
            const Icon = story.icon;
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 sm:p-12 rounded-3xl bg-white border ${story.borderClass} shadow-xl shadow-emerald-950/5 relative overflow-hidden`}
              >
                {/* Left/Right Text Narrative */}
                <div className={`lg:col-span-7 space-y-5 ${isEven ? "lg:order-1" : "lg:order-2"}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold tracking-widest text-emerald-700">
                      SYS // {story.id}
                    </span>
                    <span className="w-8 h-[1px] bg-emerald-200" />
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                      {story.category}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-emerald-950 tracking-tight">
                    {story.title}
                  </h3>

                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-normal">
                    {story.description}
                  </p>

                  <div className="pt-2 flex items-center gap-6">
                    <div>
                      <div className="text-3xl sm:text-4xl font-black text-emerald-900 font-mono flex items-baseline gap-1">
                        {story.stat}
                      </div>
                      <div className="text-xs text-gray-600 font-semibold">{story.statLabel}</div>
                    </div>
                  </div>
                </div>

                {/* Right/Left Visual Diagram Box */}
                <div className={`lg:col-span-5 ${isEven ? "lg:order-2" : "lg:order-1"}`}>
                  <div className={`relative aspect-video sm:aspect-square w-full rounded-2xl ${story.bgClass} border ${story.borderClass} p-8 flex flex-col justify-between overflow-hidden shadow-inner`}>
                    <div className="flex justify-between items-start">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-emerald-200 flex items-center justify-center shadow-sm">
                        <Icon className="w-6 h-6 text-emerald-700" />
                      </div>
                      <span className="text-3xl font-black font-mono text-emerald-900/15">
                        {story.id}
                      </span>
                    </div>

                    <div className="relative py-6 space-y-3">
                      <div className="h-2 w-full bg-emerald-200/60 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-emerald-600 animate-pulse"
                          style={{ width: "85%" }}
                        />
                      </div>
                      <div className="h-2 w-3/4 bg-emerald-200/60 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-emerald-500" style={{ width: "65%" }} />
                      </div>
                      <div className="h-2 w-1/2 bg-emerald-200/60 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-emerald-700" style={{ width: "90%" }} />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs font-semibold text-emerald-900 border-t border-emerald-200/80 pt-4">
                      <span>Lab Calibration Pass</span>
                      <span className="font-mono text-emerald-700">VERIFIED ✓</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
