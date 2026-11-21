"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await register(name, email, password);
    if (res.success) {
      router.push("/orders");
    } else {
      setError(res.error || "Registration failed");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-24 space-y-8">
      <div className="text-center space-y-3">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-emerald-500 to-green-400 p-[1px] shadow-md shadow-emerald-500/20">
          <div className="w-full h-full bg-white rounded-[15px] flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-emerald-600" />
          </div>
        </div>
        <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">
          Create Account
        </h1>
        <p className="text-xs text-gray-500">
          Join the Arears athlete network for exclusive release access and order tracking.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 rounded-3xl bg-white border border-emerald-100 shadow-xl shadow-emerald-950/5 space-y-5">
        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-600">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
            Full Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Marcus Sterling"
            className="w-full px-4 py-2.5 rounded-xl border border-emerald-200 bg-white text-sm text-gray-900 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
            Email Address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="marcus@example.com"
            className="w-full px-4 py-2.5 rounded-xl border border-emerald-200 bg-white text-sm text-gray-900 focus:outline-none focus:border-emerald-500"
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
            className="w-full px-4 py-2.5 rounded-xl border border-emerald-200 bg-white text-sm text-gray-900 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
        >
          <Lock className="w-4 h-4" />
          <span>{loading ? "Registering Account..." : "Create Free Account"}</span>
        </button>
      </form>

      <div className="text-center text-xs text-gray-500">
        Already registered?{" "}
        <Link href="/login" className="text-emerald-700 font-bold hover:underline">
          Sign In here
        </Link>
      </div>
    </div>
  );
}
