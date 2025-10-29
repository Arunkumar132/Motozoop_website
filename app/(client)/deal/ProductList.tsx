// app/(client)/deal/ProductList.tsx
"use client";

import React from "react";
import ProductCard from "@/components/ProductCard";
import { SanityDocument } from "@sanity/client";

// Define a more precise type for your product object
export interface Product extends SanityDocument {
  _id: string;
  title: string;
  price: number;
  image?: string;
  category?: string;
  description?: string;
  [key: string]: unknown; // for any optional Sanity fields
}

interface ProductListProps {
  products: Product[];
}

export default function ProductList({ products }: ProductListProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
      {products?.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
