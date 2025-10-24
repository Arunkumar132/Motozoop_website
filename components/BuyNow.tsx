"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import useStore from "@/store";
import toast from "react-hot-toast";
import { Product } from "@/sanity.types";

interface BuyNowProps {
  product: Product;
  selectedColor?: string | null;
}

const BuyNow: React.FC<BuyNowProps> = ({ product, selectedColor }) => {
  const router = useRouter();
  const { addItem, getItemCount } = useStore();

  // Get item count for this product + color
  const itemCount = getItemCount(product._id, selectedColor);

  // Get stock for the selected color or sum all colors
  const colorStock =
    selectedColor
      ? product?.colors?.find(c => c.colorName === selectedColor)?.stock ?? 0
      : product?.colors?.reduce((sum, c) => sum + (Number(c.stock) || 0), 0);

  const isOutOfStock = colorStock <= 0;

  const handleBuyNow = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // prevent parent link navigation

    if (isOutOfStock) {
      toast.error("Product is out of stock!");
      return;
    }

    // Add product to cart if not already added
    if (itemCount < colorStock) {
      addItem(product, selectedColor);
      toast.success(
        `${product.name}${selectedColor ? ` (${selectedColor})` : ""} added to cart`
      );
    } else {
      toast.error("Cannot add more items, stock limit reached.");
      return;
    }

    // Redirect to cart page
    router.push("/cart");
  };

  return (
    <div className="flex flex-col w-full gap-2">
      <button
        onClick={handleBuyNow}
        disabled={isOutOfStock}
        className="w-full h-12 flex items-center justify-center gap-3 bg-shop_orange hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ShoppingBag size={20} />
        <span className="text-lg font-semibold">
          {isOutOfStock ? "Out of Stock" : "Buy Now"}
        </span>
      </button>
    </div>
  );
};

export default BuyNow;
