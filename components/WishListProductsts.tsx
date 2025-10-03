"use client";
import useStore from "@/store";
import React, { useState } from "react";
import Container from "./Container";
import { Heart, X } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image"; 
import PriceFormatter from "./PriceFormatter";
import toast from "react-hot-toast";
import AddToCartButton from "./AddToCartButton";

const WishListProducts = () => {
  const [visibleProducts, setVisibleProducts] = useState(10);
  const { favoriteProduct, removeFromFavorite, resetFavorite } = useStore();

  const handleResetWishlist = () => {
    const confirmReset = window.confirm("Are you sure you want to reset your wishlist?");
    if (confirmReset) {
      resetFavorite();
      toast.success("Wishlist has been reset");
    }
  };

  const loadMore = () => {
    setVisibleProducts((prev) =>
      Math.min(prev + 5, favoriteProduct.length)
    );
  };

  return (
    <Container>
      {favoriteProduct?.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="border-b">
                <tr className="bg-black/5">
                  <th className="p-2 text-left">Image</th>
                  <th className="p-2 text-left hidden md:table-cell">Category</th>
                  <th className="p-2 text-left hidden md:table-cell">Status</th>
                  <th className="p-2 text-left">Price</th>
                  <th className="p-2 text-center md:text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {favoriteProduct?.slice(0, visibleProducts)?.map((product) => (
                  <tr key={product?._id} className="border-b hover:bg-gray-50">
                    <td className="px-2 py-4 flex items-center gap-2">
                      <X
                        onClick={() => {
                          removeFromFavorite(product?._id);
                          toast.success("Product removed from wishlist");
                        }}
                        size={18}
                        className="hover:text-red-600 hover:cursor-pointer hoverEffect"
                      />
                      {product?.images && (
                        <Link
                          href={`/product/${product?.slug?.current}`}
                          className="border rounded-md group hidden md:inline-flex"
                        >
                          <Image
                            src={urlFor(product?.images[0]).url()}
                            alt={"product image"}
                            width={80}
                            height={80}
                            className="rounded-md group-hover:scale-105 hoverEffect h-20 w-20 object-contain"
                          />
                        </Link>
                      )}
                      <p className="line-clamp-1">{product?.name}</p>
                    </td>
                    <td className="p-2 capitalize hidden md:table-cell">
                      {product?.categories && (
                        <p>{product.categories.map((cat) => cat).join(",")}</p>
                      )}
                    </td>
                    <td
                      className={`p-2 w-24 ${
                        (product?.stock as number) > 0
                          ? "text-green-600"
                          : "text-red-600"
                      } font-medium text-sm hidden md:table-cell`}
                    >
                      {(product?.stock as number) > 0 ? "In Stock" : "Out of Stock"}
                    </td>
                    <td className="p-2">
                      <PriceFormatter amount={product?.price} />
                    </td>
                    <td className="p-2">
                      <AddToCartButton product={product} className="w-full" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Buttons Section */}
          <div className="flex items-center justify-between w-full my-5">
            {/* Left side buttons (Load More / Show Less) */}
            <div className="flex items-center gap-2">
              {visibleProducts < favoriteProduct?.length && (
                <Button variant="outline" onClick={loadMore}>
                  Load More
                </Button>
              )}
              {visibleProducts > 10 && (
                <Button onClick={() => setVisibleProducts(10)} variant="outline">
                  Show Less
                </Button>
              )}
            </div>

            {/* Right side button (Reset Wishlist) */}
            {favoriteProduct?.length > 0 && (
              <Button
                onClick={handleResetWishlist}
                variant="destructive"
                className="font-semibold"
                size="sm"
              >
                Reset Wishlist
              </Button>
            )}
          </div>
        </>
      ) : (
        <div className="flex min-h-[400px] flex-col items-center justify-center space-y-6 px-4 text-center">
          <div className="relative mb-4">
            <div className="absolute -top-1 -right-1 h-4 w-4 animate-ping rounded-full bg-muted-foreground/20"></div>
            <Heart className="h-12 w-12 text-muted-foreground" strokeWidth={1.5} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">
              Your wishlist is empty
            </h2>
            <p className="text-sm text-muted-foreground">
              Items added to your wishlist will appear here
            </p>
          </div>
          <Button asChild>
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>
      )}
    </Container>
  );
};

export default WishListProducts;
