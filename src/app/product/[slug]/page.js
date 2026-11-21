import React, { Suspense } from "react";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import ProductDetailClient from "./ProductDetailClient";

export async function generateStaticParams() {
  const products = await db.getProducts();
  return products.map((p) => ({
    slug: p.slug
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await db.getProductBySlug(slug);
  if (!product) return { title: "Product Not Found // AREARS" };

  return {
    title: `${product.name} // AREARS Precision Footwear`,
    description: product.description
  };
}

// Inner async component where URL params are accessed within Suspense
async function ProductDetailsContent({ paramsPromise }) {
  const { slug } = await paramsPromise;
  const product = await db.getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const allProducts = await db.getProducts();
  const relatedProducts = allProducts.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <ProductDetailClient product={product} relatedProducts={relatedProducts} />
  );
}

export default function ProductDetailPage({ params }) {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-32 text-center space-y-4">
          <div className="w-10 h-10 mx-auto border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-mono font-bold text-emerald-800 uppercase tracking-widest">
            Calibrating Footwear Telemetry & 3D Canvas...
          </p>
        </div>
      }
    >
      <ProductDetailsContent paramsPromise={params} />
    </Suspense>
  );
}
