// app/(client)/deal/ProductList.tsx
"use client";

import React from "react";
import ProductCard from "@/components/ProductCard";

type Props = {
  products: any[];
};

export default function ProductList({ products }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
      {products?.map((product: any) => (
        <ProductCard key={product?._id} product={product} />
      ))}
    </div>
  );
}
