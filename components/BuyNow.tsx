"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import useStore from "@/store";
import toast from "react-hot-toast";
import { Product } from "@/sanity.types";

interface BuyNowProps {
  product: Product;
}

const BuyNow: React.FC<BuyNowProps> = ({ product }) => {
  const router = useRouter();
  const { addItem, getItemCount } = useStore();
  const itemCount = getItemCount(product._id);

  const handleBuyNow = () => {
    // Add product to cart if not already added
    if (itemCount === 0) {
      if ((product.stock as number) > 0) {
        addItem(product);
        toast.success(`${product.name?.substring(0, 20)} added to cart`);
      } else {
        toast.error("Product is out of stock!");
        return;
      }
    }

    // Redirect to cart page
    router.push("/cart");
  };

  return (
    <div className="flex flex-col w-full gap-2"> {/* Stack buttons with minimal gap */}
      <button
        onClick={handleBuyNow}
        className="w-full flex items-center justify-center gap-3 bg-shop_orange hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition duration-200"
      >
        <ShoppingBag size={20} />
        <span className="text-lg font-semibold">Buy Now</span>
      </button>
    </div>
  );
};

export default BuyNow;
