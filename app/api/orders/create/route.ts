"use server";

import { NextRequest, NextResponse } from "next/server";
import { backendClient } from "@/sanity/lib/backendClient";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { payment, metadata, items, totalPrice, invoiceId, invoiceNumber, hostedInvoiceUrl } = await req.json();

    if (!payment || !metadata || !items) {
      return NextResponse.json({ error: "Missing payment, metadata, or items" }, { status: 400 });
    }

    // Prepare products for Sanity
    const sanityProducts = items.map((item: any) => ({
      _key: crypto.randomUUID(),
      product: { _type: "reference", _ref: item._id },
      quantity: item.quantity,
      productName: item.name,
      productImage: item.image,
      discountedPrice: item.discountedPrice ?? item.price,
    }));

    // Map phone number from address form
    const parsedAddress = metadata.address || null;
    const phoneNumber = parsedAddress?.mobile || "";

    // Use totalPrice from client/cart if available
    const orderTotalPrice = totalPrice ?? sanityProducts.reduce((sum, item) => sum + (item.discountedPrice ?? 0) * item.quantity, 0);

    // Create order in Sanity
    const order = await backendClient.create({
      _type: "order",
      orderNumber: metadata.orderNumber,
      razorpayPaymentId: payment.razorpay_payment_id,
      razorpayOrderId: payment.razorpay_order_id,
      razorpaySignature: payment.razorpay_signature || "",
      customerName: metadata.customerName,
      phoneNumber,
      email: metadata.customerEmail,
      clerkUserId: metadata.clerkUserId,
      products: sanityProducts,
      totalPrice: orderTotalPrice,
      currency: payment.currency ?? "INR",
      amountDiscount: metadata.amountDiscount ?? 0,
      status: "paid",
      orderDate: new Date().toISOString(),
      address: parsedAddress
        ? {
            state: parsedAddress.state,
            zip: parsedAddress.zip,
            city: parsedAddress.city,
            address: parsedAddress.address,
            name: parsedAddress.name,
            mobile: parsedAddress.mobile,
          }
        : null,
      invoiceId: invoiceId || "",
      invoiceNumber: invoiceNumber || "",
      hostedInvoiceUrl: hostedInvoiceUrl || "",
    });

    // ✅ Update stock levels
    await Promise.all(
      items.map(async (item: any) => {
        try {
          const productDoc = await backendClient.getDocument(item._id);
          if (!productDoc || typeof productDoc.stock !== "number") return;

          const newStock = Math.max(productDoc.stock - item.quantity, 0);
          await backendClient.patch(item._id).set({ stock: newStock }).commit();
          console.log(`Stock updated for product ${item._id}: ${newStock}`);
        } catch (err) {
          console.error(`Failed to update stock for ${item._id}:`, err);
        }
      })
    );

    return NextResponse.json({ success: true, orderId: order._id });
  } catch (err) {
    console.error("Failed to create order in Sanity:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
