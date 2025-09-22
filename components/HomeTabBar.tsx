"use client";

import React from "react";
import Link from "next/link";
import { productTabs } from "@/sanity/schemaTypes/productType";

interface Props {
  selectedTab: string;
  onTabSelect: (tab: string) => void;
}

const HomeTabBar = ({ selectedTab, onTabSelect }: Props) => {
  return (
    <div className="flex items-center justify-between flex-wrap gap-5">
      
      {/* Tabs */}
      <div className="flex items-center gap-3 text-sm font-semibold flex-wrap">
        {productTabs.map((tab, index) => (
          <button
            key={tab.value || index} // Unique key fallback
            onClick={() => onTabSelect(tab.value)}
            className={`border border-shop_light_green/10 px-5 py-2 rounded-full hover:bg-shop_light_green hover:border-shop_light_green hover:text-white transition-colors duration-200 ${
              selectedTab === tab.value
                ? "bg-shop_light_green text-white border-shop_light_green"
                : "bg-shop_light_green/10 text-black"
            }`}
          >
            {tab.title}
          </button>
        ))}
      </div>

      {/* See all link */}
      <Link
        href="/shop"
        className="border border-shop_light_green/30 px-5 py-2 rounded-full hover:bg-shop_light_green hover:border-shop_light_green hover:text-white transition-colors duration-200"
      >
        See all
      </Link>
    </div>
  );
};

export default HomeTabBar;
