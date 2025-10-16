import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  spanDesign?: string;
  imgSrc?: string;  // ✅ optional image prop
  imgAlt?: string;  // ✅ optional alt text
  imgSize?: number; // ✅ control image size
}

const Logo: React.FC<LogoProps> = ({
  className,
  spanDesign,
  imgSrc = '/Untitled_design-removebg-preview.png',  // ✅ corrected path
  imgAlt = 'MotoZoop Logo',
  imgSize = 100,
}) => {
  return (
    <Link
      href="/"
      className="inline-flex items-center hover:opacity-90 transition-opacity duration-200"
    >
      {/* ✅ Logo Image */}
      <Image
        src={imgSrc}
        alt={imgAlt}
        width={imgSize}
        height={imgSize}
        className="object-contain"
        priority
      />

      {/* ✅ Text Logo */}
      <h2
        className={cn(
          'text-2xl text-shop_dark_green font-black tracking-wider uppercase hover:text-shop_light_green group font-sans',
          className
        )}
      >
        Moto
        <span
          className={cn(
            'text-shop_light_green group-hover:text-shop_dark_green transition-colors duration-200',
            spanDesign
          )}
        >
          Zoop
        </span>
      </h2>
    </Link>
  );
};

export default Logo;
