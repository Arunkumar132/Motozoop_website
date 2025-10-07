import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

const SANITY_WRITE_TOKEN = process.env.SANITY_API_WRITE_TOKEN;

export async function GET() {
  try {
    // Fetch all addresses
    const data = await client.fetch(`*[_type == "address"]`, {}, { token: SANITY_WRITE_TOKEN });
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch addresses:", error);
    return NextResponse.json({ error: "Failed to fetch addresses" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const created = await client.create(
      { _type: "address", ...body },
      { token: SANITY_WRITE_TOKEN }
    );
    return NextResponse.json({ success: true, address: created });
  } catch (error) {
    console.error("Failed to add address:", error);
    return NextResponse.json({ success: false, error: "Failed to add address" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    await client.delete(id, { token: SANITY_WRITE_TOKEN });
    return NextResponse.json({ success: true, deleted: true });
  } catch (error) {
    console.error("Failed to delete address:", error);
    return NextResponse.json({ success: false, error: "Failed to delete address" }, { status: 500 });
  }
}
