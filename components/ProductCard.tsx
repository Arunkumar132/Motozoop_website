"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { Title } from "./Title";
import PriceView from "./PriceView";
import ProductSideMenu from "./ProductSideMenu";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const productSlug = product.slug?.current || "";

  // Safe first color and image
  const firstColor = product.colors?.[0];
  const firstImage = firstColor?.images?.[0];
  const imageUrl = firstImage?.asset ? urlFor(firstImage).url() : null;

  // Total stock calculation
  const totalStock =
    product.colors?.reduce((sum, color) => {
      const stock = Number(color?.stock ?? 0);
      return sum + (isNaN(stock) ? 0 : stock);
    }, 0) ?? 0;

  const isInStock = totalStock > 0;

  return (
    <div className="text-sm border border-dark_blue/20 rounded-md bg-white group relative overflow-hidden">
      {/* Image and badges */}
      <div className="relative">
        <Link href={`/product/${productSlug}`} className="block">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name || "Product Image"}
              loading="lazy"
              width={700}
              height={700}
              className={cn(
                "w-full h-64 object-contain overflow-hidden transition-transform bg-shop_light_bg hoverEffect cursor-pointer",
                isInStock ? "group-hover:scale-105" : "opacity-50"
              )}
            />
          ) : (
            <div className="w-full h-64 flex items-center justify-center bg-gray-100 text-gray-500">
              No Image
            </div>
          )}
        </Link>

        <ProductSideMenu product={product} />

        {/* Status badges */}
        {["sale", "new"].includes(product.status || "") && (
          <p className="absolute top-2 left-2 z-10 text-xs border border-darkColor/50 px-2 rounded-full group-hover:border-shop_light_green group-hover:text-shop_light_green hoverEffect">
            {product.status === "sale" ? "Sale" : "New!"}
          </p>
        )}

        {product.status === "hot" && (
          <Link
            href="/deal"
            className="absolute top-2 left-2 z-10 text-xs border border-darkColor/50 px-2 rounded-full group-hover:border-shop_light_green group-hover:text-shop_light_green hoverEffect"
            onClick={(e) => e.stopPropagation()}
          >
            <Flame
              size={18}
              fill="#fb6c08"
              className="text-shop_orange/50 group-hover:text-shop_orange hoverEffect"
            />
          </Link>
        )}
      </div>

      {/* Product info */}
      <div className="p-3 flex flex-col gap-2">
        {/* Category */}
        {product.category?.title && (
          <p className="uppercase line-clamp-1 text-xs text-shop_light_text">
            {product.category.title}
          </p>
        )}

        {/* Product title */}
        <Link href={`/product/${productSlug}`} className="block">
          <Title className="text-sm line-clamp-1 cursor-pointer">
            {product.name}
          </Title>
        </Link>

        {/* Stock info */}
        <div className="flex items-center gap-2.5">
          <p className="font-medium">{isInStock ? "In Stock" : "Out of Stock"}</p>
          <p
            className={cn(
              "font-semibold",
              isInStock ? "text-shop_light_green" : "text-red-600"
            )}
          >
            {isInStock ? totalStock : "Unavailable"}
          </p>
        </div>

        {/* Price */}
        <PriceView
          price={product.price ?? 0}
          discount={product.discount ?? 0}
          className="text-sm"
        />
      </div>
    </div>
  );
};

export default ProductCard;
