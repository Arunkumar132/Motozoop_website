"use client";

import { Category, Product } from "@/sanity.types";
import React, { useEffect, useState, useCallback } from "react";
import Container from "./Container";
import { Title } from "./Title";
import { useSearchParams } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { Loader2, X } from "lucide-react";
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
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false); // ✅ Mobile filter toggle

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      let minPrice = 0;
      let maxPrice = 10000;

      if (selectedPrice) {
        const [min, max] = selectedPrice.split("-").map(Number);
        minPrice = min;
        maxPrice = max;
      }

      let query = "";

      if (selectedCategory) {
        query = `
          *[_type == 'product'
            && (
              references(*[_type == "category" && slug.current == $selectedCategory]._id)
              || subCategory == $selectedCategory
            )
            && price >= $minPrice 
            && price <= $maxPrice
          ] | order(name asc) {
            ...,
            category->{ title, slug },
            brand->{ title }
          }
        `;
      } else {
        query = `
          *[_type == 'product'
            && price >= $minPrice 
            && price <= $maxPrice
          ] | order(name asc) {
            ...,
            category->{ title, slug },
            brand->{ title }
          }
        `;
      }

      const data = await client.fetch(
        query,
        { selectedCategory, minPrice, maxPrice },
        { next: { revalidate: 0 } }
      );

      setProducts(data);
    } catch (error) {
      console.error("Shop product fetching Error:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedPrice]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleMainCategoryClick = (categorySlug: string) => {
    const newExpanded = new Set<string>();
    if (!expandedCategories.has(categorySlug)) {
      newExpanded.add(categorySlug);
    }
    setExpandedCategories(newExpanded);
    setSelectedCategory(
      selectedCategory === categorySlug ? null : categorySlug
    );
  };

  const handleSubCategoryClick = (
    subCategoryTitle: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    setSelectedCategory(
      selectedCategory === subCategoryTitle ? null : subCategoryTitle
    );
  };

  // Sidebar filter component reused for mobile & desktop
  const FilterSidebar = (
    <div className="w-full md:min-w-60 md:max-w-xs bg-gray-50 md:bg-transparent p-4 rounded-lg md:rounded-none shadow-sm md:shadow-none">
  
  {/* Product Categories */}
  <div className="mb-6 text-left border-b border-gray-200 pb-4">
    <h3 className="text-sm sm:text-base font-semibold text-black mb-3">
      Product Categories
    </h3>
    <div className="flex flex-col items-start gap-2">
      {categories?.map((cat) => (
        <div key={cat._id} className="w-full">
          <div
            onClick={() => handleMainCategoryClick(cat.slug?.current || "")}
            className="flex items-center justify-start gap-2 cursor-pointer text-xs sm:text-sm font-normal text-black hover:text-shop_dark_green transition-colors py-1"
          >
            <input
              type="checkbox"
              checked={selectedCategory === cat.slug?.current}
              readOnly
              className="w-4 h-4 border-gray-400 rounded-sm cursor-pointer pointer-events-none"
            />
            <span>{cat.title}</span>
          </div>

          {cat.subCategories &&
            cat.subCategories.length > 0 &&
            expandedCategories.has(cat.slug?.current || "") && (
              <div className="ml-4 mt-1 flex flex-col items-start gap-1">
                {cat.subCategories.map((sub) => (
                  <div
                    key={sub.slug?.current || sub.title}
                    onClick={(e) =>
                      handleSubCategoryClick(sub.title || "", e)
                    }
                    className="flex items-center justify-start gap-2 cursor-pointer text-xs font-light text-gray-700 hover:text-shop_dark_green transition-colors py-1"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategory === sub.title}
                      readOnly
                      className="w-3.5 h-3.5 border-gray-400 rounded-sm cursor-pointer pointer-events-none"
                    />
                    <span>{sub.title}</span>
                  </div>
                ))}
              </div>
            )}
        </div>
      ))}
    </div>
  </div>

  {/* Price Filter */}
  <div className="text-left">
    <h3 className="text-sm sm:text-base font-semibold text-black mb-3 border-b border-gray-200 pb-3">
      Price
    </h3>
    <div className="flex flex-col items-start gap-2 mt-2">
      {[{ label: "Under 200", value: "0-200" },
        { label: "200-500", value: "200-500" },
        { label: "500-1000", value: "500-1000" },
        { label: "1000-5000", value: "1000-5000" },
        { label: "Over 5000", value: "5000-1000000" }].map((price) => (
        <div
          key={price.value}
          onClick={() =>
            setSelectedPrice(selectedPrice === price.value ? null : price.value)
          }
          className="flex items-center justify-start gap-2 cursor-pointer text-xs sm:text-sm font-normal text-black hover:text-shop_dark_green transition-colors py-1"
        >
          <input
            type="checkbox"
            checked={selectedPrice === price.value}
            readOnly
            className="w-4 h-4 border-gray-400 rounded-sm cursor-pointer pointer-events-none"
          />
          <span>{price.label}</span>
        </div>
      ))}
    </div>
  </div>
</div>

  );

  return (
    <div className="border-t bg-white min-h-screen">
      <Container className="mt-4 sm:mt-6 pb-20">
        
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white py-3 sm:py-4 mb-4 sm:mb-5 border-b border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 px-2">
          <Title className="text-base sm:text-lg font-semibold uppercase tracking-wide text-gray-800">
            Shop Products
          </Title>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsFilterOpen(true)}
            className="md:hidden px-4 py-2 bg-shop_dark_green text-white text-sm rounded-lg shadow hover:bg-green-700 transition"
          >
            Sort & Filter
          </button>

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
          {/* Sidebar (Desktop) */}
          <aside className="hidden md:block md:sticky md:top-24 md:self-start">
            {FilterSidebar}
          </aside>

          {/* Product Grid */}
          <main className="flex-1 pt-1 sm:pt-2">
            {loading ? (
              <div className="p-10 sm:p-20 flex flex-col gap-3 items-center justify-center bg-white rounded-xl shadow-sm text-center">
                <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 text-shop_dark_green animate-spin" />
                <p className="text-sm sm:text-base font-medium text-gray-600">
                  Loading products...
                </p>
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <NoProductAvailable className="bg-white mt-2 sm:mt-0 p-8 sm:p-10 rounded-xl shadow-sm" />
            )}
          </main>
        </div>
      </Container>

      {/* Mobile Filter Modal */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50 backdrop-blur-sm transition-opacity duration-300">
          <div className="bg-white w-[90%] max-w-sm rounded-3xl shadow-xl p-6 relative overflow-y-auto max-h-[90vh]">
            
            {/* Close Button */}
            <button
              onClick={() => setIsFilterOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full p-1 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <h3 className="text-xl sm:text-2xl font-bold text-center mb-6 border-b pb-3 border-gray-200">
              Sort & Filter
            </h3>

            {/* Filter Content */}
            <div className="flex flex-col gap-6">
              {FilterSidebar}
            </div>

            {/* Apply Button */}
            <div className="mt-6">
              <button
                onClick={() => setIsFilterOpen(false)}
                className="w-full py-3 bg-shop_dark_green text-white font-semibold rounded-xl shadow hover:bg-green-700 transition-colors duration-200"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
