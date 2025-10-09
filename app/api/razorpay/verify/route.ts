import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

  const sign = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSign = crypto
    .createHmac("sha256", process.env.RAZOR_PAY_KEY_SECRET!)
    .update(sign)
    .digest("hex");

  const valid = expectedSign === razorpay_signature;

  return NextResponse.json({ valid });
}
