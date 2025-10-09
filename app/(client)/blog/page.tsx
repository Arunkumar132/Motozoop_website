import Container from "@/components/Container";
import { Title } from "@/components/Title";
import { urlFor } from "@/sanity/lib/image";
import { getAllBlogs } from "@/sanity/queries";
import dayjs from "dayjs";
import { Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const BlogPage = async () => {
  const blogs = await getAllBlogs(6);

  return (
    <div>
      <Container>
        <Title>Blog Page</Title>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4 mb-8 md:mt-8 items-stretch">
          {blogs?.map((blog) => (
            <div
              key={blog?._id}
              className="rounded-lg overflow-hidden group bg-white shadow-sm hover:shadow-md transition-all duration-300 flex flex-col border border-gray-100 scale-95 hover:scale-100"
              style={{ maxWidth: "90%", margin: "0 auto" }}
            >
              {/* Blog Image */}
              {blog?.mainImage && (
                <div className="w-full aspect-[5/4] overflow-hidden flex-shrink-0">
                  <Image
                    src={urlFor(blog?.mainImage).url()}
                    alt={blog?.title || "blogImage"}
                    width={350}
                    height={350}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              {/* Grey Box: Categories + Date */}
              <div className="bg-gray-100 p-3 flex-shrink-0">
                <div className="text-xs flex items-center justify-between flex-wrap gap-1.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {blog?.blogcategories?.map((item, index) => (
                      <p
                        key={item?._id || index}
                        className="relative font-semibold text-shop_dark_green tracking-wider cursor-pointer group text-sm"
                      >
                        {item?.title}
                        <span className="absolute left-0 -bottom-1 bg-lightColor/30 inline-block w-full h-[2px] group-hover:bg-shop_dark_green" />
                      </p>
                    ))}
                  </div>

                  <p className="flex items-center gap-1 text-lightColor relative group hover:cursor-pointer hover:text-shop_dark_green text-sm">
                    <Calendar size={14} />
                    {dayjs(blog.publishedAt).format("MMMM D, YYYY")}
                  </p>
                </div>
              </div>

              {/* Blog Title below grey box */}
              <div className="p-3 pt-2 flex-1 flex flex-col justify-start">
                <Link
                  href={`/blog/${blog?.slug?.current}`}
                  className="text-base font-bold tracking-wide text-gray-800 hover:text-shop_dark_green hoverEffect line-clamp-2 leading-snug"
                >
                  {blog?.title}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default BlogPage;
