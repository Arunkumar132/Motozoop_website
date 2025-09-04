import React from "react";
import Link from "next/link";
import {
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
} from "lucide-react";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  iconClassName?: string;
  tooltipClassName?: string; // ✅ Added
}

const socialLinks = [
  {
    title: "Youtube",
    href: "https://www.youtube.com/@motozoop",
    icon: <Youtube className="w-5 h-5" />,
  },
  {
    title: "Instagram",
    href: "https://www.instagram.com/motozoop/",
    icon: <Instagram className="w-5 h-5" />,
  },
  {
    title: "Facebook",
    href: "https://www.facebook.com/motozoop",
    icon: <Facebook className="w-5 h-5" />,
  },
  {
    title: "Twitter",
    href: "https://twitter.com/motozoop",
    icon: <Twitter className="w-5 h-5" />,
  },
  {
    title: "LinkedIn",
    href: "https://www.linkedin.com/company/motozoop",
    icon: <Linkedin className="w-5 h-5" />,
  },
];

const SocialMedia = ({ className, iconClassName, tooltipClassName }: Props) => {
  return (
    <TooltipProvider>
      <div className={cn("flex items-center gap-3.5", className)}>
        {socialLinks.map((item) => (
          <Tooltip key={item.title}> 
            <TooltipTrigger asChild>
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href={item.href}
                className={cn(
                  "p-2 border rounded-full hover:text-white hover:border-shop_light_green hoverEffect",
                  iconClassName
                )}
              >
                {item.icon}
              </Link>
            </TooltipTrigger>
            <TooltipContent
              className={cn(
                "bg-white text-darkColor font-semibold",
                tooltipClassName
              )}
            >
              {item.title}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
};

export default SocialMedia;
