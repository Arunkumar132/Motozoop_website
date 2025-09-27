'use client'

import { Product } from "@/sanity.types";
import React from "react";
import { Button } from "./ui/button";
import { ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import useStore from "@/store";
import toast from "react-hot-toast";

interface Props {
  product: Product;
  className?: string;
}

const AddToCartButton = ({ product, className }: Props) => {
  const { addItem, getItemCount} = useStore();
  const itemCount = getItemCount(product?._id); 
  const isOutOfStock = product?.stock === 0;

  const handleAddToCart = () =>{
    if((product?.stock as number) > itemCount){
      addItem(product);
      toast.success(`${product?.name?.substring(0,12)}... added successfully to cart`,
      );
    } else {
      toast.error("Can not add more items, stock limit reached.");
    }
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
