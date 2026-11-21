"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  User,
  ShieldCheck,
  Menu,
  X,
  Sparkles,
  LogOut,
  Volume2,
  VolumeX,
  Layers,
  Ruler
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { sounds } from "@/lib/audio";

export default function Navbar({ onOpenCompare, onOpenAdvisor }) {
  const { totalItemsCount, setIsCartOpen } = useCart();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const toggleSound = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
    if (!muted) sounds.playClick();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-emerald-100 bg-[#f4fbf7]/85 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-green-400 to-teal-300 p-[1px] group-hover:scale-105 transition-transform duration-300 shadow-md shadow-emerald-500/20">
            <div className="w-full h-full bg-white rounded-[11px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-emerald-600 group-hover:rotate-12 transition-transform" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-widest uppercase bg-gradient-to-r from-emerald-950 via-emerald-800 to-green-700 bg-clip-text text-transparent">
              AREARS
            </span>
            <span className="text-[10px] tracking-widest text-emerald-600 uppercase -mt-1 font-bold">
              LABS // FOOTWEAR
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-gray-700">
          <Link href="/#story" className="hover:text-emerald-600 transition-colors">
            Technology
          </Link>
          <Link href="/#catalog" className="hover:text-emerald-600 transition-colors">
            Collection
          </Link>
          <Link href="/#biomechanics" className="hover:text-emerald-600 transition-colors">
            Physics Lab
          </Link>
          
          {onOpenCompare && (
            <button
              onClick={onOpenCompare}
              className="flex items-center gap-1.5 hover:text-emerald-700 transition-colors text-xs font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200"
            >
              <Layers className="w-3.5 h-3.5 text-emerald-600" />
              Compare
            </button>
          )}

          {onOpenAdvisor && (
            <button
              onClick={onOpenAdvisor}
              className="flex items-center gap-1.5 hover:text-emerald-700 transition-colors text-xs font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200"
            >
              <Ruler className="w-3.5 h-3.5 text-emerald-600" />
              Fit Advisor
            </button>
          )}

          <Link href="/orders" className="hover:text-emerald-600 transition-colors">
            Orders
          </Link>

          {user?.role === "ADMIN" && (
            <Link
              href="/admin"
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200 transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Admin Portal
            </Link>
          )}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Audio Synthesizer Toggle */}
          <button
            onClick={toggleSound}
            className={`p-2.5 rounded-xl border transition-all ${
              !isMuted
                ? "bg-emerald-100 border-emerald-300 text-emerald-800 shadow-sm"
                : "bg-white border-gray-200 text-gray-400"
            }`}
            title={isMuted ? "Enable Sound FX" : "Mute Sound FX"}
          >
            {!isMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* User Auth Menu */}
          <div className="relative">
            {user ? (
              <div>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-200 bg-white hover:border-emerald-400 text-xs font-semibold text-gray-800 shadow-sm transition-all"
                >
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="max-w-[100px] truncate">{user.name.split(" ")[0]}</span>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white border border-emerald-100 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-3 py-2 border-b border-emerald-100 text-xs text-gray-500">
                      Signed in as <strong className="text-gray-900 block truncate">{user.email}</strong>
                    </div>
                    <Link
                      href="/orders"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-3 py-2 text-xs font-medium text-gray-700 hover:bg-emerald-50 rounded-lg transition-colors"
                    >
                      My Orders
                    </Link>
                    {user.role === "ADMIN" && (
                      <Link
                        href="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-emerald-200 bg-white hover:bg-emerald-50 text-xs font-semibold text-gray-800 shadow-sm transition-all"
              >
                <User className="w-3.5 h-3.5 text-emerald-600" />
                Sign In
              </Link>
            )}
          </div>

          {/* Cart Trigger */}
          <button
            onClick={() => {
              sounds.playClick();
              setIsCartOpen(true);
            }}
            className="relative p-2.5 rounded-xl border border-emerald-200 bg-white hover:border-emerald-400 hover:text-emerald-700 text-gray-800 shadow-sm transition-all group"
            aria-label="Open Cart"
          >
            <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform text-emerald-800" />
            {totalItemsCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-emerald-500 to-green-500 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                {totalItemsCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl border border-emerald-200 bg-white text-gray-700"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-emerald-100 bg-white/95 backdrop-blur-2xl px-6 py-6 space-y-4 animate-in slide-in-from-top-4 duration-300">
          <Link
            href="/#story"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-semibold text-gray-800 hover:text-emerald-600"
          >
            Technology & Innovation
          </Link>
          <Link
            href="/#catalog"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-semibold text-gray-800 hover:text-emerald-600"
          >
            Footwear Collection
          </Link>
          <Link
            href="/#biomechanics"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-semibold text-gray-800 hover:text-emerald-600"
          >
            Biomechanics Lab
          </Link>
          <Link
            href="/orders"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-semibold text-gray-800 hover:text-emerald-600"
          >
            Order Tracking
          </Link>
        </div>
      )}
    </header>
  );
}
