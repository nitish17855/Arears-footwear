import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import Stripe from "stripe";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" })
  : null;

export async function POST(req) {
  try {
    const body = await req.json();
    const { items, customerName, guestEmail, shippingAddress, discount = 0, useStripeTest = false } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 });
    }

    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shippingFee = subtotal >= 150 ? 0 : 15;
    const totalAmount = Math.max(0, subtotal - discount + shippingFee);

    // If Stripe test mode requested and Stripe key configured
    if (useStripeTest && stripe) {
      const lineItems = items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: `${item.name} (${item.color} - US ${item.size})`,
            metadata: { slug: item.slug, size: item.size, color: item.color }
          },
          unit_amount: Math.round(item.price * 100)
        },
        quantity: item.quantity
      }));

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        customer_email: guestEmail,
        success_url: `${req.headers.get("origin")}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.get("origin")}/checkout`
      });

      // Record order as pending in database
      const order = await db.createOrder({
        customerName,
        guestEmail,
        shippingAddress,
        items,
        totalAmount,
        subtotal,
        discount,
        stripeSessionId: session.id
      });

      return NextResponse.json({ url: session.url, orderId: order.id });
    }

    // Default Direct/Demo mode (works out of the box with zero external setup needed)
    const order = await db.createOrder({
      customerName,
      guestEmail,
      shippingAddress,
      items,
      totalAmount,
      subtotal,
      discount,
      stripeSessionId: `demo_tok_${Date.now()}`
    });

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: error.message || "Failed to process checkout" }, { status: 500 });
  }
}
