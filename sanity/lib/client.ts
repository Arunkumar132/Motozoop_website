import { createClient } from "next-sanity";

import imageUrlBuilder from "@sanity/image-url";


export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2025-01-01",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN, // For write operations
});

// Create a read-only client
export const readOnlyClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2025-01-01",
  useCdn: true, // Use CDN for better performance for reads
  token: process.env.SANITY_API_READ_TOKEN, // Read-only token
});


const builder = imageUrlBuilder(client);

export const urlFor = (source: any) => builder.image(source);