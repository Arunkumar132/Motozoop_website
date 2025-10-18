"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Instagram, Facebook, Twitter, Linkedin, Youtube, Globe } from "lucide-react";

export default function SocialMediaIDsPage() {
  const socialLinks = [
    { name: "Instagram", icon: Instagram, handle: "@company_insta", url: "https://instagram.com/company_insta" },
    { name: "Facebook", icon: Facebook, handle: "Company Official", url: "https://facebook.com/company" },
    { name: "Twitter (X)", icon: Twitter, handle: "@company_x", url: "https://x.com/company_x" },
    { name: "LinkedIn", icon: Linkedin, handle: "Company Pvt Ltd", url: "https://linkedin.com/company/company" },
    { name: "YouTube", icon: Youtube, handle: "Company Channel", url: "https://youtube.com/@company" },
    { name: "Website", icon: Globe, handle: "www.company.com", url: "https://company.com" },
  ];

  return (
    <div className="bg-gray-50 flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Official Social Media IDs</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 w-11/12 max-w-5xl">
        {socialLinks.map(({ name, icon: Icon, handle, url }) => (
          <Card key={name} className=" border hover:shadow-lg transition-shadow">
            <CardContent className="flex items-center space-x-4 p-6">
              <Icon className="w-8 h-8 text-shop_light_green" />
              <div>
                <h2 className="text-lg font-semibold">{name}</h2>
                <p className="text-gray-500">{handle}</p>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-shop_light_green hover:underline"
                >
                  Visit Page
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
