'use client'

import React from "react";
import { Button } from "./ui/button";
import { ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import useStore from "@/store";
import toast from "react-hot-toast";
import PriceFormatter from "./PriceFormatter";
import { Product } from "@/sanity.types";

interface AddToCartProps {
  product: Product;
  selectedColor?: string | null;
  className?: string;
}

// QuantityButtons Component
const QuantityButtons = ({
  product,
  selectedColor,
  maxCount = 0,
}: {
  product: Product;
  selectedColor?: string | null;
  maxCount?: number;
}) => {
  const { getItemCount, addItem, removeItem } = useStore();
  const itemCount = getItemCount(product?._id, selectedColor);

  const handleIncrease = () => {
    if (itemCount < maxCount) {
      addItem(product, selectedColor);
    } else {
      toast.error("Cannot add more items, stock limit reached.");
    }
  };

  const handleDecrease = () => {
    if (itemCount > 0) {
      removeItem(product?._id, selectedColor);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button onClick={handleDecrease} disabled={itemCount <= 0} className="w-8 h-8 text-lg font-bold">
        -
      </Button>
      <span className="w-6 text-center">{itemCount}</span>
      <Button onClick={handleIncrease} disabled={itemCount >= maxCount} className="w-8 h-8 text-lg font-bold">
        +
      </Button>
    </div>
  );
};

// AddToCartButton Component
const AddToCartButton = ({ product, selectedColor, className }: AddToCartProps) => {
  const { getItemCount, addItem } = useStore();
  const itemCount = getItemCount(product?._id, selectedColor);

  // Calculate stock properly
  const colorStock =
    selectedColor
      ? product?.colors?.find(c => c.colorName === selectedColor)?.stock ?? 0
      : product?.colors?.reduce((sum, c) => sum + (Number(c.stock) || 0), 0);

  const isOutOfStock = colorStock <= 0;

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // prevent parent Link navigation
    if (!product) return;

    if (itemCount < colorStock) {
      addItem(product, selectedColor);
      toast.success(
        `${product.name}${selectedColor ? ` (${selectedColor})` : ""} added to cart`
      );
    } else {
      toast.error("Cannot add more items, stock limit reached.");
    }
  };

  return (
    <div className="w-full h-12 flex items-center">
      {itemCount ? (
        <div className="text-sm w-full">
          <div className="flex items-center justify-between">
            <span className="text-xs text-darkColor/80">Quantity</span>
            <QuantityButtons product={product} selectedColor={selectedColor} maxCount={colorStock} />
          </div>
          <div className="flex items-center justify-between border-t pt-1">
            <span className="text-xs font-semibold">Subtotal</span>
            <PriceFormatter
              amount={product?.price ? product.price * itemCount : 0}
              className="text-sm font-semibold"
            />
          </div>
        </div>
      ) : (
        <Button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={cn(
            "w-full text-medium bg-shop_dark_green/80 text-shop_light_bg font-semibold tracking-wide border border-shop_dark_green/80 shadow-none hover:text-white hover:bg-shop_dark_green hover:border-shop_dark_green hoverEffect",
            className
          )}
          variant="default"
        >
          <ShoppingBag className="h-5 w-5" />
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </Button>
      )}
    </div>
  );
};

export default AddToCartButton;
