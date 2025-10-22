"use server";

import { NextRequest, NextResponse } from "next/server";
import { backendClient } from "@/sanity/lib/backendClient";
import crypto from "crypto";
import { sendOrderConfirmation } from "@/lib/email";
import { generateOrderId } from "@/components/orderid";

// --- Invoice ID Generator ---
const generateInvoiceId = () =>
  Math.floor(1000000000 + Math.random() * 9000000000).toString();

export async function POST(req: NextRequest) {
  try {
    const { payment, metadata, items, totalPrice } = await req.json();

    // --- Validation ---
    if (!payment || !metadata || !items?.length) {
      return NextResponse.json(
        { error: "Missing payment, metadata, or items" },
        { status: 400 }
      );
    }

    // --- Use existing orderId or generate new one ---
    const existingOrderId = metadata.orderNumber ?? generateOrderId();

    // --- Prepare products for Sanity ---
    const sanityProducts = items.map((item: any) => ({
      _key: crypto.randomUUID(),
      product: item.product,
      quantity: item.quantity,
      productName: item.productName,
      productImage: item.productImage,
      discountedPrice:
        item.discountedPrice ??
        item.product?.discountedPrice ??
        item.product?.price ??
        0,
    }));

    const parsedAddress = metadata.address ?? {};
    const phoneNumber = parsedAddress.mobile ?? "";

    // --- Compute total price ---
    const orderTotalPrice =
      totalPrice ??
      sanityProducts.reduce(
        (sum, item) => sum + (item.discountedPrice ?? 0) * (item.quantity ?? 1),
        0
      );

    // --- Create order in Sanity ---
    const order = await backendClient.create({
      _type: "order",
      orderNumber: existingOrderId, // 8-character order ID
      razorpayPaymentId: payment.razorpay_payment_id,
      razorpayOrderId: payment.razorpay_order_id,
      razorpaySignature: payment.razorpay_signature ?? "",
      customerName: metadata.customerName ?? "Unknown",
      phoneNumber,
      email: metadata.customerEmail ?? "",
      clerkUserId: metadata.clerkUserId ?? "",
      products: sanityProducts,
      totalPrice: metadata.totalPrice ?? orderTotalPrice,
      amountDiscount: metadata.amountDiscount ?? 0,
      invoiceId: metadata.invoiceId ?? generateInvoiceId(),
      status: "paid",
      orderDate: new Date().toISOString(),
      address: parsedAddress
        ? {
            name: parsedAddress.name ?? "",
            address: parsedAddress.address ?? "",
            city: parsedAddress.city ?? "",
            state: parsedAddress.state ?? "",
            zip: parsedAddress.zip ?? "",
            mobile: parsedAddress.mobile ?? "",
          }
        : null,
    });

    console.log(`✅ Order created successfully: ${order._id}`);
    console.log(`🧾 Order ID: ${existingOrderId}`);

    // --- Send confirmation email ---
    try {
      await sendOrderConfirmation(metadata.customerEmail, {
        id: existingOrderId,
        total: metadata.totalPrice ?? orderTotalPrice,
        items: sanityProducts.map((item) => ({
          name: item.productName,
          quantity: item.quantity,
        })),
      });
      console.log("📧 Order confirmation email sent successfully.");
    } catch (err: any) {
      console.error("❌ Failed to send order confirmation email:", err.message);
    }

    // --- Update stock levels ---
    await Promise.all(
      items.map(async (item: any) => {
        try {
          const productId = item.product?._ref || item._id;
          if (!productId) return;

          const productDoc = await backendClient.fetch(
            `*[_type == "product" && _id == $id][0]{ _id, title, stock }`,
            { id: productId }
          );
          if (!productDoc || typeof productDoc.stock !== "number") return;

          const newStock = Math.max(productDoc.stock - (item.quantity ?? 1), 0);

          await backendClient
            .patch(productId)
            .set({ stock: newStock })
            .commit({ autoGenerateArrayKeys: true });

          console.log(
            `✅ Stock updated for "${productDoc.title}" (${productId}): ${productDoc.stock} → ${newStock}`
          );
        } catch (err: any) {
          console.error(
            `❌ Failed to update stock for product ${item.product?._ref || "unknown"}: ${err.message}`
          );
        }
      })
    );

    // --- Get total number of orders for this user ---
    const ordersCount = await backendClient.fetch(
      `count(*[_type == "order" && clerkUserId == $userId])`,
      { userId: metadata.clerkUserId }
    );

    return NextResponse.json({
      success: true,
      orderId: existingOrderId,
      ordersCount,
    });
  } catch (err: any) {
    console.error("❌ Failed to create order in Sanity:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
