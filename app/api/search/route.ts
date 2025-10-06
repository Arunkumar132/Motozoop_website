import { NextResponse } from "next/server";
import { client } from "@/lib/sanityClient";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "";
    if (query.length < 2) return NextResponse.json({ products: [] });

    const products = await client.fetch(
      `*[_type=="product" && name match $q]{
        _id,
        name,
        "slug": slug,
        "imageUrl": image.asset->url,
        price
      }`,
      { q: `*${query}*` }
    );

    return NextResponse.json({ products });
  } catch (err) {
    console.error("Search API error:", err);
    return NextResponse.json({ products: [], error: "Search failed" }, { status: 500 });
  }
}
