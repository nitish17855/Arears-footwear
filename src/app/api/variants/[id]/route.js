import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { stockQuantity } = body;

    const updated = await db.updateVariantStock(id, stockQuantity);
    if (!updated) {
      return NextResponse.json({ error: "Variant not found" }, { status: 404 });
    }

    return NextResponse.json({ variant: updated });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
