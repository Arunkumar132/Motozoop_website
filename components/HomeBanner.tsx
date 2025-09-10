import React from 'react';
import { Title } from "@/components/Title";
import Link from "next/link";
import Image from 'next/image';
import { banner_1 } from '@/images';

const HomeBanner = () => {
  return (
    <div className="py-16 md:py-0 bg-shop_light_pink rounded-lg px-10 lg:px-24 flex flex-col md:flex-row items-center justify-between">
      <div className="space-y-5 text-center md:text-left">
        <Title>
          Grab Upto 50% Off On <br />
          Car Accessories!
        </Title>
        <Link
          href="/shop"
          className="bg-shop_dark_green/90 text-white/90 px-5 py-2 rounded-md text-sm font-semibold hover:bg-shop_dark_green hoverEffect"
        >
          Buy Now
        </Link>
      </div>
      <div className="hidden md:inline-flex">
        <Image 
          src={banner_1} 
          alt="Car accessories sale banner" 
          width={400} 
          height={300} 
          priority
        />
      </div>
    </div>
  );
};

export default HomeBanner;
