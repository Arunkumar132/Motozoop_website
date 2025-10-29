"use client";

import { useEffect, useState } from "react";
import HomeTabBar from "./HomeTabBar";
import { AnimatePresence, motion } from "motion/react";
import { Loader2 } from "lucide-react";
import NoProductAvailable from "./NoProductAvailable";
import ProductCard from "./ProductCard";
import { Product } from "@/sanity.types";
import { client } from "@/sanity/lib/client";
import { productTabs } from "@/sanity/schemaTypes/productType";

const ProductGrid = () => {
  const [selectedTab, setSelectedTab] = useState<string>(productTabs[0].value);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const query = `
          *[_type=="product" && variant==$variant] | order(_createdAt desc){
            _id,
            name,
            price,
            discount,
            variant,
            slug,
            status,
            category->{_id,title},
            colors[]{colorName, stock, images[]{asset->{_id,url}}}
          }
        `;
        const params = { variant: selectedTab };
        const response: Product[] = await client.fetch(query, params);
        setProducts(response);
      } catch (error) {
        console.error("Product fetching failed:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedTab]);

  return (
    <div>
      <HomeTabBar
        selectedTab={selectedTab}
        onTabSelect={setSelectedTab}
        categories={productTabs.map((tab) => tab.title)}
      />

      {loading ? (
        <div className="flex flex-col items-center justify-center py-10 min-h-[20rem] gap-4 bg-gray-100 w-full mt-10 rounded-lg">
          <div className="flex items-center gap-2 text-shop_dark_green">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading {selectedTab} products...</span>
          </div>
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 mt-10">
          {products.map((product) => (
            <AnimatePresence key={product._id}>
              <motion.div
                layout
                initial={{ opacity: 0.2 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ProductCard product={product} />
              </motion.div>
            </AnimatePresence>
          ))}
        </div>
      ) : (
        <NoProductAvailable selectedTab={selectedTab} />
      )}
    </div>
  );
};

export default ProductGrid;
