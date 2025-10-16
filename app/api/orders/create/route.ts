"use server";

import { NextRequest, NextResponse } from "next/server";
import { backendClient } from "@/sanity/lib/backendClient";
import crypto from "crypto";

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

    // --- Generate unique order number ---
    const generateOrderNumber = () => {
      const letters = Array.from({ length: 5 }, () =>
        String.fromCharCode(65 + Math.floor(Math.random() * 26))
      ).join("");
      const digits = Math.floor(100 + Math.random() * 900); // 3 digits
      return `${letters}${digits}`;
    };

    const generateInvoiceId = () => {
      // Generate a random 10-digit number as a string
      return Math.floor(1000000000 + Math.random() * 9000000000).toString();
    };


    const orderNumber = metadata.orderNumber ?? generateOrderNumber();

    // --- Prepare products for Sanity ---
    const sanityProducts = items.map((item: any) => ({
      _key: crypto.randomUUID(),
      product: item.product, // Expecting _type: "reference", _ref: productId
      quantity: item.quantity,
      productName: item.productName,
      productImage: item.productImage,
      discountedPrice:
        item.discountedPrice ??
        item.product?.discountedPrice ??
        item.product?.price ??
        0,
    }));

    // --- Parse address ---
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
      orderNumber,
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
      invoiceId: generateInvoiceId(),
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
    console.log(`🧾 Invoice ID: ${order.invoiceid}`);


    // --- Update stock levels ---
    await Promise.all(
      items.map(async (item: any) => {
        try {
          // Correct way to get product ID from reference
          const productId = item.product?._ref || item._id;
          if (!productId) {
            console.warn("⚠️ No valid product ID found for item:", item);
            return;
          }

          // Fetch current stock from Sanity
          const productDoc = await backendClient.fetch(
            `*[_type == "product" && _id == $id][0]{ _id, title, stock }`,
            { id: productId }
          );

          if (!productDoc) {
            console.warn(`⚠️ Product not found for ID: ${productId}`);
            return;
          }

          if (typeof productDoc.stock !== "number") {
            console.warn(`⚠️ Invalid stock field for product ${productId}`);
            return;
          }

          // Calculate new stock
          const newStock = Math.max(productDoc.stock - (item.quantity ?? 1), 0);

          // Update stock in Sanity
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

    return NextResponse.json({ success: true, orderId: order._id });
  } catch (err: any) {
    console.error("❌ Failed to create order in Sanity:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
