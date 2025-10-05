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
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-3 text-sm font-semibold">
        {productTabs.map((tab, index) => (
          <button
            key={tab.value || index}
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
      <div className="sm:flex-shrink-0">
        <Link
          href="/shop"
          className="block text-center border border-shop_light_green/30 px-5 py-2 rounded-full hover:bg-shop_light_green hover:border-shop_light_green hover:text-white transition-colors duration-200"
        >
          See all
        </Link>
      </div>
    </div>
  );
};

export default HomeTabBar;
