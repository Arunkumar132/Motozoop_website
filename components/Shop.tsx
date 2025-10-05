"use client";

import { Category, Product } from "@/sanity.types";
import React, { useEffect, useState } from "react";
import Container from "./Container";
import { Title } from "./Title";
import { useSearchParams } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { Loader2 } from "lucide-react";
import NoProductAvailable from "./NoProductAvailable";
import ProductCard from "./ProductCard";

interface Props {
  categories: Category[];
}

const Shop = ({ categories }: Props) => {
  const searchParams = useSearchParams();
  const categoryParams = searchParams.get("category");
  const priceParams = searchParams.get("price");

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    categoryParams || null
  );
  const [selectedPrice, setSelectedPrice] = useState<string | null>(
    priceParams || null
  );

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let minPrice = 0;
      let maxPrice = 10000;

      if (selectedPrice) {
        const [min, max] = selectedPrice.split("-").map(Number);
        minPrice = min;
        maxPrice = max;
      }

      const query = `
        *[_type == 'product'
          && (!defined($selectedCategory) || references(*[_type == "category" && slug.current == $selectedCategory]._id))
          && price >= $minPrice && price <= $maxPrice
        ] | order(name asc) {
          ...,
          "categories": categories[]->title
        }
      `;

      const data = await client.fetch(
        query,
        { selectedCategory, minPrice, maxPrice },
        { next: { revalidate: 0 } }
      );

      setProducts(data);
    } catch (error) {
      console.log("Shop product fetching Error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedPrice]);

  return (
    <div className="border-t bg-white">
      <Container className="mt-4 sm:mt-6">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white py-3 sm:py-4 mb-4 sm:mb-5 border-b border-gray-200 flex items-center justify-between px-2">
          <Title className="text-base sm:text-lg font-semibold uppercase tracking-wide text-gray-800">
            Shop Products
          </Title>
          {(selectedCategory !== null || selectedPrice !== null) && (
            <button
              onClick={() => {
                setSelectedCategory(null);
                setSelectedPrice(null);
              }}
              className="text-xs sm:text-sm font-medium text-shop_dark_green hover:text-red-600 transition-colors underline"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Layout */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <aside className="md:sticky md:top-24 md:self-start md:h-[calc(100vh-160px)] md:min-w-60 md:max-w-xs bg-gray-50 md:bg-transparent p-4 md:p-2 rounded-lg md:rounded-none shadow-sm md:shadow-none">
            {/* Product Categories */}
            <div className="mb-6">
              <h3 className="text-sm sm:text-base font-semibold text-black mb-3">
                Product Categories
              </h3>
              <div className="flex flex-wrap md:flex-col gap-2">
                {categories?.map((cat) => (
                  <label
                    key={cat._id}
                    onClick={() =>
                      setSelectedCategory(
                        selectedCategory === cat.slug?.current
                          ? null
                          : cat.slug?.current || null
                      )
                    }
                    className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm font-normal text-black"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategory === cat.slug?.current}
                      readOnly
                      className="w-4 h-4 border-gray-400 rounded-sm"
                    />
                    {cat.title}
                  </label>
                ))}
              </div>
            </div>

            {/* Price */}
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-black mb-3">
                Price
              </h3>
              <div className="flex flex-wrap md:flex-col gap-2">
                {[
                  { label: "Under 200", value: "0-200" },
                  { label: "200-500", value: "200-500" },
                  { label: "500-1000", value: "500-1000" },
                  { label: "1000-5000", value: "1000-5000" },
                  { label: "Over 5000", value: "5000-10000" },
                ].map((price) => (
                  <label
                    key={price.value}
                    onClick={() =>
                      setSelectedPrice(
                        selectedPrice === price.value ? null : price.value
                      )
                    }
                    className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm font-normal text-black"
                  >
                    <input
                      type="checkbox"
                      checked={selectedPrice === price.value}
                      readOnly
                      className="w-4 h-4 border-gray-400 rounded-sm"
                    />
                    {price.label}
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1 pt-1 sm:pt-2">
            <div className="h-auto md:h-[calc(100vh-160px)] overflow-y-auto md:pr-2 scrollbar-hide pb-10">
              {loading ? (
                <div className="p-16 sm:p-20 flex flex-col gap-3 items-center justify-center bg-white rounded-xl shadow-sm">
                  <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 text-shop_dark_green animate-spin" />
                  <p className="text-sm sm:text-base font-medium text-gray-600">
                    Loading products...
                  </p>
                </div>
              ) : products.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                  {products?.map((product) => (
                    <ProductCard key={product?._id} product={product} />
                  ))}
                </div>
              ) : (
                <NoProductAvailable className="bg-white mt-2 sm:mt-0 p-8 sm:p-10 rounded-xl shadow-sm" />
              )}
            </div>
          </main>
        </div>
      </Container>
    </div>
  );
};

export default Shop;
