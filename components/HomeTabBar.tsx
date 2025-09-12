import { productType } from "@/constants/data";
import Link from "next/link";
import React from 'react';

const HomeTabBar = () => {
  return (
    <div className="flex items-center justify-between flex-wrap gap-5">
      <div className="flex items-center gap-3 text-sm font-semibold">
        {productType?.map((item) => (
          <button 
            key={item?.title} 
            className={`border border-shop_light_green/30 px-5 py-2 rounded-full hover:bg-shop_light_green hover:border-shop_light_green hover:text-white hoverEffect`}
          >
            {item?.title}
          </button>
        ))}
      </div>
      <Link 
        href={"/shop"} 
        className="border-shop_light_green/30 px-5 py-2 rounded-full hover:bg-shop_light_green hover:border-shop_light_green hover:text-white hoverEffect"
      >
        See all
      </Link>
    </div>
  );
};

export default HomeTabBar;
