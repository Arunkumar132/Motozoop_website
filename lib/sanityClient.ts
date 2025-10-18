import { createClient } from "@sanity/client";

import imageUrlBuilder from "@sanity/image-url";


export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});


const builder = imageUrlBuilder(client);

export const urlFor = (source: any) => builder.image(source);