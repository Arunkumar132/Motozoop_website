import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Title } from "./Title";
import { Category } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";

const HomeCategories = ({ categories }: { categories: Category[] }) => {
  return (
    <div className="bg-white border border-shop_light_green/20 my-10 md:my-20 p-5 lg:p-7 rounded-md">
      <Title className="border-b pb-2">Popular Categories</Title>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories?.map((category) => (
          <Link
            key={category?._id}
            href={`/category/${category?.slug?.current}`}
            className="bg-shop_light_bg p-5 flex items-center gap-3 group"
          >
            {category?.image && (
              <div className="overflow-hidden border border-shop_orange/30 group-hover:border-shop_orange hoverEffect w-20 h-20 p-1 rounded-md">
                <Image
                  src={urlFor(category?.image)?.url() || "/placeholder.png"}
                  alt={category?.title || "Category"}
                  width={80}
                  height={80}
                  className="w-full h-full object-contain group-hover:scale-110 hoverEffect"
                />
              </div>
            )}
            <span className="text-sm font-medium">{category?.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HomeCategories;
