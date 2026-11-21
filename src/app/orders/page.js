"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Package, Truck, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const url = user?.email
          ? `/api/orders?email=${encodeURIComponent(user.email)}`
          : "/api/orders";
        const res = await fetch(url);
        const data = await res.json();
        if (data.orders) setOrders(data.orders);
      } catch (err) {
        console.error("Failed to load orders", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "DELIVERED":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "SHIPPED":
        return "bg-green-100 text-green-800 border-green-300";
      case "PROCESSING":
        return "bg-amber-100 text-amber-800 border-amber-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <div>
        <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          Customer Portfolio
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 uppercase tracking-tight">
          Your Arears Orders
        </h1>
        <p className="text-xs text-gray-600">
          Track fulfillment status, courier dispatch, and past purchases.
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-gray-500 text-xs font-mono">
          Querying database orders...
        </div>
      ) : orders.length === 0 ? (
        <div className="p-16 rounded-3xl bg-white border border-emerald-100 text-center space-y-4 shadow-sm">
          <Package className="w-12 h-12 text-emerald-600 mx-auto" />
          <h3 className="text-base font-bold text-gray-900">No Previous Orders Found</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            You haven't placed an order yet. Select a footwear model and experience kinetic propulsion.
          </p>
          <Link
            href="/#catalog"
            className="inline-block px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-600/20"
          >
            Explore Footwear
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="p-6 sm:p-8 rounded-3xl bg-white border border-emerald-100 space-y-6 hover:border-emerald-300 transition-all shadow-md shadow-emerald-950/5"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-emerald-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="text-base font-black font-mono text-gray-900">{order.id}</span>
                    <span
                      className={`text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Placed on {new Date(order.createdAt).toLocaleDateString()} for {order.customerName}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-gray-500 uppercase font-bold">Total Amount</div>
                  <div className="text-xl font-black font-mono text-emerald-800">
                    ${order.totalAmount.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                {order.items?.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-200 text-emerald-900 flex items-center justify-center font-bold">
                        {item.size || 10}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{item.productName || item.name}</div>
                        <div className="text-gray-500 text-[11px]">
                          {item.colorName || item.color} • Qty: {item.quantity}
                        </div>
                      </div>
                    </div>
                    <div className="font-mono font-bold text-gray-900">
                      ${((item.priceAtPurchase || item.price) * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Address & Status Bar */}
              <div className="pt-4 border-t border-emerald-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-emerald-600" />
                  <span>
                    Delivering to: {order.shippingAddress?.city}, {order.shippingAddress?.state} ({order.shippingAddress?.country})
                  </span>
                </div>
                <div className="font-mono text-[11px] text-emerald-700 font-semibold">
                  Tracking: AREARS-EXP-{order.id.replace("ord-", "")}-US
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
