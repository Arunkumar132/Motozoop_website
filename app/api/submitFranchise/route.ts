import { NextResponse } from "next/server";
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN!,
  apiVersion: "2025-01-01", // or today's date
});

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Save document in Sanity
    const result = await client.create(data);

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
