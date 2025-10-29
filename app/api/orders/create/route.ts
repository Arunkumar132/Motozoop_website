"use server";

import { NextRequest, NextResponse } from "next/server";
import { backendClient } from "@/sanity/lib/backendClient";
import crypto from "crypto";
import { sendOrderConfirmation } from "@/lib/email";
import { generateOrderId } from "@/components/orderid";
import { urlFor } from "@/sanity/lib/image";

// --- Types ---
interface Color {
  colorName?: string;
  images?: unknown[];
  stock?: number;
}

interface ProductDoc {
  _id: string;
  title?: string;
  colors?: Color[];
  price?: number;
  discountedPrice?: number;
}

interface OrderItem {
  product: { _id?: string; _ref?: string };
  quantity?: number;
  productName?: string;
  discountedPrice?: number;
  selectedColor?: string;
}

interface PaymentInfo {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature?: string;
}

interface Metadata {
  orderNumber?: string;
  customerName?: string;
  customerEmail?: string;
  clerkUserId?: string;
  totalPrice?: number;
  amountDiscount?: number;
  invoiceId?: string;
  address?: {
    name?: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    mobile?: string;
  };
}

interface ValidProduct {
  _key: string;
  product: { _type: "reference"; _ref: string };
  quantity: number;
  productName: string;
  productImage: string | null;
  discountedPrice: number;
  selectedColor: string;
}

// --- Invoice ID Generator ---
const generateInvoiceId = (): string =>
  Math.floor(1000000000 + Math.random() * 9000000000).toString();

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { payment, metadata, items, totalPrice }: {
      payment: PaymentInfo;
      metadata: Metadata;
      items: OrderItem[];
      totalPrice?: number;
    } = await req.json();

    // --- Validation ---
    if (!payment || !metadata || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Missing payment, metadata, or items" },
        { status: 400 }
      );
    }

    const existingOrderId = metadata.orderNumber ?? generateOrderId();

    // --- Prepare products for Sanity ---
    const sanityProducts = await Promise.all(
      items.map(async (item): Promise<ValidProduct | null> => {
        try {
          const productId = item.product?._id || item.product?._ref;
          if (!productId) return null;

          const productDoc = await backendClient.fetch<ProductDoc>(
            `*[_type == "product" && _id == $id][0]{ _id, title, colors[]{colorName, images, stock}, price, discountedPrice }`,
            { id: productId }
          );
          if (!productDoc) return null;

          const colorObj = Array.isArray(productDoc.colors)
            ? productDoc.colors.find(
                (c) =>
                  c.colorName?.trim().toLowerCase() ===
                  item.selectedColor?.trim().toLowerCase()
              )
            : null;

          const firstImage =
            colorObj?.images?.[0] ?? productDoc.colors?.[0]?.images?.[0] ?? null;

          const productImage = firstImage ? urlFor(firstImage).url() : null;

          return {
            _key: crypto.randomUUID(),
            product: { _type: "reference", _ref: productDoc._id },
            quantity: item.quantity ?? 1,
            productName: item.productName ?? productDoc.title ?? "",
            productImage,
            discountedPrice:
              item.discountedPrice ??
              productDoc.discountedPrice ??
              productDoc.price ??
              0,
            selectedColor: item.selectedColor ?? "",
          };
        } catch (err) {
          console.error("❌ Error preparing product:", err);
          return null;
        }
      })
    );

    const validProducts = sanityProducts.filter(
      (p): p is ValidProduct => p !== null
    );

    if (validProducts.length === 0) {
      return NextResponse.json(
        { error: "No valid products found in order" },
        { status: 400 }
      );
    }

    const parsedAddress = metadata.address ?? {};
    const phoneNumber = parsedAddress.mobile ?? "";

    const orderTotalPrice =
      totalPrice ??
      validProducts.reduce(
        (sum, item) =>
          sum + (item.discountedPrice ?? 0) * (item.quantity ?? 1),
        0
      );

    // --- Create order in Sanity ---
    const order = await backendClient.create({
      _type: "order",
      orderNumber: existingOrderId,
      razorpayPaymentId: payment.razorpay_payment_id,
      razorpayOrderId: payment.razorpay_order_id,
      razorpaySignature: payment.razorpay_signature ?? "",
      customerName: metadata.customerName ?? "Unknown",
      phoneNumber,
      email: metadata.customerEmail ?? "",
      clerkUserId: metadata.clerkUserId ?? "",
      products: validProducts,
      totalPrice: metadata.totalPrice ?? orderTotalPrice,
      amountDiscount: metadata.amountDiscount ?? 0,
      invoiceId: metadata.invoiceId ?? generateInvoiceId(),
      status: "paid",
      orderDate: new Date().toISOString(),
      address: {
        name: parsedAddress.name ?? "",
        address: parsedAddress.address ?? "",
        city: parsedAddress.city ?? "",
        state: parsedAddress.state ?? "",
        zip: parsedAddress.zip ?? "",
        mobile: parsedAddress.mobile ?? "",
      },
    });

    console.log(`✅ Order created successfully: ${order._id}`);

    // --- Send confirmation email ---
    try {
      await sendOrderConfirmation(metadata.customerEmail ?? "", {
        id: existingOrderId,
        total: orderTotalPrice,
        items: validProducts.map((item) => ({
          name: item.productName,
          quantity: item.quantity,
        })),
      });
      console.log("📧 Order confirmation email sent.");
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("❌ Email send failed:", message);
    }

    // --- Update stock for selected color ---
    await Promise.all(
      items.map(async (item): Promise<void> => {
        try {
          const productId = item.product?._id || item.product?._ref;
          if (!productId) return;

          const productDoc = await backendClient.fetch<ProductDoc>(
            `*[_type == "product" && _id == $id][0]{_id, title, colors}`,
            { id: productId }
          );

          if (!productDoc || !Array.isArray(productDoc.colors)) return;

          const colorIndex = productDoc.colors.findIndex(
            (c) =>
              c.colorName?.trim().toLowerCase() ===
              item.selectedColor?.trim().toLowerCase()
          );
          if (colorIndex === -1) return;

          const currentStock = productDoc.colors[colorIndex].stock ?? 0;
          const newStock = Math.max(currentStock - (item.quantity ?? 1), 0);

          await backendClient
            .patch(productId)
            .set({ [`colors[${colorIndex}].stock`]: newStock })
            .commit({ autoGenerateArrayKeys: true });

          console.log(
            `✅ Updated stock for ${productDoc.title} (${item.selectedColor}): ${currentStock} → ${newStock}`
          );
        } catch (err) {
          console.error("❌ Error updating stock:", err);
        }
      })
    );

    // --- Get total orders count for user ---
    const ordersCount = await backendClient.fetch<number>(
      `count(*[_type == "order" && clerkUserId == $userId])`,
      { userId: metadata.clerkUserId }
    );

    return NextResponse.json({
      success: true,
      orderId: existingOrderId,
      ordersCount,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("❌ Failed to create order:", message);
    return NextResponse.json(
      { error: message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
