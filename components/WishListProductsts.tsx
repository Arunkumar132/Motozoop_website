"use client";
import useStore from "@/store";
import React, { useState } from "react";
import Container from "./Container";
import { Heart, Trash } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image"; 
import PriceFormatter from "./PriceFormatter";

const WishListProducts = () => {
  const [visibleProducts, setVisibleProducts] = useState(7);
  const { favoriteProduct, removeFromFavorite, resetFavorite } = useStore();

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
                  <th className="p-2 text-left hidden md:table-cell">Type</th>
                  <th className="p-2 text-left hidden md:table-cell">Status</th>
                  <th className="p-2 text-left">Price</th>
                  <th className="p-2 text-center md:text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {favoriteProduct.slice(0, visibleProducts).map((product) => (
                  <tr key={product._id} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      {product?.images && (
                        <Link href={`/product/${product?.slug?.current}`}>
                          <Image
                            src={urlFor(product?.images[0]).url()}
                            alt={product?.name}
                            width={80}
                            height={80}
                            className="w-20 h-20 object-cover rounded"
                          />
                        </Link>
                      )}
                    </td>
                    <td className="p-2 hidden md:table-cell">{product?.category}</td>
                    <td className="p-2 hidden md:table-cell">{product?.type}</td>
                    <td className="p-2 hidden md:table-cell">{product?.status}</td>
                    <td className="p-2">
                      <PriceFormatter amount={product?.price} />
                    </td>
                    <td className="p-2 flex gap-2 justify-center md:justify-start">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeFromFavorite(product._id)}
                      >
                        <Trash className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {visibleProducts < favoriteProduct.length && (
            <div className="text-center mt-4">
              <Button onClick={loadMore}>Load More</Button>
            </div>
          )}

          <div className="mt-4 text-right">
            <Button variant="outline" onClick={resetFavorite}>
              Clear Wishlist
            </Button>
          </div>
        </>
      ) : (
        <div className="flex min-h-[400px] flex-col items-center justify-center space-y-6 px-4 text-center">
          <div className="relative mb-4">
            <div className="absolute -top-1 -right-1 h-4 w-4 animate-ping rounded-full bg-muted-foreground/20"></div>
            <Heart
              className="h-12 w-12 text-muted-foreground"
              strokeWidth={1.5}
            />
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
