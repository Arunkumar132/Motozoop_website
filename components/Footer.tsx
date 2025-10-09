"use client";

import React from "react";
import Link from "next/link";

import Container from "./Container";
import FooterTop from "./FooterTop";
import Logo from "./Logo";
import SocialMedia from "./SocialMedia";
import Newsletter from "./Newsletter"; // ✅ Imported new component
import { SubText, SubTitle } from "./Title";
import { categoriesData, quickLinksData } from "@/constants/data";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <Container>
        <FooterTop />

        {/* Main Footer Grid */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Section */}
          <div className="space-y-5">
            <Logo />
            <SubText className="text-gray-600">
              Motozoop Car — Your second home on the road.
            </SubText>
            <SocialMedia
              className="text-gray-600"
              iconClassName="border-gray-600 hover:border-shop_light_green hover:text-shop_light_green transition-colors"
              tooltipClassName="bg-darkColor text-white"
            />
          </div>

          {/* Quick Links */}
          <div>
            <SubTitle className="text-darkColor font-semibold">
              Quick Links
            </SubTitle>
            <ul className="space-y-2 mt-4">
              {quickLinksData?.map((item) => (
                <li key={item?.title}>
                  <Link
                    href={item?.href}
                    className="text-sm text-gray-500 hover:text-shop_light_green transition-colors"
                  >
                    {item?.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <SubTitle className="text-darkColor font-semibold">
              Categories
            </SubTitle>
            <ul className="space-y-2 mt-4">
              {categoriesData?.map((item) => (
                <li key={item?.title}>
                  <Link
                    href={`/category/${item?.href}`}
                    className="text-sm text-gray-500 hover:text-shop_light_green transition-colors"
                  >
                    {item?.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <Newsletter /> {/* ✅ Uses the new component */}
        </div>

        {/* Footer Bottom */}
        <div className="py-6 border-t border-gray-200 text-center text-sm text-gray-600">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
            <span>© {new Date().getFullYear()}</span>
            <div className="flex justify-center items-center gap-2">
              <span>Motozoop - All rights reserved.</span>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
