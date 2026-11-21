"use client";

import React, { useEffect, useState, useRef } from "react";
import { sounds } from "@/lib/audio";

export default function WaterRippleBackground() {
  const [ripples, setRipples] = useState([]);
  const [bubbles, setBubbles] = useState([]);
  const [ambientBubbles, setAmbientBubbles] = useState([]);
  const counterRef = useRef(0);

  // Initialize random ambient floating dew bubbles in the background
  useEffect(() => {
    const ambient = Array.from({ length: 12 }, (_, i) => ({
      id: `ambient-${i}`,
      left: Math.random() * 100,
      size: 14 + Math.random() * 28,
      duration: 12 + Math.random() * 16,
      delay: Math.random() * 8,
      opacity: 0.15 + Math.random() * 0.25
    }));
    setAmbientBubbles(ambient);
  }, []);

  // Global click / tap listener for water bubbles & ripples
  useEffect(() => {
    const handlePointerDown = (e) => {
      // Don't trigger if clicking inside the 3D canvas OrbitControls drag area
      if (e.target.closest("canvas")) return;

      const clickX = e.clientX;
      const clickY = e.clientY;

      sounds.playWaterPlop();

      const newRippleId = `rip-${Date.now()}-${counterRef.current++}`;
      const newRipple = {
        id: newRippleId,
        x: clickX,
        y: clickY
      };

      // Spawn a burst of 5-8 water bubbles radiating from the click point
      const bubbleCount = 6 + Math.floor(Math.random() * 3);
      const newBubbleBurst = Array.from({ length: bubbleCount }, (_, i) => {
        const angle = (Math.PI * 2 * i) / bubbleCount + (Math.random() - 0.5) * 0.5;
        const velocity = 25 + Math.random() * 55;
        const size = 16 + Math.random() * 26;

        return {
          id: `bub-${Date.now()}-${i}-${counterRef.current++}`,
          x: clickX,
          y: clickY,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity - (20 + Math.random() * 30), // natural upward buoyancy
          size,
          color: Math.random() > 0.4 ? "#a7f3d0" : "#6ee7b7"
        };
      });

      setRipples((prev) => [...prev.slice(-6), newRipple]);
      setBubbles((prev) => [...prev.slice(-25), ...newBubbleBurst]);

      // Auto-cleanup ripple
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRippleId));
      }, 1000);

      // Auto-cleanup bubbles
      setTimeout(() => {
        setBubbles((prev) => prev.filter((b) => !newBubbleBurst.some((nb) => nb.id === b.id)));
      }, 1200);
    };

    window.addEventListener("pointerdown", handlePointerDown);
    return () => window.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[45] overflow-hidden">
      {/* 1. Ambient Floating Dew Bubbles in Background */}
      <div className="absolute inset-0 opacity-60">
        {ambientBubbles.map((ab) => (
          <div
            key={ab.id}
            className="absolute rounded-full animate-float-up"
            style={{
              left: `${ab.left}%`,
              bottom: "-50px",
              width: `${ab.size}px`,
              height: `${ab.size}px`,
              background: `radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.85), rgba(167, 243, 208, 0.35) 45%, rgba(16, 185, 129, 0.15) 75%, rgba(5, 150, 105, 0.4) 100%)`,
              boxShadow: `inset 0 0 6px rgba(255, 255, 255, 0.8), 0 4px 12px rgba(16, 185, 129, 0.15)`,
              animationDuration: `${ab.duration}s`,
              animationDelay: `${ab.delay}s`,
              opacity: ab.opacity
            }}
          >
            {/* Tiny specular glass highlight */}
            <span className="absolute top-[20%] left-[20%] w-[25%] h-[25%] rounded-full bg-white/90 blur-[0.5px]" />
          </div>
        ))}
      </div>

      {/* 2. Interactive Concentric Water Ripples */}
      {ripples.map((r) => (
        <div
          key={r.id}
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-water-ripple"
          style={{
            left: `${r.x}px`,
            top: `${r.y}px`
          }}
        >
          {/* Inner ring */}
          <div className="w-16 h-16 rounded-full border-2 border-emerald-400/80 shadow-[0_0_20px_rgba(16,185,129,0.4)]" />
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border border-teal-300/60 scale-125" />
        </div>
      ))}

      {/* 3. Interactive Realistic Water Droplet Bubbles with Specular Highlights */}
      {bubbles.map((b) => (
        <div
          key={b.id}
          className="absolute rounded-full animate-bubble-burst"
          style={{
            left: `${b.x}px`,
            top: `${b.y}px`,
            width: `${b.size}px`,
            height: `${b.size}px`,
            marginLeft: `-${b.size / 2}px`,
            marginTop: `-${b.size / 2}px`,
            background: `radial-gradient(circle at 32% 32%, rgba(255, 255, 255, 0.95), rgba(209, 250, 229, 0.6) 40%, rgba(52, 211, 153, 0.25) 70%, rgba(5, 150, 105, 0.5) 100%)`,
            border: "1px solid rgba(255, 255, 255, 0.7)",
            boxShadow: `inset 0 0 8px rgba(255, 255, 255, 0.9), 0 8px 18px rgba(16, 185, 129, 0.25)`,
            "--bubble-vx": `${b.vx}px`,
            "--bubble-vy": `${b.vy}px`
          }}
        >
          {/* Specular light curved reflection reflection */}
          <span className="absolute top-[18%] left-[18%] w-[32%] h-[32%] rounded-full bg-white/95" />
          <span className="absolute bottom-[20%] right-[22%] w-[15%] h-[15%] rounded-full bg-emerald-200/60" />
        </div>
      ))}
    </div>
  );
}
