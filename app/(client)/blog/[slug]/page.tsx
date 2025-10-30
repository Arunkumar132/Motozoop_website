// File: app/(client)/blog/[slug]/page.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import dayjs from "dayjs";
import { Calendar, ChevronLeftIcon, Pencil } from "lucide-react";
import { PortableText } from "next-sanity";
import Container from "@/components/Container";
import { urlFor } from "@/sanity/lib/image";
import {
  getBlogCategories,
  getOthersBlog,
  getSingleBlog,
} from "@/sanity/queries";
import type { Blog, BlogCategory } from "@/sanity.types";
import type { Metadata } from "next";

/* -------------------------------------------------------------------------- */
/*                               Static Settings                              */
/* -------------------------------------------------------------------------- */

// ✅ Revalidate every 60 seconds (ISR)
export const revalidate = 60;

/* -------------------------------------------------------------------------- */
/*                              Type Definitions                              */
/* -------------------------------------------------------------------------- */

interface PageProps {
  params: { slug: string };
}

/* -------------------------------------------------------------------------- */
/*                            Static Params (SSG)                             */
/* -------------------------------------------------------------------------- */

export async function generateStaticParams() {
  const blogs: Blog[] = await getOthersBlog("", 1000);
  return blogs
    .filter((b) => b.slug?.current)
    .map((b) => ({
      slug: b.slug!.current!,
    }));
}

/* -------------------------------------------------------------------------- */
/*                            Metadata Generation                             */
/* -------------------------------------------------------------------------- */

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const blog = await getSingleBlog(params.slug);
  if (!blog) {
    return {
      title: "Blog Not Found | MotoZoop",
      description: "The blog you are looking for does not exist.",
    };
  }

  return {
    title: `${blog.title} | MotoZoop`,
    description: blog.excerpt || "Explore the latest insights from MotoZoop.",
    openGraph: {
      title: blog.title,
      description: blog.excerpt || "",
      images: blog.mainImage ? [{ url: urlFor(blog.mainImage).url() }] : [],
      type: "article",
      publishedTime: blog.publishedAt,
      authors: blog.author?.name ? [blog.author.name] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.excerpt || "",
      images: blog.mainImage ? [urlFor(blog.mainImage).url()] : [],
    },
  };
}

/* -------------------------------------------------------------------------- */
/*                                Main Component                              */
/* -------------------------------------------------------------------------- */

export default async function SingleBlogPage({ params }: PageProps) {
  const { slug } = params;

  const blog: Blog | null = await getSingleBlog(slug);
  if (!blog) return notFound();

  return (
    <div className="py-10">
      <Container className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* ---------------------------- Blog Content ---------------------------- */}
        <div className="lg:col-span-3">
          {blog.mainImage && (
            <Image
              src={urlFor(blog.mainImage)?.url() || "/placeholder.jpg"}
              alt={blog.title || "Blog image"}
              width={800}
              height={800}
              priority
              sizes="(max-width: 768px) 100vw, 75vw"
              className="w-full h-auto max-h-[500px] object-cover rounded-lg"
            />
          )}

          {/* Blog Meta Section */}
          <div className="text-xs flex flex-wrap items-center gap-5 my-7">
            <div className="flex flex-wrap items-center gap-2">
              {blog.blogcategories?.map((item: BlogCategory, idx: number) => (
                <p
                  key={idx}
                  className="font-semibold text-shop_dark_green tracking-wider cursor-pointer"
                >
                  {item.title}
                </p>
              ))}
            </div>

            {blog.author?.name && (
              <p className="flex items-center gap-1 text-lightColor relative group hover:cursor-pointer hover:text-shop_dark_green hoverEffect">
                <Pencil size={15} /> {blog.author.name}
                <span className="absolute left-0 -bottom-1.5 bg-lightColor/30 inline-block w-full h-[2px] group-hover:bg-shop_dark_green hoverEffect" />
              </p>
            )}

            {blog.publishedAt && (
              <p className="flex items-center gap-1 text-lightColor relative group hover:cursor-pointer hover:text-shop_dark_green hoverEffect">
                <Calendar size={15} /> {dayjs(blog.publishedAt).format("MMMM D, YYYY")}
                <span className="absolute left-0 -bottom-1.5 bg-lightColor/30 inline-block w-full h-[2px] group-hover:bg-shop_dark_green hoverEffect" />
              </p>
            )}
          </div>

          {/* Blog Body */}
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

        {/* ----------------------------- Sidebar ----------------------------- */}
        <BlogSidebar slug={slug} />
      </Container>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                Sidebar Component                           */
/* -------------------------------------------------------------------------- */

async function BlogSidebar({ slug }: { slug: string }) {
  const categories: BlogCategory[] = await getBlogCategories();
  const latestBlogs: Blog[] = await getOthersBlog(slug, 5);

  return (
    <div className="space-y-8">
      {/* Categories */}
      <div className="border border-lightColor p-5 rounded-md">
        <p className="text-xl font-semibold text-shop_dark_green">Categories</p>
        <ul className="mt-4 space-y-2">
          {categories?.map((cat: BlogCategory) => (
            <li key={cat._id}>
              <Link
                href={`/blog/category/${cat.slug?.current}`}
                className="text-sm text-lightColor hover:text-shop_dark_green transition-colors"
              >
                {cat.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Latest Blogs */}
      <div className="border border-lightColor p-5 rounded-md">
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
                  className="w-16 h-16 object-cover rounded-full border-[1px] border-shop_dark_green/10 group-hover:border-shop_dark_green transition"
                />
              )}
              <p className="line-clamp-2 text-sm text-lightColor group-hover:text-shop_dark_green transition">
                {blog.title}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
