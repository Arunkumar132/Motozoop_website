import React from "react";
import Container from "./Container";
import FooterTop from "./FooterTop";
import Logo from "./Logo";
import SocialMedia from "./SocialMedia";
import { SubText, SubTitle } from "./Title";
import { categoriesData, quickLinksData } from "@/constants/data";
import Link from "next/link";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const Footer = () => {
  return (
    <footer className="bg-white border-t">
      <Container>
        <FooterTop />
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Logo + Tagline + Social */}
          <div className="space-y-4">
            <Logo />
            <SubText>Motozoop Car is your Second home</SubText>
            <SocialMedia
              className="text-darkColor/60"
              iconClassName="border-darkColor/60 hover:border-shop_LIGHT_green hover:text-shop_LIGHT_green"
              tooltipClassName="bg-darkColor text-white"
            />
          </div>

          {/* Quick Links */}
          <div>
            <SubTitle>Quick Links</SubTitle>
            <ul className="space-y-2 mt-3">
              {quickLinksData?.map((item) => (
                <li key={item?.title}>
                  <Link
                    href={item?.href}
                    className="text-sm text-gray-500 hover:text-shop_light_green hoverEffect"
                  >
                    {item?.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <SubTitle>Categories</SubTitle>
            <ul className="space-y-3 mt-4">
              {categoriesData?.map((item) => (
                <li key={item?.title}>
                  <Link
                    href={`/category/${item?.href}`}
                    className="text-sm text-gray-500 hover:text-shop_light_green hoverEffect hoverEffect" 
                  >
                    {item?.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className ="space-y-4">
            <SubTitle>Newsletter</SubTitle>
            <SubText> Subscribe to our newsletter to recieve updates and exclusive offers</SubText>
            <form className="space-y-3">
              <Input placeholder="Enter your email" type="email" required/>
              <Button className="w-full">Subscribe</Button> 
            </form>
          </div>
        </div>
        <div className="py-6 border-t text-center text-sm text-gray-600">
         <div>
            © {new Date().getFullYear()}{" "}
            <Logo  className="text-sm"/>
            . All rights reserved.
          </div>
        </div>

      </Container>
    </footer>
  );
};

export default Footer;










