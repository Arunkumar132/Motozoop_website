'use client';
import { cn } from "@/lib/utils";
import { Product } from "@/sanity.types";
import useStore from "@/store";
import { Heart } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const ProductSideMenu = ({product, className}:{
    product: Product;
    className?: string;
}) => {
    const {favoriteProduct,addToFavorite} = useStore();
    const [existingProduct, setExistingProduct] = useState<Product | null>(null);
    useEffect(() => {
        const availableProduct = favoriteProduct.find(
            (item) => item._id === product?._id
        );
        setExistingProduct(availableProduct || null);
    }, [favoriteProduct, product]);
    const handleFavorrite = (e: React.MouseEvent<SVGSVGElement>) => {
    e.preventDefault();
    if (product?._id) {
      addToFavorite(product).then(() => {
        toast.success(
          existingProduct ? `${product?.name?.substring(0,20)} - Removed from wishlist` : `${product?.name?.substring(0,20)} - Added to wishlist`
        );
      });
    }
  };
    return(
        <div className={cn("absolute top-2 right-2 flex flex-col gap-2 z-10 hover:cursor-pointer", className)}>
            <div 
                onClick={handleFavorrite}
                className={`p-2.5 rounded-full hover:bg-shop_dark_green hover:text-white  cursor-pointer ${existingProduct ? "bg-shop_dark_green/80 text-white" : "bg-lightColor/10 text-darkColor/80 hoverEffect"}`} 
            >
                <Heart size={15} />
            </div>
        </div>
    )
}

export default ProductSideMenu;