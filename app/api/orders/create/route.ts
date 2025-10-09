"use server";

import { NextRequest, NextResponse } from "next/server";
import { backendClient } from "@/sanity/lib/backendClient";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { payment, metadata, items } = await req.json();

    if (!payment || !metadata || !items) {
      return NextResponse.json({ error: "Missing payment, metadata, or items" }, { status: 400 });
    }

    // Prepare products for Sanity
    const sanityProducts = items.map((item: any) => ({
      _key: crypto.randomUUID(),
      product: { _type: "reference", _ref: item.productId },
      quantity: item.quantity,
    }));

    // Prepare address
    const parsedAddress = metadata.address || null;

    // Create order in Sanity
    const order = await backendClient.create({
      _type: "order",
      orderNumber: metadata.orderNumber,
      razorpayPaymentId: payment.razorpay_payment_id,
      razorpayOrderId: payment.razorpay_order_id,
      razorpaySignature: payment.razorpay_signature || "",
      customerName: metadata.customerName,
      phoneNumber: metadata.phoneNumber || "",
      email: metadata.customerEmail,
      clerkUserId: metadata.clerkUserId,
      products: sanityProducts,
      totalPrice: payment.amount / 100,
      currency: payment.currency,
      amountDiscount: 0,
      status: "paid",
      orderDate: new Date().toISOString(),
      address: parsedAddress
        ? {
            state: parsedAddress.state,
            zip: parsedAddress.zip,
            city: parsedAddress.city,
            address: parsedAddress.address,
            name: parsedAddress.name,
          }
        : null,
    });

    // ✅ Update stock levels
    for (const item of items) {
      try {
        const productDoc = await backendClient.getDocument(item.productId);
        if (!productDoc || typeof productDoc.stock !== "number") continue;

        const newStock = Math.max(productDoc.stock - item.quantity, 0);
        await backendClient.patch(item.productId).set({ stock: newStock }).commit();
        console.log(`Stock updated for product ${item.productId}: ${newStock}`);
      } catch (err) {
        console.error(`Failed to update stock for ${item.productId}:`, err);
      }
    }

    return NextResponse.json({ success: true, orderId: order._id });
  } catch (err) {
    console.error("Failed to create order in Sanity:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
