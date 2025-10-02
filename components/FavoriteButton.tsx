'use client';

import { Heart } from "lucide-react";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Product } from "@/sanity.types";
import useStore from "@/store";
import toast from "react-hot-toast";

const FavoriteButton = ({
  showProduct = false,
  product,
}: {
  showProduct?: boolean;
  product?: Product;
}) => {
  const { favoriteProduct, addToFavorite } = useStore();
  const [existingProduct, setExistingProduct] = useState<Product | null>(null);

  useEffect(() => {
    const availableProduct = favoriteProduct.find(
      (item) => item._id === product?._id
    );
    setExistingProduct(availableProduct || null);
  }, [favoriteProduct, product]);

  const handleFavorite = (e: React.MouseEvent<SVGSVGElement>) => {
    e.preventDefault();
    if (product?._id) {
      addToFavorite(product).then(() => {
        toast.success(
          existingProduct ? `${product?.name?.substring(0,20)} - Removed from wishlist` : `${product?.name?.substring(0,20)} - Added to wishlist`
        );
      });
    }
  };

  return (
    <>
      {!showProduct ? (
        <Link href="/wishlist" className="group relative">
          <Heart className="w-5 h-5 hover:text-shop_light_green transition-colors duration-200" />
          <span className="absolute -top-1 -right-1 bg-shop_dark_green text-white h-3.5 w-3.5 rounded-full text-xs font-semibold flex items-center justify-center">
            {favoriteProduct?.length ? favoriteProduct.length : 0}
          </span>
        </Link>
      ) : (
        <Heart
          onClick={handleFavorite}
          className={`w-5 h-5 cursor-pointer transition-transform duration-200 hover:scale-110 ${
            existingProduct
              ? "text-shop_dark_green fill-shop_dark_green" // filled if in wishlist
              : "text-shop_light_green/60 hover:text-shop_light_green" // outlined otherwise
          }`}
        />
      )}
    </>
  );
};

export default FavoriteButton;
