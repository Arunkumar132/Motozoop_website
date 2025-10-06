import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const created = await client.create({
      _type: "address",
      ...data,
    });
    return NextResponse.json({ success: true, address: created });
  } catch (error) {
    console.error("Failed to add address:", error);
    return NextResponse.json({ success: false, error: "Failed to add address" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await client.delete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete address:", error);
    return NextResponse.json({ success: false, error: "Failed to delete address" }, { status: 500 });
  }
}
