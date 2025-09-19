"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import HomeBanner from "@/components/HomeBanner"; // Banner
import { cn } from "@/lib/utils";
import { Product } from "@/sanity.types";

// Example categories (replace with dynamic if needed)
const categories = [
  "Dashboard",
  "Interior",
  "Exterior",
  "Detailing",
  "Car Care Products",
];

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
    <div className="px-6 md:px-12 lg:px-20">
      {/* Banner */}
      <div className="bg-shop-light-pink rounded-lg mb-8">
        <HomeBanner />
      </div>

      {/* Categories */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex gap-5 flex-wrap">
          {categories.map((cat, index) => (
            <button
              key={index}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-semibold shadow-sm",
                index === 0
                  ? "bg-green-600 text-white"
                  : "bg-green-50 text-black"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
        <span className="text-sm font-medium cursor-pointer">See all</span>
      </div>

      {/* Products */}
      {products.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">No Product Available</h2>
          <p className="text-gray-600">
            We&apos;re sorry, but there are no products available at the moment.
          </p>
          <p className="text-green-600 mt-2">We&apos;re restocking shortly</p>
          <p className="text-gray-500 text-sm mt-1">
            Please check back later or explore other categories
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mb-10">
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
