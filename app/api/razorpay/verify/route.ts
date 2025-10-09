import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ valid: false, error: "Missing parameters" }, { status: 400 });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature === razorpay_signature) {
      return NextResponse.json({ valid: true });
    } else {
      return NextResponse.json({ valid: false, error: "Invalid signature" }, { status: 400 });
    }
  } catch (error: any) {
    console.error("Payment verification failed:", error);
    return NextResponse.json({ valid: false, error: error.message }, { status: 500 });
  }
}
