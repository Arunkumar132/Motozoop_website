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
import { Title } from "@/components/Title";
import { Blog } from "@/sanity.types";

// ------------------- Props -------------------
interface SingleBlogPageProps {
  params: { slug: string }; // slug is always a string
}

// ------------------- Main Blog Page -------------------
const SingleBlogPage = async ({ params }: SingleBlogPageProps) => {
  const { slug } = params; // ✅ DO NOT use `await` here
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
              {blog.blogcategories?.map((item, index) => (
                <p
                  key={index}
                  className="font-semibold text-shop_dark_green tracking-wider cursor-pointer"
                >
                  {item?.title}
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
          <div className="flex flex-col text-lightColor">
            {blog.body && (
              <PortableText
                value={blog.body}
                components={{
                  block: {
                    normal: ({ children }) => <p className="mb-5 text-base/8">{children}</p>,
                    h2: ({ children }) => <h2 className="text-2xl/8 font-medium">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-xl/8 font-medium">{children}</h3>,
                    blockquote: ({ children }) => (
                      <blockquote className="my-5 border-l-2 border-l-gray-300 pl-6">{children}</blockquote>
                    ),
                  },
                  types: {
                    image: ({ value }) => (
                      <Image
                        src={urlFor(value).width(2000).url()}
                        alt={value.alt || ""}
                        width={1400}
                        height={1000}
                        className="w-full rounded-2xl"
                      />
                    ),
                    separator: ({ value }) => {
                      switch (value.style) {
                        case "line":
                          return <hr className="my-5 border-t border-gray-200" />;
                        case "space":
                          return <div className="my-5" />;
                        default:
                          return null;
                      }
                    },
                  },
                  list: {
                    bullet: ({ children }) => <ul className="list-disc pl-4">{children}</ul>,
                    number: ({ children }) => <ol className="list-decimal pl-4">{children}</ol>,
                  },
                  marks: {
                    strong: ({ children }) => <strong>{children}</strong>,
                    code: ({ children }) => <code>{children}</code>,
                    link: ({ children, value }) => (
                      <Link href={value.href} className="underline">
                        {children}
                      </Link>
                    ),
                  },
                }}
              />
            )}

            {/* Back to Blogs */}
            <div className="mt-10">
              <Link href="/blog" className="flex items-center gap-1">
                <ChevronLeftIcon className="size-5" />
                <span className="text-sm font-semibold">Back to blogs</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <BlogLeft slug={slug} />
      </Container>
    </div>
  );
};

// ------------------- Sidebar Component -------------------
const BlogLeft = async ({ slug }: { slug: string }) => {
  const categories = await getBlogCategories();
  const latestBlogs = await getOthersBlog(slug, 5);

  return (
    <div>
      {/* Latest Blogs */}
      <div className="border border-lightColor p-5 rounded-md mt-10">
        <p className="text-xl font-semibold text-shop_dark_green">Latest Blogs</p>
        <div className="space-y-4 mt-4">
          {latestBlogs?.map((blog, index) => (
            <Link
              href={`/blog/${blog?.slug?.current}`}
              key={index}
              className="flex items-center gap-2 group"
            >
              {blog?.mainImage && (
                <Image
                  src={urlFor(blog.mainImage).url()}
                  alt="Blog image"
                  width={100}
                  height={100}
                  className="w-16 h-16 object-cover rounded-full border-[1px] border-shop_dark_green/10 group-hover:border-shop_dark_green"
                />
              )}
              <p className="line-clamp-2 text-sm text-lightColor group-hover:text-shop_dark_green">
                {blog?.title}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SingleBlogPage;
