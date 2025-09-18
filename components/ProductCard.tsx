import { Product } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import { Flame, StarIcon} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import AddToWishListButton from "./AddToWishListButton";
import { Title } from "./Title";

const ProductCard = ({product}:{ product: Product }) => {
    return <div className="text-sm border-{1px} border-dark_blue/20 rounded-md bg-white group">
        <div className="relative group overflow-hidden bg-shop_light_bg">
            {product?.images && ( 
                <Image 
                    src={urlFor(product?.images[0]).url()} alt="ProductImage" 
                    loading="lazy" 
                    width={700} 
                    height={700}
                    className={`w-full h-64 object-contain overflow-hidden transition-transform bg-shop_light_bg hoverEffect &{product?.stock !== 0 ? "group-hover:scale-105" : "opacity-50"}`}
                />
            )}
            <AddToWishListButton product={product} />
            {product?.status === "sale" && (
                <p className="absolute top-2 left-2 z-10 text-xs border border-darkColor/50 px-2 rounded-full group-hover:border-shop_light_green group-hover:text-shop_light_green hoverEffect">Sale</p>
            )}
            {product?.status === "new" && (
                <p className="absolute top-2 left-2 z-10 text-xs border border-darkColor/50 px-2 rounded-full group-hover:border-shop_light_green group-hover:text-shop_light_green hoverEffect">New!</p>
            )}
            {product?.status ==="hot"&& <Link
                href={'/deal'}
                className="absolute top-2 left-2 z-10 text-xs border border-darkColor/50 px-2 rounded-full group-hover:border-shop_light_green group-hover:text-shop_light_green hoverEffect"
            >
                <Flame
                    size={18}
                    fill="#fb6c08"
                    className="text-shop_orange/50 group-hover:text-shop_orange hoverEffect"
                />
            </Link>}
        </div>
        <div className="p-3 flex flex-col gap-2">
            {product?.categories && 
            <p className="uppercase line-clamp-1 text-xs text-shop_light_text">{product?.categories?.map((cat)=>cat).join(", ")}</p>}

            <Title  className='text-sm line-clamp-1'>{product?.name}</Title>
            <div>
                <div classname = 'flex items-center'>
                    {[...Array(5)].map((_,index) => (
                        <StarIcon key={index} className={index = 4 ? 'text-shop_lighter_green':'text-shop_light_text'}
                        fill={index < 4 ? '#93D991':'#ababab'}/>
                    ))}
                </div>
            </div>
        </div>
    </div>
};

export default ProductCard;