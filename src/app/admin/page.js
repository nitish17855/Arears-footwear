"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Package,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Plus,
  RefreshCw,
  Edit2,
  Check
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AdminPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingVariantId, setEditingVariantId] = useState(null);
  const [stockInput, setStockInput] = useState("");
  const [activeTab, setActiveTab] = useState("inventory");

  const [newProd, setNewProd] = useState({
    name: "",
    tagline: "",
    description: "",
    category: "Running",
    basePrice: 220,
    colorName: "Mint Accelerator",
    primaryHex: "#10b981",
    image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=1000&q=80"
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, ordRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/orders")
      ]);
      const prodData = await prodRes.json();
      const ordData = await ordRes.json();

      if (prodData.products) setProducts(prodData.products);
      if (ordData.orders) setOrders(ordData.orders);
    } catch (err) {
      console.error("Admin fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStock = async (variantId) => {
    try {
      const res = await fetch(`/api/variants/${variantId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stockQuantity: parseInt(stockInput, 10) })
      });
      if (res.ok) {
        setEditingVariantId(null);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newProd.name,
          tagline: newProd.tagline,
          description: newProd.description,
          category: newProd.category,
          basePrice: parseFloat(newProd.basePrice),
          image: newProd.image,
          isFeatured: false,
          colorways: [
            {
              name: newProd.colorName,
              primaryHex: newProd.primaryHex,
              secondaryHex: "#f0fdf4",
              accentHex: "#34d399",
              soleHex: "#ffffff",
              image: newProd.image
            }
          ],
          sizes: [8, 8.5, 9, 9.5, 10, 10.5, 11, 12]
        })
      });

      if (res.ok) {
        setNewProd({
          name: "",
          tagline: "",
          description: "",
          category: "Running",
          basePrice: 220,
          colorName: "Mint Accelerator",
          primaryHex: "#10b981",
          image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=1000&q=80"
        });
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const allVariants = products.flatMap((p) => p.variants || []);
  const lowStockCount = allVariants.filter((v) => v.stockQuantity <= 5).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-emerald-100">
        <div>
          <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            PostgreSQL Admin Operations Center
          </div>
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">
            Inventory & Order Controls
          </h1>
          <p className="text-xs text-gray-500">
            Real-time PostgreSQL telemetry, inventory adjustments, and courier dispatch.
          </p>
        </div>

        <button
          onClick={fetchData}
          className="px-4 py-2 rounded-xl bg-white border border-emerald-200 text-xs font-bold text-emerald-900 flex items-center gap-2 transition-colors shadow-sm w-fit"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-emerald-600" : ""}`} />
          <span>Sync Database</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-3xl bg-white border border-emerald-100 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500 font-bold uppercase">
            <span>Gross Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black font-mono text-gray-900">
            ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-emerald-700 font-bold">+18.4% vs last period</div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-emerald-100 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500 font-bold uppercase">
            <span>Customer Orders</span>
            <Package className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black font-mono text-gray-900">{orders.length}</div>
          <div className="text-[11px] text-gray-500">Across PostgreSQL relational store</div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-emerald-100 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500 font-bold uppercase">
            <span>Footwear SKUs</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black font-mono text-gray-900">{allVariants.length}</div>
          <div className="text-[11px] text-gray-500">{products.length} Base Product Models</div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-emerald-100 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500 font-bold uppercase">
            <span>Low Stock Alerts</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black font-mono text-amber-600">{lowStockCount}</div>
          <div className="text-[11px] text-gray-500">Variants with ≤ 5 pairs remaining</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-emerald-100 pb-4">
        <button
          onClick={() => setActiveTab("inventory")}
          className={`text-xs font-bold uppercase tracking-wider pb-2 border-b-2 transition-all ${
            activeTab === "inventory"
              ? "border-emerald-600 text-emerald-800"
              : "border-transparent text-gray-400 hover:text-gray-700"
          }`}
        >
          Live Inventory Manager
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`text-xs font-bold uppercase tracking-wider pb-2 border-b-2 transition-all ${
            activeTab === "orders"
              ? "border-emerald-600 text-emerald-800"
              : "border-transparent text-gray-400 hover:text-gray-700"
          }`}
        >
          Customer Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab("addProduct")}
          className={`text-xs font-bold uppercase tracking-wider pb-2 border-b-2 transition-all ${
            activeTab === "addProduct"
              ? "border-emerald-600 text-emerald-800"
              : "border-transparent text-gray-400 hover:text-gray-700"
          }`}
        >
          + Add New Footwear Model
        </button>
      </div>

      {/* TAB 1: INVENTORY MANAGEMENT */}
      {activeTab === "inventory" && (
        <div className="rounded-3xl bg-white border border-emerald-100 overflow-hidden shadow-lg shadow-emerald-950/5">
          <div className="p-6 border-b border-emerald-100 flex items-center justify-between">
            <h3 className="text-sm font-black uppercase text-gray-900 tracking-wider">
              Variant Inventory Database Table
            </h3>
            <span className="text-xs text-emerald-700 font-semibold">Click pencil to modify live stock</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-emerald-50 text-emerald-900 uppercase font-mono border-b border-emerald-100">
                <tr>
                  <th className="p-4">SKU / Model</th>
                  <th className="p-4">Colorway</th>
                  <th className="p-4">US Size</th>
                  <th className="p-4">Unit Price</th>
                  <th className="p-4">Stock Quantity</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-50 text-gray-700">
                {allVariants.slice(0, 25).map((v) => (
                  <tr key={v.id} className="hover:bg-emerald-50/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-gray-900">
                      <div>{v.sku}</div>
                      <div className="text-[11px] text-gray-500 font-sans">{v.productName}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3.5 h-3.5 rounded-full border border-gray-300"
                          style={{ backgroundColor: v.colorHex }}
                        />
                        <span className="font-medium">{v.colorName}</span>
                      </div>
                    </td>
                    <td className="p-4 font-bold text-gray-900">{v.size}</td>
                    <td className="p-4 font-mono font-bold">${v.basePrice}</td>
                    <td className="p-4">
                      {editingVariantId === v.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            value={stockInput}
                            onChange={(e) => setStockInput(e.target.value)}
                            className="w-16 px-2 py-1 rounded-lg bg-white border border-emerald-500 text-gray-900 text-xs font-bold"
                          />
                          <button
                            onClick={() => handleUpdateStock(v.id)}
                            className="p-1 rounded bg-emerald-600 text-white hover:bg-emerald-500"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <span
                          className={`font-mono font-bold px-2 py-0.5 rounded-full text-[11px] ${
                            v.stockQuantity <= 5
                              ? "bg-amber-100 text-amber-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {v.stockQuantity} pairs
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => {
                          setEditingVariantId(v.id);
                          setStockInput(String(v.stockQuantity));
                        }}
                        className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800"
                        title="Edit Stock"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ORDERS MANAGEMENT */}
      {activeTab === "orders" && (
        <div className="rounded-3xl bg-white border border-emerald-100 overflow-hidden shadow-lg shadow-emerald-950/5">
          <div className="p-6 border-b border-emerald-100">
            <h3 className="text-sm font-black uppercase text-gray-900 tracking-wider">
              Customer Orders & Courier Dispatch
            </h3>
          </div>

          <div className="divide-y divide-emerald-50">
            {orders.map((o) => (
              <div key={o.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-emerald-50/30">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="text-base font-black font-mono text-gray-900">{o.id}</span>
                    <span className="text-xs text-gray-500">by {o.customerName} ({o.guestEmail})</span>
                  </div>
                  <div className="text-xs text-gray-600">
                    {o.items?.length || 0} item(s) • Total:{" "}
                    <strong className="text-emerald-800 font-mono">${o.totalAmount?.toFixed(2)}</strong>
                  </div>
                  <div className="text-[11px] text-gray-500">
                    Ship to: {o.shippingAddress?.city}, {o.shippingAddress?.state} {o.shippingAddress?.zip}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-700">Status:</span>
                  <select
                    value={o.status}
                    onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-gray-900 font-bold focus:outline-none focus:border-emerald-500"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="PROCESSING">PROCESSING</option>
                    <option value="SHIPPED">SHIPPED</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ADD NEW PRODUCT */}
      {activeTab === "addProduct" && (
        <form onSubmit={handleAddProduct} className="max-w-2xl p-8 rounded-3xl bg-white border border-emerald-100 shadow-xl shadow-emerald-950/5 space-y-6">
          <h3 className="text-base font-black uppercase text-gray-900 tracking-wider">
            Launch New Footwear Prototype
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Sneaker Name
              </label>
              <input
                type="text"
                required
                value={newProd.name}
                onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                placeholder="Arears Vortex Hyper"
                className="w-full px-4 py-2.5 rounded-xl border border-emerald-200 bg-white text-sm text-gray-900 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Category
              </label>
              <select
                value={newProd.category}
                onChange={(e) => setNewProd({ ...newProd, category: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-emerald-200 bg-white text-sm text-gray-900 focus:outline-none focus:border-emerald-500"
              >
                <option value="Running">Running</option>
                <option value="Lifestyle">Lifestyle</option>
                <option value="Basketball">Basketball</option>
                <option value="Training">Training</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Tagline
            </label>
            <input
              type="text"
              required
              value={newProd.tagline}
              onChange={(e) => setNewProd({ ...newProd, tagline: e.target.value })}
              placeholder="Next-gen kinetic runner."
              className="w-full px-4 py-2.5 rounded-xl border border-emerald-200 bg-white text-sm text-gray-900 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Image URL (Real Footwear Photography)
            </label>
            <input
              type="url"
              required
              value={newProd.image}
              onChange={(e) => setNewProd({ ...newProd, image: e.target.value })}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full px-4 py-2.5 rounded-xl border border-emerald-200 bg-white text-sm text-gray-900 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Base Price ($)
              </label>
              <input
                type="number"
                required
                value={newProd.basePrice}
                onChange={(e) => setNewProd({ ...newProd, basePrice: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-emerald-200 bg-white text-sm text-gray-900 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Color Name
              </label>
              <input
                type="text"
                required
                value={newProd.colorName}
                onChange={(e) => setNewProd({ ...newProd, colorName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-emerald-200 bg-white text-sm text-gray-900 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                3D Accent Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={newProd.primaryHex}
                  onChange={(e) => setNewProd({ ...newProd, primaryHex: e.target.value })}
                  className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <span className="font-mono text-xs text-gray-700 font-bold">{newProd.primaryHex}</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-600/20 hover:scale-105 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Publish to Live Footwear Catalog</span>
          </button>
        </form>
      )}
    </div>
  );
}
