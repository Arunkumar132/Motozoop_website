  import React from "react";
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
  import { getProductBySlug } from "@/sanity/queries";
  import { CornerDownLeft, StarIcon } from "lucide-react";

  interface Props {
    params: { slug: string };
  }

  const SingleProductPage = async ({ params }: Props) => {
    const product = await getProductBySlug(params.slug);

    if (!product) {
      return (
        <Container className="py-10 text-center">
          <h2 className="text-2xl font-semibold text-red-600">Product not found</h2>
        </Container>
      );
    }

    const isStock = product.stock > 0;
    const hasColors = Array.isArray(product.colors) && product.colors.length > 0;
    const hasStatues = Array.isArray(product.statues) && product.statues.length > 0;

    // ✅ Fix: Collect all images from all colors (flatten)
    const allImages =
      hasColors && product.colors.length > 0
        ? product.colors.flatMap((color: any) => color.images || [])
        : [];

    return (
      <Container className="flex flex-col md:flex-row gap-10 pb-10">
        {/* ---------- Product Image Section ---------- */}
        {allImages.length > 0 ? (
          <ImageView images={allImages} isStock={isStock} />
        ) : (
          <div className="flex items-center justify-center w-full md:w-1/2 bg-gray-100 rounded-lg">
            <p className="text-gray-500 py-20">No images available</p>
          </div>
        )}

        {/* ---------- Product Info Section ---------- */}
        <div className="w-full md:w-1/2 flex flex-col gap-5">
          {/* Product Title & Description */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-gray-900">{product.name}</h2>
            {product.description && (
              <p className="text-gray-600 text-sm leading-relaxed tracking-wide">
                {product.description}
              </p>
            )}
          </div>

          {/* ---------- Price & Stock Status ---------- */}
          <div className="border-t border-b border-gray-200 py-4 space-y-2">
            {/* Original Price */}
            {product.discount ? (
              <div className="flex items-center gap-2">
                <span className="text-gray-500 line-through">
                  ₹{Number(product.price) || 0}
                </span>
                <span className="text-2xl font-bold text-black">
                  ₹{Math.round(Number(product.price) * (1 - Number(product.discount) / 100))}
                </span>
              </div>
            ) : (
              <span className="text-2xl font-bold text-black">
                ₹{Number(product.price) || 0}
              </span>
            )}

            {/* Discount Info */}
            {product.discount ? (
              <span className="text-sm text-red-600 font-semibold">
              </span>
            ) : null}

            {/* Stock Status */}
            <p
              className={`inline-block px-4 py-1.5 text-sm font-semibold rounded-lg ${
                isStock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
              }`}
            >
              {isStock ? "In Stock" : "Out of Stock"}
            </p>
          </div>

          {/* ---------- Color & Statue Selection ---------- */}
          {hasColors && <ColorSelection colors={product.colors} />}
          {hasStatues && <StatueSelector statues={product.statues} />}

          {/* ---------- Buttons Section ---------- */}
          <div className="flex items-center justify-start gap-4 w-full">
            <div className="flex-1 h-12">
              <AddToCartButton product={product} className="w-full h-full text-base" />
            </div>
            <div className="flex-1 h-12">
              <BuyNow product={product} className="w-full h-full text-base" />
            </div>
            <div className="h-12 w-12 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-100 transition">
              <FavoriteButton showProduct product={product} iconSize={24} />
            </div>
          </div>

          {/* ---------- Delivery & Return Info ---------- */}
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
  };

  export default SingleProductPage;
