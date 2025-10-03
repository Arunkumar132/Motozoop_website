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
  className?: string;
}

const AddToCartButton = ({ product, className }: Props) => {
  const { addItem, getItemCount} = useStore();
  const itemCount = getItemCount(product?._id); 
  const isOutOfStock = product?.stock === 0;

  const handleAddToCart = () =>{
    if((product?.stock as number) > itemCount){
      addItem(product);
      toast.success(`${product?.name?.substring(0,20)} added successfully to cart`,
      );
    } else {
      toast.error("Can not add more items, stock limit reached.");
    }
  };

  return (
    <div className="w-full h-12 flex items-center">
      {itemCount ? (
        <div className="text-sm w-full">
          <div className="flex items-center justify-between">
            <span className="text-xs text-darkColor/80">Quantity</span>
            <QuantityButtons product={product} />
          </div>
          <div className="flex items-center justify-between border-t pt-1">
            <span className="text-xs font-semibold">Subtotal</span>
            <PriceFormatter 
              amount={product?.price ? product?.price * itemCount : 0}
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
          variant="default" // 👈 ensures no default variant bg is applied
        >
          <ShoppingBag className="mr-2 h-5 w-5" />
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </Button>
      )}
    </div>
  );
};

export default AddToCartButton;
