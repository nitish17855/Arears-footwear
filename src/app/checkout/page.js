"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, CreditCard, ArrowLeft, Lock, Sparkles } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, discountAmount, shippingFee, totalAmount, clearCart } = useCart();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: user?.name || "Alex Rivera",
    email: user?.email || "alex@example.com",
    street: "742 Evergreen Terrace",
    city: "Springfield",
    state: "OR",
    zip: "97477",
    country: "USA",
    paymentMode: "demo"
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (items.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          customerName: formData.name,
          guestEmail: formData.email,
          discount: discountAmount,
          useStripeTest: formData.paymentMode === "stripe",
          shippingAddress: {
            street: formData.street,
            city: formData.city,
            state: formData.state,
            zip: formData.zip,
            country: formData.country
          }
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Payment failed");
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        clearCart();
        router.push(`/checkout/success?order_id=${data.orderId}`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-32 text-center space-y-4">
        <h2 className="text-2xl font-black text-gray-900 uppercase">Your Bag is Empty</h2>
        <p className="text-sm text-gray-600">Add footwear from our collection before checking out.</p>
        <Link
          href="/#catalog"
          className="inline-block px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-600/20"
        >
          Return to Storefront
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-emerald-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Store</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Shipping & Payment Form */}
        <form onSubmit={handleCheckout} className="lg:col-span-7 space-y-8">
          {/* Customer Info */}
          <div className="p-8 rounded-3xl bg-white border border-emerald-100 shadow-xl shadow-emerald-950/5 space-y-4">
            <h3 className="text-lg font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-mono">
                1
              </span>
              Contact & Delivery Address
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-emerald-200 bg-white text-sm text-gray-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-emerald-200 bg-white text-sm text-gray-900 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                Street Address
              </label>
              <input
                type="text"
                required
                name="street"
                value={formData.street}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-emerald-200 bg-white text-sm text-gray-900 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                  City
                </label>
                <input
                  type="text"
                  required
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-emerald-200 bg-white text-sm text-gray-900 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                  State
                </label>
                <input
                  type="text"
                  required
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-emerald-200 bg-white text-sm text-gray-900 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  required
                  name="zip"
                  value={formData.zip}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-emerald-200 bg-white text-sm text-gray-900 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="p-8 rounded-3xl bg-white border border-emerald-100 shadow-xl shadow-emerald-950/5 space-y-4">
            <h3 className="text-lg font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-mono">
                2
              </span>
              Payment Architecture
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  formData.paymentMode === "demo"
                    ? "border-emerald-500 bg-emerald-50 shadow-md shadow-emerald-600/10"
                    : "border-gray-200 bg-white opacity-80 hover:opacity-100"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-gray-900">Instant Demo Pay</span>
                  </div>
                  <input
                    type="radio"
                    name="paymentMode"
                    value="demo"
                    checked={formData.paymentMode === "demo"}
                    onChange={handleChange}
                    className="accent-emerald-600"
                  />
                </div>
                <p className="text-[11px] text-gray-500">
                  Instantly decrements inventory, records in Postgres, and triggers celebratory receipt without external keys.
                </p>
              </label>

              <label
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  formData.paymentMode === "stripe"
                    ? "border-emerald-500 bg-emerald-50 shadow-md shadow-emerald-600/10"
                    : "border-gray-200 bg-white opacity-80 hover:opacity-100"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-gray-900">Stripe Test Mode</span>
                  </div>
                  <input
                    type="radio"
                    name="paymentMode"
                    value="stripe"
                    checked={formData.paymentMode === "stripe"}
                    onChange={handleChange}
                    className="accent-emerald-600"
                  />
                </div>
                <p className="text-[11px] text-gray-500">
                  Connects to official Stripe Checkout Session when STRIPE_SECRET_KEY is configured.
                </p>
              </label>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              <span>
                {loading ? "Authorizing Transaction..." : `Pay $${totalAmount.toFixed(2)} USD`}
              </span>
            </button>
          </div>
        </form>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-8 rounded-3xl bg-white border border-emerald-100 shadow-xl shadow-emerald-950/5 space-y-6">
            <h3 className="text-base font-black text-gray-900 uppercase tracking-wider">
              Order Summary ({items.length} pairs)
            </h3>

            <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
              {items.map((item) => (
                <div key={item.cartKey} className="flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-lg border border-gray-300 shrink-0 flex items-center justify-center font-bold text-[10px] text-white"
                      style={{ backgroundColor: item.colorHex }}
                    >
                      {item.size}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{item.name}</div>
                      <div className="text-gray-500 text-[11px]">
                        {item.color} • Qty: {item.quantity}
                      </div>
                    </div>
                  </div>
                  <div className="font-mono font-bold text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-emerald-100 space-y-2 text-xs text-gray-600 font-medium">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-gray-900 font-bold">${subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>AREARS20 Promo (20% off)</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Express Courier</span>
                <span className="text-gray-900 font-bold">
                  {shippingFee === 0 ? "FREE" : `$${shippingFee.toFixed(2)}`}
                </span>
              </div>
              <div className="pt-3 border-t border-emerald-100 flex justify-between text-base font-black text-gray-900">
                <span>Total Due</span>
                <span className="text-emerald-800 font-mono text-lg">
                  ${totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center gap-2 text-[11px] text-emerald-900 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Full buyer protection & 30-day trial wear guarantee.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
