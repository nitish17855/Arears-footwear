import React from "react";
import Link from "next/link";
import { Sparkles, ShieldCheck, ArrowUpRight, Zap, RefreshCw } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-emerald-100 bg-[#eaf6ef] text-gray-600 text-sm mt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-200/60 border border-emerald-300 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-emerald-800" />
              </div>
              <span className="text-lg font-black tracking-widest text-emerald-950 uppercase">AREARS</span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Computational biomechanics, nitrogen energy return, and precision athletic design.
            </p>
            <div className="text-xs text-emerald-700 font-mono font-medium">
              Designed in Tokyo & Portland.
            </div>
          </div>

          {/* Technology Highlights */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">Breakthroughs</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5 hover:text-emerald-700 transition-colors cursor-pointer">
                <Zap className="w-3 h-3 text-emerald-600" /> ArearsFoam Nitrogen Matrix
              </li>
              <li className="flex items-center gap-1.5 hover:text-emerald-700 transition-colors cursor-pointer">
                <ShieldCheck className="w-3 h-3 text-emerald-600" /> 3K Kinetic Carbon Plate
              </li>
              <li className="flex items-center gap-1.5 hover:text-emerald-700 transition-colors cursor-pointer">
                <RefreshCw className="w-3 h-3 text-emerald-600" /> Zero-Waste AeroKnit
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">Store & Support</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/#catalog" className="hover:text-emerald-800 transition-colors">
                  Footwear Catalog
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-emerald-800 transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-emerald-700 font-semibold transition-colors">
                  Admin Portal
                </Link>
              </li>
              <li>
                <span className="text-emerald-600 font-medium">Stripe Test Mode Enabled</span>
              </li>
            </ul>
          </div>

          {/* Demo Credentials Box */}
          <div className="p-4 rounded-2xl border border-emerald-200/80 bg-white/80 space-y-2 shadow-sm">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-950">
              <span>Demo Credentials</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <p className="text-[11px] text-gray-600">
              Admin: <code className="text-emerald-700 font-bold">admin@arearssneakers.com</code> / <code className="text-emerald-700 font-bold">admin123</code>
            </p>
            <p className="text-[11px] text-gray-600">
              Customer: <code className="text-emerald-700 font-bold">alex@example.com</code> / <code className="text-emerald-700 font-bold">customer123</code>
            </p>
            <p className="text-[10px] text-emerald-800 font-semibold mt-1">
              Promo: <strong className="text-emerald-950">AREARS20</strong> for 20% off.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-emerald-200/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div>© 2026 AREARS LABS INC. All rights reserved.</div>
          <div className="flex gap-6 text-emerald-800 font-medium">
            <span>Next.js 16 + React 19</span>
            <span>Real 3D GLTF Footwear</span>
            <span>PostgreSQL Relational DB</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
