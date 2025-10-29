// app/(client)/blog/[slug]/page.tsx
import React from "react";
import Container from "@/components/Container";
import { urlFor } from "@/sanity/lib/image";
import { getBlogCategories, getOthersBlog, getSingleBlog } from "@/sanity/queries";
import dayjs from "dayjs";
import { Calendar, ChevronLeftIcon, Pencil } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PortableText } from "next-sanity";
import Link from "next/link";
import { Blog, BlogCategory } from "@/sanity.types";

interface PageProps {
  params: { slug: string };
}

// Main Blog Page - Server Component
export default async function SingleBlogPage({ params }: PageProps) {
  const { slug } = params;

  const blog: Blog | null = await getSingleBlog(slug);
  if (!blog) return notFound();

  return (
    <div className="py-10">
      <Container className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Main Blog Content */}
        <div className="lg:col-span-3">
          {blog.mainImage && (
            <Image
              src={urlFor(blog.mainImage).url() || "/placeholder.jpg"}
              alt={blog.title || "Blog image"}
              width={800}
              height={800}
              priority
              className="w-full max-h-[500px] object-cover rounded-lg"
            />
          )}

          {/* Blog Meta */}
          <div className="text-xs flex items-center gap-5 my-7">
            <div className="flex items-center gap-2">
              {blog.blogcategories?.map((item: BlogCategory, idx: number) => (
                <p
                  key={idx}
                  className="font-semibold text-shop_dark_green tracking-wider cursor-pointer"
                >
                  {item.title}
                </p>
              ))}
            </div>

            <p className="flex items-center gap-1 text-lightColor relative group hover:cursor-pointer hover:text-shop_dark_green hoverEffect">
              <Pencil size={15} /> {blog.author?.name}
              <span className="absolute left-0 -bottom-1.5 bg-lightColor/30 inline-block w-full h-[2px] group-hover:bg-shop_dark_green hoverEffect" />
            </p>

            <p className="flex items-center gap-1 text-lightColor relative group hover:cursor-pointer hover:text-shop_dark_green hoverEffect">
              <Calendar size={15} /> {dayjs(blog.publishedAt).format("MMMM D, YYYY")}
              <span className="absolute left-0 -bottom-1.5 bg-lightColor/30 inline-block w-full h-[2px] group-hover:bg-shop_dark_green hoverEffect" />
            </p>
          </div>

          {/* Blog Content */}
          <h2 className="text-3xl font-bold mb-5">{blog.title}</h2>
          {blog.body && <PortableText value={blog.body} />}

          {/* Back to Blogs */}
          <div className="mt-10">
            <Link href="/blog" className="flex items-center gap-1">
              <ChevronLeftIcon className="size-5" />
              <span className="text-sm font-semibold">Back to blogs</span>
            </Link>
          </div>
        </div>

        {/* Sidebar */}
        <BlogSidebar slug={slug} />
      </Container>
    </div>
  );
}

// Sidebar - Server Component
async function BlogSidebar({ slug }: { slug: string }) {
  const categories: BlogCategory[] = await getBlogCategories();
  const latestBlogs: Blog[] = await getOthersBlog(slug, 5);

  return (
    <div>
      {/* Latest Blogs */}
      <div className="border border-lightColor p-5 rounded-md mt-10">
        <p className="text-xl font-semibold text-shop_dark_green">Latest Blogs</p>
        <div className="space-y-4 mt-4">
          {latestBlogs?.map((blog: Blog, idx: number) => (
            <Link
              href={`/blog/${blog.slug?.current}`}
              key={idx}
              className="flex items-center gap-2 group"
            >
              {blog.mainImage && (
                <Image
                  src={urlFor(blog.mainImage).url()}
                  alt={blog.title || ""}
                  width={100}
                  height={100}
                  className="w-16 h-16 object-cover rounded-full border-[1px] border-shop_dark_green/10 group-hover:border-shop_dark_green"
                />
              )}
              <p className="line-clamp-2 text-sm text-lightColor group-hover:text-shop_dark_green">
                {blog.title}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
