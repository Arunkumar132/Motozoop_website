"use client";

import React, { useState, useEffect, use } from "react";
import Container from "@/components/Container";
import AddToCartButton from "@/components/AddToCartButton";
import FavoriteButton from "@/components/FavoriteButton";
import ImageView from "@/components/ImageView";
import PriceView from "@/components/PriceView";
import ColorSelection from "@/components/ColorSelection";
import StatueSelector from "@/components/StatueSelector";
import DeliveryCheckWrapper from "@/components/DeliveryCheckWrapper";
import ReturnModal from "@/components/ReturnModal";
import BuyNow from "@/components/BuyNow";
import DynamicStockDisplay from "@/components/DynamicStockDisplay";
import { getProductBySlug } from "@/sanity/queries";
import { CornerDownLeft } from "lucide-react";

interface Props {
  params: { slug: string } | Promise<{ slug: string }>;
}

export default function SingleProductPage({ params }: Props) {
  const [product, setProduct] = useState<any>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  // Unwrap params (Next.js 14+)
  const { slug } = use(params);

  useEffect(() => {
    async function fetchProduct() {
      const data = await getProductBySlug(slug);
      setProduct(data);

      // Set first available color as default
      if (Array.isArray(data.colors) && data.colors.length > 0) {
        const firstAvailableColor = data.colors.find((c: any) => c.stock > 0);
        setSelectedColor(firstAvailableColor ? firstAvailableColor.colorName : null);
      }
    }
    fetchProduct();
  }, [slug]);

  if (!product) {
    return (
      <Container className="py-10 text-center">
        <h2 className="text-2xl font-semibold text-red-600">
          Product not found
        </h2>
      </Container>
    );
  }

  const hasColors = Array.isArray(product.colors) && product.colors.length > 0;
  const hasStatues = Array.isArray(product.statues) && product.statues.length > 0;

  // Total stock if no color selected
  const totalStock = hasColors
    ? product.colors.reduce((sum: number, c: any) => sum + (c.stock || 0), 0)
    : product.stock || 0;

  // Images filtered by selected color
  const imagesToShow =
    selectedColor && hasColors
      ? product.colors.find((c: any) => c.colorName === selectedColor)?.images || []
      : hasColors
      ? product.colors.flatMap((c: any) => c.images || [])
      : [];

  return (
    <Container className="flex flex-col md:flex-row gap-10 pb-10">
      {/* Product Image */}
      <ImageView key={selectedColor || "all"} images={imagesToShow} isStock={totalStock} />

      {/* Product Info */}
      <div className="w-full md:w-1/2 flex flex-col gap-5">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-gray-900">{product.name}</h2>
          {product.description && (
            <p className="text-gray-600 text-sm leading-relaxed tracking-wide">
              {product.description}
            </p>
          )}
        </div>

        {/* Price & Stock */}
        <div className="border-t border-b border-gray-200 py-4 space-y-2">
          <PriceView
            price={product.price}
            discount={product.discount}
            className="text-2xl font-bold"
          />

          <DynamicStockDisplay
            colors={product.colors || []}
            totalStock={totalStock}
            selectedColor={selectedColor}
          />
        </div>

        {/* Color & Statue Selection */}
        {(hasColors || hasStatues) && (
          <div className="flex flex-col gap-4">
            {hasColors && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Choose Color</h3>
                <ColorSelection
                  colors={product.colors.map((c: any) => ({
                    colorName: c.colorName,
                    stock: c.stock,
                  }))}
                  selectedColor={selectedColor}
                  onSelectColor={setSelectedColor}
                />
              </div>
            )}
            {hasStatues && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Choose Statue</h3>
                <StatueSelector statues={product.statues} />
              </div>
            )}
          </div>
        )}

        {/* Buttons */}
        <div className="flex items-center justify-start gap-4 w-full">
          <div className="flex-1 h-12">
            <AddToCartButton
              product={product}
              selectedColor={selectedColor} // if applicable
              className="w-full h-full text-base"
            />
          </div>
          <div className="flex-1 h-12">
            <BuyNow
              product={product}
              selectedColor={selectedColor} // pass selected color
              className="w-full h-full text-base"
            />
          </div>
          <div className="h-12 w-12 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-100 transition">
            <FavoriteButton showProduct product={product} iconSize={24} />
          </div>
        </div>

        {/* Delivery & Return */}
        <div className="flex flex-col w-full gap-3.5 mt-2">
          <DeliveryCheckWrapper />
          <div className="border border-darkColor/50 p-3 flex items-center gap-2.5">
            <CornerDownLeft size={30} className="text-shop_orange" />
            <div>
              <p className="text-base font-semibold text-black">Return Delivery</p>
              <p className="text-base text-black">
                Free 30 days Delivery Returns. <ReturnModal />
              </p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
