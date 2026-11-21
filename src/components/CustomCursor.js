"use client";

import React, { useEffect, useState } from "react";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trailing, setTrailing] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [hoverLabel, setHoverLabel] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only run on desktop devices with fine pointer (mouse)
    if (typeof window === "undefined" || !window.matchMedia("(pointer: fine)").matches) {
      return;
    }

    const onMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);

      // Check if hovering interactive element
      const target = e.target;
      if (!target) return;

      const interactive = target.closest("button, a, input, select, [data-cursor]");
      const canvasTarget = target.closest("canvas");

      if (canvasTarget) {
        setIsHovered(true);
        setHoverLabel("DRAG 360°");
      } else if (interactive) {
        setIsHovered(true);
        setHoverLabel(interactive.getAttribute("data-cursor") || "");
      } else {
        setIsHovered(false);
        setHoverLabel("");
      }
    };

    const onMouseLeave = () => setIsVisible(false);

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  // Smooth spring interpolation for the trailing ring
  useEffect(() => {
    let animationId;
    const lerp = (start, end, factor) => start + (end - start) * factor;

    const animateTrailing = () => {
      setTrailing((prev) => ({
        x: lerp(prev.x, position.x, 0.2),
        y: lerp(prev.y, position.y, 0.2)
      }));
      animationId = requestAnimationFrame(animateTrailing);
    };

    animationId = requestAnimationFrame(animateTrailing);
    return () => cancelAnimationFrame(animationId);
  }, [position]);

  if (!isVisible) return null;

  return (
    <>
      {/* Tiny precise center dot */}
      <div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-emerald-600 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${isHovered ? 0 : 1})`
        }}
      />

      {/* Trailing follower circle that expands */}
      <div
        className={`fixed top-0 left-0 rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center font-mono font-bold text-[9px] uppercase tracking-wider transition-all duration-200 ${
          isHovered
            ? "w-20 h-20 bg-emerald-500/20 border border-emerald-500 text-emerald-950 backdrop-blur-[2px] shadow-lg shadow-emerald-500/20"
            : "w-8 h-8 border border-emerald-500/50 bg-emerald-100/10"
        }`}
        style={{
          transform: `translate3d(${trailing.x}px, ${trailing.y}px, 0)`
        }}
      >
        {hoverLabel}
      </div>
    </>
  );
}
