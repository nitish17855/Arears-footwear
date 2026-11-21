"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import confetti from "canvas-confetti";
import { CheckCircle2, ArrowRight, Package, Sparkles } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id") || "ord-9823";
  const [order, setOrder] = useState(null);

  useEffect(() => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // Fallback
    }

    if (orderId) {
      fetch(`/api/orders/${orderId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.order) setOrder(data.order);
        })
        .catch(() => {});
    }
  }, [orderId]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-8">
      {/* Success Badge */}
      <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-600 shadow-xl shadow-emerald-500/20">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div className="space-y-3">
        <span className="text-xs font-mono font-bold tracking-widest text-emerald-700 uppercase">
          TRANSACTION CONFIRMED // DISPATCH QUEUED
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-gray-900 uppercase tracking-tight">
          Welcome to the Arears Team.
        </h1>
        <p className="text-sm text-gray-600 max-w-md mx-auto">
          Your order has been recorded in the database. Our fulfillment center is preparing your kinetic footwear.
        </p>
      </div>

      {/* Order Tracking Card */}
      <div className="p-8 rounded-3xl bg-white border border-emerald-100 shadow-xl shadow-emerald-950/5 text-left space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-emerald-100 gap-2">
          <div>
            <span className="text-xs text-gray-500 uppercase font-bold">Order Tracking ID</span>
            <div className="text-lg font-mono font-black text-gray-900">{orderId}</div>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 w-fit">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{order?.status || "PROCESSING"}</span>
          </div>
        </div>

        {/* Tracking Timeline */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-gray-700 uppercase">Fulfillment Timeline</div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2">
            <div className="p-3 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold">
              1. Paid & Verified ✓
            </div>
            <div className="p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100 text-gray-600 font-medium">
              2. Lab Testing & Packing
            </div>
            <div className="p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100 text-gray-600 font-medium">
              3. Express Courier
            </div>
          </div>
        </div>

        {order?.shippingAddress && (
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-xs text-gray-700 space-y-1">
            <div className="text-emerald-900 uppercase font-bold">Delivery Destination</div>
            <div>{order.customerName}</div>
            <div>
              {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/orders"
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white border border-emerald-200 hover:bg-emerald-50 text-emerald-900 font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
        >
          <Package className="w-4 h-4" />
          <span>View All My Orders</span>
        </Link>

        <Link
          href="/#catalog"
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 hover:scale-105 transition-all"
        >
          <span>Continue Browsing</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-xl mx-auto py-24 text-center text-xs text-gray-400 font-mono">
          Loading order telemetry...
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
