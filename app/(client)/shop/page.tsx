"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { Product } from "@/sanity/types";
import { cn } from "@/lib/utils";


const ShopPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const query = `*[_type == "product"]{
        _id,
        name,
        images[]{asset->{_id, url}},
        price,
        description
      }`;

      try {
        const data: Product[] = await client.fetch(query);
        console.log("Fetched products:", data);
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[20rem]">
        <p>Loading products...</p>
      </div>
    );

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5">ShopPage</h1>

      {products.length === 0 ? (
        <p>No products found</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((product) => {
            const imageUrl = product.images?.[0]?.asset?.url;

            return (
              <div
                key={product._id}
                className="border rounded-lg p-3 flex flex-col items-center hover:shadow-lg transition-shadow"
              >
                {imageUrl && (
                  <div className="relative w-full h-40 mb-3 rounded overflow-hidden">
                    <Image
                      src={imageUrl}
                      alt={product.name || "Product"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                )}
                <h2 className="font-semibold text-lg">{product.name}</h2>
                {product.price && (
                  <p className="text-green-700 font-medium mt-1">
                    ${product.price.toFixed(2)}
                  </p>
                )}
                {product.description && (
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                    {product.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ShopPage;
