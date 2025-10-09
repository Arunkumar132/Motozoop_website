import Razorpay from "razorpay";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { metadata, amount } = body;

    if (!metadata || !amount) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const totalAmount = Math.round(amount * 100); // Convert INR → paise

    const order = await razorpay.orders.create({
      amount: totalAmount,
      currency: "INR",
      receipt: metadata.orderNumber,
      notes: {
        customerName: metadata.customerName,
        customerEmail: metadata.customerEmail,
        clerkUserId: metadata.clerkUserId?.toString() || "",
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: totalAmount,
      currency: order.currency,
      successUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/success?orderNumber=${metadata.orderNumber}`,
      cancelUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
    });
  } catch (error: any) {
    console.error("Razorpay order creation failed:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create Razorpay order" },
      { status: 500 }
    );
  }
}
