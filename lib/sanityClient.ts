import { createClient } from "@sanity/client";
import imageUrlBuilder, { ImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

// ✅ Create Sanity client
export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

// ✅ Initialize builder
const builder: ImageUrlBuilder = imageUrlBuilder(client);

// ✅ Type-safe urlFor function
export const urlFor = (source: SanityImageSource) => builder.image(source);
