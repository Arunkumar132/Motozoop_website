'use client'

import { Product } from "@/sanity.types";
import React from "react";
import { Button } from "./ui/button";
import { ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import useStore from "@/store";
import toast from "react-hot-toast";
import PriceFormatter from "./PriceFormatter";
import QuantityButtons from "./QuantityButton";

interface Props {
  product: Product;
  selectedColor?: string;
  selectedStatue?: string;
  className?: string;
}

const AddToCartButton = ({ product, selectedColor, selectedStatue, className }: Props) => {
  const { addItem, getItemCount } = useStore();
  const itemCount = getItemCount(product?._id, selectedColor, selectedStatue);

  // Get stock for the selected color from colors array
  const colorStock = product?.colors?.find(c => c.colorName === selectedColor)?.stock ?? product?.stock ?? 0;
  const isOutOfStock = colorStock === 0;

  const handleAddToCart = () => {
    if (!product) return;

    if (itemCount < colorStock) {
      addItem(product, selectedColor, selectedStatue);
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
            <QuantityButtons product={product} selectedColor={selectedColor} selectedStatue={selectedStatue}/>
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
