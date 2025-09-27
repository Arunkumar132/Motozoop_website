import React, { FC } from "react";
import Logo from "./Logo";
import { X } from "lucide-react";
import Link from "next/link";
import { headerData } from "@/constants/data";
import { usePathname } from "next/navigation";
import SocialMedia from "./SocialMedia";
import { useOutsideClick } from "@/hooks";
import { Button } from "./ui/button";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const SideMenu: FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname(); 
  const sidebarRef=useOutsideClick<HTMLDivElement>(onClose);

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-full h-screen
        bg-black/50 text-white/70 shadow-xl transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
    >

      <div ref={sidebarRef} className="min-w-72 max-w-96 bg-black h-screen p-10 border-r border-shop_light_green flex flex-col gap-6">
        <div className="flex items-center justify-between gap-5">
          <Logo className="text-white" spanDesign="group-hover:text-white" />
          <Button
            onClick={onClose}
            className="hover:text-shop_light_green transition duration-300"
          >
            <X />
          </Button>
        </div>

        <div className="flex flex-col space-y-3.5 font-semibold tracking-wide">
          {headerData?.map((item) => (
            <Link
              href={item?.href}
              key={item?.title}
              onClick={onClose}
              className={`transition duration-300 hover:text-shop_light_green ${
                pathname === item?.href ? "text-white" : ""
              }`}
            >
              {item?.title}
            </Link>
          ))}
        </div>
        <SocialMedia/>
      </div>
    </div>
  );
};

export default SideMenu;
