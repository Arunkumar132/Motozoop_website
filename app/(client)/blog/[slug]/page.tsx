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

interface SingleBlogPageProps {
  params: { slug: string };
}

const SingleBlogPage = async ({ params }: SingleBlogPageProps) => {
  const { slug } = params;
  const blog = await getSingleBlog(slug);

  if (!blog) return notFound();

  return (
    <div className="py-10">
      <Container className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Main Blog */}
        <div className="lg:col-span-3">
          {blog.mainImage && (
            <Image
              src={urlFor(blog.mainImage).url() || "/placeholder.jpg"}
              alt={blog.title || "Blog image"}
              width={800}
              height={500}
              priority
              className="w-full max-h-[500px] object-cover rounded-lg"
            />
          )}

          <div className="text-xs flex items-center gap-5 my-7 flex-wrap">
            {blog.blogcategories?.map((item) => (
              <p
                key={item.title}
                className="font-semibold text-shop_dark_green tracking-wider relative group cursor-pointer"
              >
                {item.title}
                <span className="absolute left-0 -bottom-1.5 bg-lightColor/30 inline-block w-full h-[2px] group-hover:bg-shop_dark_green hoverEffect" />
              </p>
            ))}

            <p className="flex items-center gap-1 text-lightColor relative group hover:cursor-pointer hover:text-shop_dark_green hoverEffect">
              <Pencil size={15} /> {blog.author?.name}
              <span className="absolute left-0 -bottom-1.5 bg-lightColor/30 inline-block w-full h-[2px] group-hover:bg-shop_dark_green hoverEffect" />
            </p>

            <p className="flex items-center gap-1 text-lightColor relative group hover:cursor-pointer hover:text-shop_dark_green hoverEffect">
              <Calendar size={15} /> {dayjs(blog.publishedAt).format("MMMM D, YYYY")}
              <span className="absolute left-0 -bottom-1.5 bg-lightColor/30 inline-block w-full h-[2px] group-hover:bg-shop_dark_green hoverEffect" />
            </p>
          </div>

          <h2 className="text-3xl font-bold mb-5">{blog.title}</h2>

          {blog.body && (
            <div className="text-lightColor flex flex-col gap-5">
              <PortableText
                value={blog.body}
                components={{
                  block: {
                    normal: ({ children }) => (
                      <p className="mb-5 text-base/8 first:mt-0 last:mb-0">{children}</p>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-2xl/8 font-medium my-5">{children}</h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-xl/8 font-medium my-5">{children}</h3>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-shop_dark_green pl-4 italic my-5 text-lightColor/90">
                        {children}
                      </blockquote>
                    ),
                  },
                  types: {
                    image: ({ value }) => (
                      <Image
                        src={urlFor(value).width(2000).url()}
                        alt="Blog image"
                        width={1400}
                        height={1000}
                        className="w-full rounded-2xl object-cover"
                        loading="lazy"
                      />
                    ),
                    separator: ({ value }) => {
                      switch (value?.style) {
                        case "line":
                          return <hr className="border-shop_dark_green my-10" />;
                        case "space":
                          return <div className="my-10" />;
                        default:
                          return null;
                      }
                    },
                  },
                  list: {
                    bullet: ({ children }) => <ul className="list-disc list-inside my-5">{children}</ul>,
                    number: ({ children }) => <ol className="list-decimal list-inside my-5">{children}</ol>,
                  },
                  listItem: {
                    bullet: ({ children }) => <li className="my-2 pl-2 has-[br]:mb-8">{children}</li>,
                    number: ({ children }) => <li className="my-2 pl-2 has-[br]:mb-8">{children}</li>,
                  },
                  marks: {
                    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                    code: ({ children }) => (
                      <>
                        <span aria-hidden>`</span>
                        <code className="bg-gray-200 text-red-600 px-1 py-0.5 rounded font-mono">{children}</code>
                        <span aria-hidden>`</span>
                      </>
                    ),
                    link: ({ children, value }) => {
                      if (!value?.href) return children;
                      return (
                        <Link
                          href={value.href}
                          target={value.blank ? "_blank" : "_self"}
                          className="text-shop_dark_green hover:underline hoverEffect"
                        >
                          {children}
                        </Link>
                      );
                    },
                  },
                }}
              />
              <Link
                href={"/blog"}
                className="inline-block mt-10 text-shop_dark_green hover:underline hoverEffect"
              >
                <ChevronLeftIcon className="inline-block mr-2" />
                <span className="text-sm font-semibold">Back to blogs</span>
              </Link>
            </div>
          )}
        </div>

        {/* Sidebar */}
        {/* Await BlogLeft since it’s async */}
        <React.Suspense fallback={<div>Loading sidebar...</div>}>
          <BlogLeft slug={slug} />
        </React.Suspense>
      </Container>
    </div>
  );
};



interface BlogLeftProps {
  slug: string;
}

const BlogLeft = async ({ slug }: BlogLeftProps) => {
  const categories = await getBlogCategories();
  const blogs = await getOthersBlog(slug, 5);

  return (
    <div className="space-y-10">
      {/* Categories */}
      <div className="border border-darkColor p-5 rounded-lg">
        <Title className="text-base">Blog Categories</Title>
        <div>
          {categories?.map((cat: any) => (
            <div
              key={cat.slug}
              className="flex justify-between items-center text-lightColor/90 text-sm py-2 border-b last:border-b-0 hover:text-shop_dark_green hover:font-semibold hoverEffect cursor-pointer"
            >
              <p>{cat.title}</p>
              <p className="text-darkColor font-semibold">{`[${cat.count || 0}]`}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Other Blogs */}
      <div className="border border-darkColor p-5 rounded-lg">
        <Title className="text-base mb-5">Other Blogs</Title>
        <div className="space-y-4 mt-4">
          {blogs?.map((item: any) => (
            <Link
              href={`/blog/${item.slug}`}
              key={blogs.slug}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-lightColor/10 group hoverEffect"
            >
              {blogs.mainImage && (
                <Image
                  src={urlFor(blogs.mainImage).width(100).height(100).url() || "/placeholder.jpg"}
                  alt={blogs.title || "Blog image"}
                  width={64}
                  height={64}
                  className="w-16 h-16 object-cover rounded-lg border-[1px] border-shop_dark_green/10 group-hover:border-shop_dark_green"
                  loading="lazy"
                />
              )}
              <p className="text-sm font-semibold text-lightColor/90 group-hover:text-shop_dark_green">
                {blogs.title}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};


export default SingleBlogPage;
