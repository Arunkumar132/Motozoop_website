"use client";

import React from "react";
import { Title } from "@/components/Title";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { banner_1, banner_2, banner_3, banner_4 } from "@/images";

const HomeBanner = () => {
  const banners = [banner_1, banner_2, banner_3, banner_4];

  return (
    <div className="relative w-full">
      <div className="relative w-full rounded-lg overflow-hidden shadow-md bg-transparent">
        {/* Overlay Text */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center md:items-start text-center md:text-left px-8 lg:px-20 space-y-4 bg-black/30">
          <Title className="text-white text-2xl md:text-3xl font-bold drop-shadow-lg">
            Grab Upto 50% Off On <br /> Car Accessories!
          </Title>
          <Link
            href="/shop"
            className="bg-shop_dark_green text-white px-6 py-2 rounded-md text-sm font-semibold hover:bg-shop_dark_green/90 transition-all"
          >
            Buy Now
          </Link>
        </div>

        {/* Swiper Carousel */}
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{
            clickable: true,
            el: ".custom-pagination",
          }}
          navigation={{
            nextEl: ".custom-next",
            prevEl: ".custom-prev",
          }}
          loop={true}
          className="mySwiper w-full h-[320px] md:h-[380px] lg:h-[420px]"
        >
          {banners.map((img, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-[320px] md:h-[380px] lg:h-[420px]">
                <Image
                  src={img}
                  alt={`Banner ${index + 1}`}
                  fill
                  className="object-cover object-center"
                  sizes="100vw"
                  priority={index === 0}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation Buttons */}
        <button className="custom-prev absolute left-3 top-1/2 -translate-y-1/2 z-30 bg-white/70 hover:bg-white text-gray-800 rounded-full p-2 shadow-md transition-all">
          &#10094;
        </button>
        <button className="custom-next absolute right-3 top-1/2 -translate-y-1/2 z-30 bg-white/70 hover:bg-white text-gray-800 rounded-full p-2 shadow-md transition-all">
          &#10095;
        </button>

        {/* Internal Pagination Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 custom-pagination flex justify-center"></div>

        {/* Custom CSS for smaller dots */}
        <style jsx>{`
          .custom-pagination .swiper-pagination-bullet {
            width: 8px;
            height: 8px;
            background: white;
            opacity: 0.7;
            margin: 0 1px;
          }
          .custom-pagination .swiper-pagination-bullet-active {
            opacity: 1;
            background: #00a86b; /* optional active color */
          }
        `}</style>
      </div>
    </div>
  );
};

export default HomeBanner;
