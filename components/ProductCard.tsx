import { Product } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import { Flame, StarIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import AddToWishListButton from "./AddToWishListButton";
import { Title } from "./Title";
import PriceView from "./PriceView";
import AddToCartButton from "./AddToCartButton";
import { cn } from "@/lib/utils";

const ProductCard = ({ product }: { product: Product }) => {
  const productSlug = product.slug?.current || "";

  return (
    <div className="text-sm border border-dark_blue/20 rounded-md bg-white group relative overflow-hidden">
      {/* Image and badges */}
      <div className="relative">
        {/* Product Image Link */}
        <Link href={`/product/${product?.slug?.current}`} className="block">
          {product?.images && (
            <Image
              src={urlFor(product?.images[0]).url()}
              alt={product?.name || "Product Image"}
              loading="lazy"
              width={700}
              height={700}
              className={cn(
                "w-full h-64 object-contain overflow-hidden transition-transform bg-shop_light_bg hoverEffect cursor-pointer",
                product?.stock !== 0 ? "group-hover:scale-105" : "opacity-50"
              )}
            />
          )}
        </Link>

        {/* Wishlist Button */}
        <div onClick={(e) => e.stopPropagation()}>
          <AddToWishListButton product={product} />
        </div>

        {/* Status badges */}
        {product?.status === "sale" && (
          <p className="absolute top-2 left-2 z-10 text-xs border border-darkColor/50 px-2 rounded-full group-hover:border-shop_light_green group-hover:text-shop_light_green hoverEffect">
            Sale
          </p>
        )}
        {product?.status === "new" && (
          <p className="absolute top-2 left-2 z-10 text-xs border border-darkColor/50 px-2 rounded-full group-hover:border-shop_light_green group-hover:text-shop_light_green hoverEffect">
            New!
          </p>
        )}
        {product?.status === "hot" && (
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
        {/* Categories */}
        {product?.categories && (
          <p className="uppercase line-clamp-1 text-xs text-shop_light_text">
            {product.categories.map((cat: any) => cat.title).join(", ")}
          </p>
        )}

        {/* Title Link */}
        <Link href={`/product/${productSlug}`} className="block">
          <Title className="text-sm line-clamp-1 cursor-pointer">
            {product?.name}
          </Title>
        </Link>

        {/* Ratings */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, index) => (
              <StarIcon
                size={12}
                key={index}
                className={
                  index < (product.rating ?? 0)
                    ? "text-shop_lighter_green"
                    : "text-shop_lighter_text"
                }
              />
            ))}
          </div>
          <p className="text-shop_light_text text-xs tracking-wide">
            {product?.reviewsCount ?? 0} Reviews
          </p>
        </div>

        {/* Stock */}
        <div className="flex items-center gap-2.5">
          <p className="font-medium">
            {product?.stock > 0 ? "In Stock" : "Out of Stock"}
          </p>
          <p
            className={
              product?.stock > 0
                ? "text-shop_light_green font-semibold"
                : "text-red-600 font-semibold"
            }
          >
            {product?.stock > 0 ? product?.stock : "Unavailable"}
          </p>
        </div>

        {/* Price */}
        <PriceView
          price={product?.price}
          discount={product?.discount}
          className="text-sm"
        />

        {/* Add to Cart */}
        <div onClick={(e) => e.stopPropagation()}>
          <AddToCartButton product={product} className="w-36 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
