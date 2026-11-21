"use client";

import React, { useState } from "react";
import Link from "next/link";
import { X, Trash2, ArrowRight, ShieldCheck, Tag } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeItem,
    updateQuantity,
    subtotal,
    discountAmount,
    shippingFee,
    totalAmount,
    applyPromo
  } = useCart();

  const [inputCode, setInputCode] = useState("");
  const [promoMessage, setPromoMessage] = useState(null);

  if (!isCartOpen) return null;

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!inputCode) return;
    const res = applyPromo(inputCode);
    setPromoMessage(res);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-emerald-950/40 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-emerald-100 text-gray-900 flex flex-col shadow-2xl">
          {/* Drawer Header */}
          <div className="p-6 border-b border-emerald-100 flex items-center justify-between bg-[#f4fbf7]">
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-wider uppercase text-emerald-950">
                Your Arears Cart
              </span>
              <span className="text-xs text-emerald-700 font-bold">({items.length} pairs)</span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-emerald-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-24 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                  <Tag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-gray-900">Your bag is empty</h3>
                <p className="text-xs text-gray-500 max-w-xs mx-auto">
                  Add footwear from our collection to experience kinetic propulsion.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs transition-transform hover:scale-105 shadow-md shadow-emerald-600/20"
                >
                  Explore Footwear
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.cartKey}
                  className="p-4 rounded-2xl border border-emerald-100 bg-[#fafdfb] flex gap-4 items-center justify-between shadow-sm"
                >
                  {/* Color Thumbnail Indicator */}
                  <div
                    className="w-12 h-12 rounded-xl border border-gray-300 flex items-center justify-center font-black text-xs shadow-inner shrink-0 text-white drop-shadow"
                    style={{ backgroundColor: item.colorHex || "#10b981" }}
                  >
                    {item.size}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-gray-900 truncate">{item.name}</h4>
                    <p className="text-xs text-gray-500">
                      {item.color} • US {item.size}
                    </p>
                    <div className="text-xs font-bold text-emerald-700 mt-1">
                      ${item.price} each
                    </div>
                  </div>

                  {/* Quantity & Delete */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center border border-emerald-200 rounded-lg bg-white text-xs">
                      <button
                        onClick={() => updateQuantity(item.cartKey, item.quantity - 1)}
                        className="px-2 py-1 text-gray-600 hover:text-black font-bold"
                      >
                        -
                      </button>
                      <span className="px-2 py-1 font-bold text-gray-900">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.cartKey, item.quantity + 1)}
                        className="px-2 py-1 text-gray-600 hover:text-black font-bold"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.cartKey)}
                      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Promo Code & Order Summary */}
          {items.length > 0 && (
            <div className="p-6 border-t border-emerald-100 bg-[#f4fbf7] space-y-4">
              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo Code (Try 'AREARS20')"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl border border-emerald-200 bg-white text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 uppercase"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-xs font-bold text-emerald-900 transition-colors"
                >
                  Apply
                </button>
              </form>
              {promoMessage && (
                <div
                  className={`text-xs font-semibold ${
                    promoMessage.success ? "text-emerald-700" : "text-red-600"
                  }`}
                >
                  {promoMessage.message}
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-gray-600 font-medium">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-gray-900 font-bold">${subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Discount (20% AREARS20)</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-gray-900 font-bold">
                    {shippingFee === 0 ? "FREE" : `$${shippingFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="pt-2 border-t border-emerald-200 flex justify-between text-base font-black text-gray-900">
                  <span>Total</span>
                  <span className="text-emerald-800 font-mono text-lg">
                    ${totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Encrypted Stripe Checkout • 30-Day Returns</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
