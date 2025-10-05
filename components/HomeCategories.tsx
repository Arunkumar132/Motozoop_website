import React from "react";
import Image from "next/image";
import { Category } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import { Title } from "./Title";
import Link from "next/link";

const HomeCategories = ({ categories }: { categories: Category[] }) => {
  return (
    <div className="bg-white border border-shop_light_green/20 my-10 md:my-16 p-5 lg:p-7 rounded-md">
      {/* Section Title */}
      <Title className="border-b pb-3">Popular Categories</Title>

      {/* Category Grid */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-4 auto-rows-fr">
        {categories?.map((category) => (
          <div
            key={category?._id}
            className="bg-shop_light_bg p-5 flex items-center gap-3 group rounded-md hover:shadow-md transition-all duration-300 ease-in-out h-full min-h-[110px]"
          >
            {/* Category Image */}
            {category?.image && (
              <div className="overflow-hidden border border-shop_orange/30 group-hover:border-shop_orange hoverEffect w-20 h-20 p-1 flex-shrink-0 rounded-md">
                <Link
                  href={{
                    pathname: "/shop",
                    query: { category: category?.slug?.current },
                  }}
                >
                  <Image
                    src={urlFor(category?.image).url()}
                    alt="CategoryImage"
                    width={500}
                    height={500}
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110 hoverEffect"
                  />
                </Link>
              </div>
            )}

            {/* Category Details */}
            <div className="space-y-1 flex flex-col justify-center">
              <h3 className="text-base font-semibold group-hover:text-shop_dark_green transition-colors duration-200">
                {category?.title}
              </h3>
              <p className="text-sm">
                <span className="font-bold text-shop_dark_green">
                  {`(${category?.productCount})`}
                </span>{" "}
                items Available
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeCategories;
