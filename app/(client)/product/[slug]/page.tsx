import AddToCartButton from "@/components/AddToCartButton";
import Container from "@/components/Container";
import FavoriteButton from "@/components/FavoriteButton";
import ImageView from "@/components/ImageView";
import PriceView from "@/components/PriceView";
import { getProductBySlug } from "@/sanity/queries";
import { CornerDownLeft, StarIcon, Truck } from "lucide-react";
import React from "react";
import { FaRegQuestionCircle } from "react-icons/fa";
import { FiShare2 } from "react-icons/fi";
import { RxBorderSplit } from "react-icons/rx";
import { TbTruckDelivery } from "react-icons/tb";
import ColorSelection from "@/components/ColorSelection";
import StatueSelector from "@/components/StatueSelector";

const SingleProductPage = async ({
  params,
}: {
  params: { slug: string };
}) => {
  const { slug } = params;
  const product = await getProductBySlug(slug);

  // Basic stock and variant checks
  const isStock = product?.stock > 0;
  const hasColors = product?.colors && product.colors.length > 1;
  const hasStatues = product?.statues && product.statues.length > 1;

  if (!product) {
    return (
      <Container className="py-10 text-center">
        <h2 className="text-2xl font-semibold text-red-600">
          Product not found.
        </h2>
      </Container>
    );
  }

  return (
    <Container className="flex flex-col md:flex-row gap-10 pb-10">
      {/* ✅ Left: Product Images */}
      {product?.images && (
        <ImageView images={product?.images} isStock={isStock} />
      )}

      {/* ✅ Right: Product Details */}
      <div className="w-full md:w-1/2 flex flex-col gap-5">
        {/* Product Info */}
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">{product?.name}</h2>
          <p className="text-sm text-gray-600 tracking-wide">
            {product?.description}
          </p>
          <div className="flex items-center gap-0.5 text-xs">
            {[...Array(5)].map((_, index) => (
              <StarIcon
                key={index}
                size={12}
                className="text-shop_light_green"
                fill={"#3b9c3c"}
              />
            ))}
            <p className="font-bold">(120)</p>
          </div>
        </div>

        {/* Price & Stock Info */}
        <div className="space-y-1 border-t border-b border-gray_200 py-5">
          <PriceView
            price={product?.price}
            discount={product?.discount}
            className="text-2xl font-bold"
          />
          <p
            className={`px-4 py-1.5 text-sm text-center inline-block font-bold rounded-lg ${
              product?.stock === 0
                ? "bg-red-100 text-red-600"
                : "bg-green-100 text-green-600"
            }`}
          >
            {isStock ? "In Stock" : "Out of Stock"}
          </p>
        </div>

        {/* ✅ Show Color Selector if multiple colors exist */}
        {hasColors && <ColorSelection colors={product.colors} />}

        {/* ✅ Show Statue Selector if multiple statues exist */}
        {hasStatues && <StatueSelector statues={product.statues} />}

        {/* Add to Cart & Favorite */}
        <div className="flex items-center gap-2.5 lg:gap-5">
          <AddToCartButton product={product} />
          <FavoriteButton showProduct={true} product={product} />
        </div>

        {/* Product Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-7.5 border-b border-b-gray-200 py-5 -mt-2">
          <button className="flex items-center gap-2 text-sm text-black hover:text-red-600 hoverEffect">
            <RxBorderSplit className="text-lg" />
            <p>Compare Color</p>
          </button>
          <button className="flex items-center gap-2 text-sm text-black hover:text-green-600 hoverEffect">
            <FaRegQuestionCircle className="text-lg" />
            <p>Ask a Question</p>
          </button>
          <button className="flex items-center gap-2 text-sm text-black hover:text-blue-600 hoverEffect">
            <TbTruckDelivery className="text-lg" />
            <p>Delivery & Return</p>
          </button>
          <button className="flex items-center gap-2 text-sm text-black hover:text-yellow-600 hoverEffect">
            <FiShare2 className="text-lg" />
            <p>Share</p>
          </button>
        </div>

        {/* Delivery Info Section */}
        <div className="flex flex-col w-full gap-3.5 mt-2">
          <div className="border border-darkColor/50 p-3 flex items-center gap-2.5">
            <Truck size={30} className="text-shop_orange" />
            <div>
              <p className="text-base font-semibold text-black">
                Free Delivery
              </p>
              <p className="text-base text-gray-500 underline underline-offset-2">
                Enter the Postal Code for Delivery Availability.
              </p>
            </div>
          </div>

          <div className="border border-darkColor/50 p-3 flex items-center gap-2.5">
            <CornerDownLeft size={30} className="text-shop_orange" />
            <div>
              <p className="text-base font-semibold text-black">
                Return Delivery
              </p>
              <p className="text-base text-black">
                Free 30 days Delivery Returns.{" "}
                <span className="underline underline-offset-2 text-gray-500">
                  Details
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default SingleProductPage;
