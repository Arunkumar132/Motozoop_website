import { Product } from "@/sanity.types";
import { Heart } from "lucide-react";
import React, { useState } from "react";
import { cn } from "@/lib/utils";

const AddToWishListButton = ({
  product,
  className,
  onClick,
  isWished = false,
}: {
  product: Product;
  className?: string;
  onClick?: (product: Product) => void;
  isWished?: boolean;
}) => {
  const [wished, setWished] = useState(isWished);

  const handleClick = () => {
    setWished(!wished);
    if (onClick) onClick(product);
  };

  return (
    <div className={cn("absolute top-2 right-2 z-10", className)}>
      <button
        onClick={handleClick}
        aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
        className={cn(
          "p-2.5 rounded-full hover:bg-shop_dark_green hover:text-white hoverEffect",
          wished ? "bg-shop_dark_green text-white" : "bg-shop_lighter_bg"
        )}
      >
        <Heart size={15} fill={wished ? "currentColor" : "none"} />
      </button>
    </div>
  );
};

export default AddToWishListButton;
