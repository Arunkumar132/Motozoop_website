// app/blog/[slug]/page.tsx
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

interface SingleBlogPageProps {
  params: { slug: string };
}

const SingleBlogPage = async (props: SingleBlogPageProps) => {
  const params = await props.params; // ✅ await params
  const { slug } = params;

  const blog = await getSingleBlog(slug);
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
              {blog.blogcategories?.map((item: { title: string }, index: number) => (
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
                    normal: ({ children }) => (
                      <p className="mb-5 text-base/8 first:mt-0 last:mb-0">{children}</p>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-2xl/8 font-medium tracking-tight text-gray-950 first:mt-0 last:mb-0">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-xl/8 font-medium tracking-tight text-gray-950 first:mt-0 last:mb-0">
                        {children}
                      </h3>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="my-5 border-l-2 border-l-gray-300 pl-6 text-base/8 text-gray-950 first:mt-0 last:mb-0">
                        {children}
                      </blockquote>
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
                    bullet: ({ children }) => (
                      <ul className="list-disc pl-4 text-base/8 marker:text-gray-400">
                        {children}
                      </ul>
                    ),
                    number: ({ children }) => (
                      <ol className="list-decimal pl-4 text-base/8 marker:text-gray-400">
                        {children}
                      </ol>
                    ),
                  },
                  listItem: {
                    bullet: ({ children }) => (
                      <li className="my-2 pl-2 has-[br]:mb-8">{children}</li>
                    ),
                    number: ({ children }) => (
                      <li className="my-2 pl-2 has-[br]:mb-8">{children}</li>
                    ),
                  },
                  marks: {
                    strong: ({ children }) => (
                      <strong className="font-semibold text-gray-950">{children}</strong>
                    ),
                    code: ({ children }) => (
                      <>
                        <span aria-hidden>`</span>
                        <code className="text-[15px]/8 font-semibold text-gray-950">
                          {children}
                        </code>
                        <span aria-hidden>`</span>
                      </>
                    ),
                    link: ({ children, value }) => (
                      <Link
                        href={value.href}
                        className="font-medium text-gray-950 underline decoration-gray-400 underline-offset-4 hover:decoration-gray-600"
                      >
                        {children}
                      </Link>
                    ),
                  },
                }}
              />
            )}

            {/* Back to Blogs */}
            <div className="mt-10">
              <Link href={"/blog"} className="flex items-center gap-1">
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

// Sidebar component
const BlogLeft = async ({ slug }: { slug: string }) => {
  const categories = await getBlogCategories();
  const latestBlogs = await getOthersBlog(slug, 5); // Only latest 5 blogs

  return (
    <div>
      {/* Blog Categories */}
      <div className="border border-lightColor p-5 rounded-md">
        <Title className="text-base">Blog Categories</Title>
        <div className="space-y-2 mt-2">
          {categories?.map((category, index) => (
            <div
              key={index}
              className="flex justify-between items-center text-lightColor/90 text-sm py-2 border-b last:border-b-0 hover:text-shop_dark_green hover:font-semibold hoverEffect cursor-pointer"
            >
              <p>{category.title}</p>
              <p className="text-darkColor font-semibold">
                {category.blogCount || 0} {/* Add blogCount in your query if possible */}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Latest Blogs */}
      <div className="border border-lightColor p-5 rounded-md mt-10">
        <Title className="text-base">Latest Blogs</Title>
        <div className="space-y-4 mt-4">
          {latestBlogs?.map((blog: Blog, index: number) => (
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
                  className="w-16 h-16 object-cover rounded-full border-[1px] border-shop_dark_green/10 group-hover:border-shop_dark_green hoverEffect"
                />
              )}
              <p className="line-clamp-2 text-sm text-lightColor group-hover:text-shop_dark_green hoverEffect">
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
