import React from "react";
import Container from "./Container";
import FooterTop from "./FooterTop";
import Logo from "./Logo";
import SocialMedia from "./SocialMedia";
import { SubText } from "./Title";

const Footer = () => {
  return (
    <footer className="bg-white border-t">
      <Container>
        <FooterTop />
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 gap-10 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Logo />
            <SubText className="text-gray-600 text-sm"> Motozoop Car is your Second home</SubText>
            <SocialMedia  className="text-darkColor/60" iconClassName="border-darkColor/60 hover:border-shop_LIGHT_green hover:text-shop_LIGHT  _green" tooltipClassName="bg-darkColor text-white"/>
          </div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </Container> 
    </footer>
  );
};

export default Footer;
