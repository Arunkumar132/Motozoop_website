import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if already subscribed
    const existing = await client.fetch(
      `*[_type == "subscriber" && email == $email][0]`,
      { email }
    );

    if (existing) {
      return NextResponse.json(
        { message: "You are already subscribed!" },
        { status: 200 }
      );
    }

    // Create a new subscriber in Sanity
    await client.create({
      _type: "subscriber",
      email,
    });

    return NextResponse.json(
      { message: "Subscription successful!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error subscribing:", error);
    return NextResponse.json(
      { error: "Failed to subscribe" },
      { status: 500 }
    );
  }
}
