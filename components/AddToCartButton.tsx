'use client'

import { Product } from "@/sanity.types";
import React from "react";
import { Button } from "./ui/button";
import { ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  product: Product | null | undefined;
  className?: string;
}

const AddToCartButton = ({ product, className }: Props) => {
  const isOutOfStock = product?.stock === 0;
  const handleAddToCart = () =>{
    window.alert("Added to Cart");
  };

  return (
    <Button
    onClick={handleAddToCart}
      disabled={isOutOfStock}
      className={cn(
        "w-full text-medium bg-shop_dark_green/80 text-shop_light_bg font-semibold tracking-wide border border-shop_dark_green/80 shadow-none hover:text-white hover:bg-shop_dark_green hover:border-shop_dark_green hoverEffect",
        className
      )}
      variant="default" // 👈 ensures no default variant bg is applied
    >
      <ShoppingBag className="mr-2 h-5 w-5" />
      {isOutOfStock ? "Out of Stock" : "Add to Cart"}
    </Button>
  );
};

export default AddToCartButton;
