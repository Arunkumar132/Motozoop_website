import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, metadata } = body;

    const razorpay = new Razorpay({
      key_id: process.env.RAZOR_PAY_KEY_ID!,
      key_secret: process.env.RAZOR_PAY_KEY_SECRET!,
    });

    const order = await razorpay.orders.create({
      amount: amount * 100, // Razorpay works in paise
      currency: "INR",
      receipt: metadata.orderNumber,
      notes: metadata,
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error: any) {
    console.error("Razorpay order error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
