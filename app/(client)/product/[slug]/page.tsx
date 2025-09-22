import AddToCartButton from "@/components/AddToCartButton";
import Container from "@/components/Container";
import FavoriteButton from "@/components/FavoriteButton";
import ImageView from "@/components/ImageView";
import PriceView from "@/components/PriceView";
import { getProductBySlug } from "@/sanity/queries";
import { StarIcon } from "lucide-react";
import React from "react";

const SingleProductPage = async ({
  params,
}: {
  params: { slug: string };
}) => {
  const { slug } = params;
  const product = await getProductBySlug(slug);
  const isStock = product?.stock > 0;

  return (
    <Container className="flex flex-col md:flex-row gap-10 pb-10">
      {product?.images && (
        <ImageView images={product?.images} isStock={isStock} />
      )}
      <div className="w-full md:w-1/2 flex flex-col gap-5">
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
            <p className='font-bold'>{'(120)'}</p>
          </div>
        </div>
        <div className="space-y-1 border-t border-b border-gray_200 py-5">
            <PriceView
                price={product?.price}
                discount={product?.discount}
                className="text-2xl font-bold"
            />
            <p className={`px-4 py-1.5 text-sm text-center inline-block font-bold rounded-lg ${product?.stock === 0 ? 'bg-red-100 text-red-600':'bg-green-100 text-green-600'}`}>
                {(product?.stock as number) > 0 ? "In Stock" : "Out of Stock"}</p>
        </div>
        <div className="flex items-center gap-2.5 lg:gap-5">
            <AddToCartButton product={product} />
            <FavoriteButton showProduct={true} product={product} />
        </div>
      </div>
    </Container>
  );
};

export default SingleProductPage;
