import { backendClient } from "@/sanity/lib/backendClient";  // ✅ use backend client
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const doc = {
      _type: "franchise", // must match schema name in Sanity
      name: body.name,
      email: body.email,
      phone: body.phone,
      preferredLocation: body.location,
      investmentCapacity: Number(body.investment),
      message: body.message,
      submittedAt: new Date().toISOString(),
    };

    // ✅ Use backend client (with token)
    await backendClient.create(doc);

    return NextResponse.json(
      { success: true, message: "Enquiry saved to Sanity" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Sanity Save Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save enquiry" },
      { status: 500 }
    );
  }
}
  