import { backendClient } from "@/sanity/lib/backendClient";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = headers().get("x-razorpay-signature");
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!signature || !webhookSecret) {
      console.error("Webhook missing signature or secret");
      return NextResponse.json({ error: "Invalid webhook request" }, { status: 400 });
    }

    // Verify Razorpay webhook signature
    const expectedSignature = crypto.createHmac("sha256", webhookSecret).update(body, "utf8").digest("hex");
    if (signature !== expectedSignature) {
      console.error("Webhook signature mismatch");
      return NextResponse.json({ error: "Signature mismatch" }, { status: 400 });
    }

    const event = JSON.parse(body);
    console.log("Webhook event received:", event.event);

    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;
      const razorpayOrder = await razorpay.orders.fetch(payment.order_id);
      const notes = razorpayOrder.notes || {};
      console.log("Razorpay notes:", notes);

      // Validate required fields
      const requiredFields = ["orderNumber", "customerName", "customerEmail", "phoneNumber", "clerkUserId", "lineItems"];
      for (const field of requiredFields) {
        if (!notes[field]) {
          console.error(`Missing required field in notes: ${field}`);
          return NextResponse.json({ error: `Missing field: ${field}` }, { status: 400 });
        }
      }

      await createOrderInSanity(payment, notes);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Error handling Razorpay webhook:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// Function to create order in Sanity
async function createOrderInSanity(payment: any, notes: any) {
  try {
    const {
      orderNumber,
      customerName,
      customerEmail,
      phoneNumber,
      clerkUserId,
      address,
      lineItems,
    } = notes;

    const parsedAddress = address ? JSON.parse(address) : null;

    const sanityProducts: any[] = [];
    const stockUpdates: { productId: string; quantity: number }[] = [];

    (lineItems || []).forEach((item: any) => {
      if (!item.productId) return;

      sanityProducts.push({
        _key: crypto.randomUUID(),
        _type: "orderProduct",
        product: { _type: "reference", _ref: item.productId },
        quantity: item.quantity || 0,
      });

      stockUpdates.push({ productId: item.productId, quantity: item.quantity || 0 });
    });

    console.log("Creating order in Sanity:", {
      orderNumber,
      customerName,
      products: sanityProducts,
      totalPrice: payment.amount / 100,
    });

    const order = await backendClient.create({
      _type: "order",
      orderNumber,
      razorpayPaymentId: payment.id,
      razorpayOrderId: payment.order_id,
      razorpaySignature: payment.signature || "",
      customerName,
      phoneNumber,
      email: customerEmail,
      clerkUserId,
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

    console.log("Order successfully created in Sanity:", order._id);

    await updateStockLevels(stockUpdates);
  } catch (err) {
    console.error("Failed to create order in Sanity:", err);
    throw err;
  }
}

// Function to update stock
async function updateStockLevels(stockUpdates: { productId: string; quantity: number }[]) {
  for (const { productId, quantity } of stockUpdates) {
    try {
      const product = await backendClient.getDocument(productId);
      if (!product || typeof product.stock !== "number") continue;

      const newStock = Math.max(product.stock - quantity, 0);
      await backendClient.patch(productId).set({ stock: newStock }).commit();
      console.log(`Stock updated for product ${productId}: ${newStock}`);
    } catch (err) {
      console.error(`Failed to update stock for ${productId}:`, err);
    }
  }
}
