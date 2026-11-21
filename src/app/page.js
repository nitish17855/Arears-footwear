import React from "react";
import { db } from "@/lib/db";
import HomeClientWrapper from "@/components/HomeClientWrapper";

export default async function HomePage() {
  const products = await db.getProducts();

  return <HomeClientWrapper products={products} />;
}
