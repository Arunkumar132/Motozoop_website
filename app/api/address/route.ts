import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { getAuth } from "@clerk/nextjs/server";

const SANITY_WRITE_TOKEN = process.env.SANITY_API_WRITE_TOKEN;

// ───────────────────────────── GET: Fetch all addresses for the logged-in user
export async function GET(req: NextRequest) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json([], { status: 200 }); // Return empty array if not logged in
    }

    const addresses = await client.fetch(
      `*[_type == "address" && userId == $userId] | order(_createdAt desc)`,
      { userId },
      { token: SANITY_WRITE_TOKEN }
    );

    return NextResponse.json(addresses);
  } catch (err) {
    console.error("Failed to fetch addresses:", err);
    return NextResponse.json(
      { error: "Failed to fetch addresses" },
      { status: 500 }
    );
  }
}

// ───────────────────────────── POST: Add a new address
export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const body = await req.json();

    const createdAddress = await client.create(
      {
        _type: "address",
        userId, // Attach logged-in user
        ...body,
      },
      { token: SANITY_WRITE_TOKEN }
    );

    return NextResponse.json({ success: true, address: createdAddress });
  } catch (err) {
    console.error("Failed to add address:", err);
    return NextResponse.json(
      { success: false, error: "Failed to add address" },
      { status: 500 }
    );
  }
}

// ───────────────────────────── DELETE: Delete an address owned by the user
export async function DELETE(req: NextRequest) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const { id } = await req.json();

    // Verify ownership
    const address = await client.fetch(
      `*[_type == "address" && _id == $id && userId == $userId][0]`,
      { id, userId },
      { token: SANITY_WRITE_TOKEN }
    );

    if (!address) {
      return NextResponse.json(
        { success: false, error: "Address not found or not owned by user" },
        { status: 404 }
      );
    }

    await client.delete(id, { token: SANITY_WRITE_TOKEN });

    return NextResponse.json({ success: true, deleted: true });
  } catch (err) {
    console.error("Failed to delete address:", err);
    return NextResponse.json(
      { success: false, error: "Failed to delete address" },
      { status: 500 }
    );
  }
}
