"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, Shield, Lock, UserCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await login(email, password);
    if (res.success) {
      if (res.user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/orders");
      }
    } else {
      setError(res.error || "Authentication failed");
      setLoading(false);
    }
  };

  const handleQuickDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-24 space-y-8">
      {/* Brand Icon */}
      <div className="text-center space-y-3">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-emerald-500 to-green-400 p-[1px] shadow-md shadow-emerald-500/20">
          <div className="w-full h-full bg-white rounded-[15px] flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-emerald-600" />
          </div>
        </div>
        <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">
          Arears Account
        </h1>
        <p className="text-xs text-gray-500">
          Sign in to access order tracking, 3D customizer preferences, and admin dashboard.
        </p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="p-8 rounded-3xl bg-white border border-emerald-100 shadow-xl shadow-emerald-950/5 space-y-5">
        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-600">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
            Email Address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="alex@example.com"
            className="w-full px-4 py-2.5 rounded-xl border border-emerald-200 bg-white text-sm text-gray-900 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-2.5 rounded-xl border border-emerald-200 bg-white text-sm text-gray-900 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
        >
          <Lock className="w-4 h-4" />
          <span>{loading ? "Authenticating..." : "Sign In to Account"}</span>
        </button>

        {/* Demo Fast Login Shortcuts */}
        <div className="pt-4 border-t border-emerald-100 space-y-2">
          <div className="text-[11px] font-bold text-gray-500 uppercase">
            One-Click Test Accounts:
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo("alex@example.com", "customer123")}
              className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-[11px] font-bold text-emerald-900 flex items-center justify-center gap-1.5 transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              Customer Demo
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo("admin@arearssneakers.com", "admin123")}
              className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-[11px] font-bold text-emerald-900 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              Admin Demo
            </button>
          </div>
        </div>
      </form>

      <div className="text-center text-xs text-gray-500">
        Don't have an account yet?{" "}
        <Link href="/register" className="text-emerald-700 font-bold hover:underline">
          Create one now
        </Link>
      </div>
    </div>
  );
}
