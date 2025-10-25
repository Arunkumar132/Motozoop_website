import { Product } from "@/sanity.types";
import useStore from "@/store";
import React from "react";
import { Button } from "./ui/button";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface Props {
  product: Product;
  className?: string;
}

const QuantityButtons = ({ product, className }: Props) => {
  const { addItem, removeItem, getItemCount } = useStore();
  const itemCount = getItemCount(product?._id);
  const isOutOfStock = (product?.stock ?? 0) === 0;

  const handleRemoveItem = () => {
    if (itemCount > 0) {
      removeItem(product?._id);
      if (itemCount > 1) {
        toast.success(`${product?.name?.substring(0, 20)} - Quantity decreased`);
      } else {
        toast.success(`${product?.name?.substring(0, 20)} removed from cart`);
      }
    }
  };

  const handleAddToCart = () => {
    if ((product?.stock ?? 0) > itemCount) {
      addItem(product);
      toast.success(`${product?.name?.substring(0, 20)} - Quantity increased`);
    } else {
      toast.error("Cannot add more items, stock limit reached.");
    }
  };

  return (
    <div className={cn("flex items-center gap-1 pb-1 text-base", className)}>
      <Button
        variant="outline"
        size="icon"
        disabled={itemCount === 0 || isOutOfStock}
        className="w-6 h-6 bg-white text-shop_dark_green hover:bg-shop_dark_green/10 hover:text-shop_dark_green hoverEffect shadow-none border-none"
        onClick={handleRemoveItem}
      >
        <Minus className="w-4 h-4" />
      </Button>

      <span className="font-semibold text-sm w-6 text-center text-darkColor">{itemCount}</span>

      <Button
        variant="outline"
        size="icon"
        disabled={isOutOfStock}
        className="w-6 h-6 bg-white text-shop_dark_green hover:bg-shop_dark_green/10 hover:text-shop_dark_green hoverEffect shadow-none border-none"
        onClick={handleAddToCart}
      >
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default QuantityButtons;
