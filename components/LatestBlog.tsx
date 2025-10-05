import React from "react";
import { Title } from "./Title";
import { getLatestBlogs } from "@/sanity/queries";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import { Calendar } from "lucide-react";
import dayjs from "dayjs";

const LatestBlog = async () => {
  const blogs = await getLatestBlogs();

  return (
    <div className="mb-10 lg:mb-20 border border-shop_light_green/20 rounded-md p-5 lg:p-7 bg-white">
      <Title>Latest Blog</Title>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-5">
        {blogs?.map((blog) => (
          <div
            key={blog?._id}
            className="bg-shop_light_bg rounded-lg overflow-hidden border border-gray-100 flex flex-col"
          >
            {/* --- Image Section --- */}
            {blog?.mainImage && (
              <Link href={`/blog/${blog?.slug?.current}`}>
                <div className="relative w-full h-60 overflow-hidden">
                  <Image
                    src={urlFor(blog?.mainImage).url()}
                    alt="blogImage"
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              </Link>
            )}

            {/* --- Content Section --- */}
            <div className="p-4 flex flex-col flex-grow justify-between">
              <div>
                <div className="text-xs flex items-center justify-between text-lightColor mb-2">
                  <div className="flex items-center gap-1 cursor-pointer group">
                    {blog?.blogcategories?.map((item, index) => (
                      <p
                        key={index}
                        className="font-semibold text-shop_dark_green tracking-wider"
                      >
                        {item?.title}
                      </p>
                    ))}
                  </div>
                  <p className="flex items-center text-lightColor group">
                    <Calendar size={14} />
                    {dayjs(blog.publishedAt).format("MMMM D, YYYY")}
                  </p>
                </div>

                {/* --- Blog Title (Clamped to Two Lines) --- */}
                <Link
                  href={`/blog/${blog?.slug?.current}`}
                  className="block text-base font-semibold tracking-wide mt-2 line-clamp-2 hover:text-shop_dark_green hoverEffect"
                >
                  {blog?.title}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LatestBlog;
