import AddToCartButton from "@/components/AddToCartButton";
import Container from "@/components/Container";
import FavoriteButton from "@/components/FavoriteButton";
import ImageView from "@/components/ImageView";
import PriceView from "@/components/PriceView";
import { getProductBySlug } from "@/sanity/queries";
import { CornerDownLeft, StarIcon } from "lucide-react";
import React from "react";
import ColorSelection from "@/components/ColorSelection";
import StatueSelector from "@/components/StatueSelector";
import DeliveryCheckWrapper from "@/components/DeliveryCheckWrapper";
import ReturnModal from "@/components/ReturnModal";
import BuyNow from "@/components/BuyNow";

interface Props {
  params: { slug: string };
}

const SingleProductPage = async ({ params }: Props) => {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    return (
      <Container className="py-10 text-center">
        <h2 className="text-2xl font-semibold text-red-600">Product not found.</h2>
      </Container>
    );
  }

  const isStock = product.stock > 0;
  const hasColors = product.colors && product.colors.length > 1;
  const hasStatues = product.statues && product.statues.length > 1;

  return (
    <Container className="flex flex-col md:flex-row gap-10 pb-10">
      {/* Product Images */}
      {product.images && <ImageView images={product.images} isStock={isStock} />}

      {/* Product Details */}
      <div className="w-full md:w-1/2 flex flex-col gap-5">
        {/* Product Info */}
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">{product.name}</h2>
          <p className="text-sm text-gray-600 tracking-wide">{product.description}</p>
          <div className="flex items-center gap-0.5 text-xs">
            {[...Array(5)].map((_, index) => (
              <StarIcon key={index} size={12} className="text-shop_light_green" fill="#3b9c3c" />
            ))}
            <p className="font-bold">(120)</p>
          </div>
        </div>

        {/* Price & Stock */}
        <div className="space-y-1 border-t border-b border-gray_200 py-5">
          <PriceView price={product.price} discount={product.discount} className="text-2xl font-bold" />
          <p
            className={`px-4 py-1.5 text-sm text-center inline-block font-bold rounded-lg ${
              isStock ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
            }`}
          >
            {isStock ? "In Stock" : "Out of Stock"}
          </p>
        </div>

        {/* Color & Statue Selectors */}
        {hasColors && <ColorSelection colors={product.colors} />}
        {hasStatues && <StatueSelector statues={product.statues} />}

        {/* Buttons: Add to Cart, Buy Now, Favorite */}
        <div className="flex items-center justify-start gap-4 w-full">
          <div className="flex-1 h-12">
            <AddToCartButton product={product} className="w-full h-full text-base" />
          </div>
          <div className="flex-1 h-12">
            <BuyNow product={product} className="w-full h-full text-base" />
          </div>
          <div className="h-12 w-12 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-100 transition">
            <FavoriteButton showProduct={true} product={product} iconSize={24} />
          </div>
        </div>

        {/* Delivery & Return Sections */}
        <div className="flex flex-col w-full gap-3.5 mt-2">
          <DeliveryCheckWrapper />
          <div className="border border-darkColor/50 p-3 flex items-center gap-2.5">
            <CornerDownLeft size={30} className="text-shop_orange" />
            <div>
              <p className="text-base font-semibold text-black">Return Delivery</p>
              <p className="text-base text-black">
                Free 30 days Delivery Returns.<ReturnModal />
              </p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default SingleProductPage;
