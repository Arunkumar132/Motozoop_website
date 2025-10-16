import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { getAuth } from "@clerk/nextjs/server"; // ✅ Clerk authentication
const SANITY_WRITE_TOKEN = process.env.SANITY_API_WRITE_TOKEN;

// ───────────────────────────── GET (Fetch user-specific addresses)
export async function GET(req: NextRequest) {
  try {
    const { userId } = getAuth(req); // ✅ Get user ID from Clerk

    if (!userId) {
      return NextResponse.json([], { status: 200 }); // Return empty array if not logged in
    }

    // Fetch addresses for the current user
    const data = await client.fetch(
      `*[_type == "address" && userId == $userId]`,
      { userId },
      { token: SANITY_WRITE_TOKEN }
    );

    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch addresses:", error);
    return NextResponse.json({ error: "Failed to fetch addresses" }, { status: 500 });
  }
}

// ───────────────────────────── POST (Add new address)
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

    // Create address linked to current user
    const created = await client.create(
      {
        _type: "address",
        userId, // ✅ Attach logged-in user
        ...body,
      },
      { token: SANITY_WRITE_TOKEN }
    );

    return NextResponse.json({ success: true, address: created });
  } catch (error) {
    console.error("Failed to add address:", error);
    return NextResponse.json({ success: false, error: "Failed to add address" }, { status: 500 });
  }
}

// ───────────────────────────── DELETE (Delete user-owned address)
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

    // Verify that this address belongs to the user
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
  } catch (error) {
    console.error("Failed to delete address:", error);
    return NextResponse.json({ success: false, error: "Failed to delete address" }, { status: 500 });
  }
}
