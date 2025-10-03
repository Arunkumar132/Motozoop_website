import { sanityFetch } from "../lib/live";
import { BLOG_CATEGORIES, DEAL_PRODUCTS, GET_ALL_BLOG, LATEST_BLOG_QUERY, OTHER_BLOGS, PRODUCTS_BY_SLUG_QUERY, SINGLE_BLOG } from "./query";

const getCategories = async (quantity?: number) => {
  try {
    const query = quantity
      ? `*[_type =='category'] | order(name asc) [0...$quantity] {
          ...,
          'productCount': count(*[_type == 'product' && references(^._id)])
        }`
      : `*[_type =='category'] | order(name asc) {
          ...,
          'productCount': count(*[_type == 'product' && references(^._id)])
        }`;

    const { data } = await sanityFetch({
      query,
      params: quantity ? { quantity } : {},
    });

    return data;
  } catch (error) {
    console.log("Error fetching categories", error);
    return [];
  }
};

const getLatestBlogs = async () => {
  try {
    const { data } = await sanityFetch({ query: LATEST_BLOG_QUERY });
    return data ?? [];
  } catch (error) {
    console.log("Error fetching latest blogs", error);
    return [];
  }
};

const getDealProducts = async () => {
  try {
    const { data } = await sanityFetch({ query: DEAL_PRODUCTS });
    return data ?? [];
  } catch (error) {
    console.log("Error fetching deal Products", error);
    return [];
  }
};

const getProductBySlug = async(slug : string) =>{
  try {
    const product = await sanityFetch({
      query: PRODUCTS_BY_SLUG_QUERY,
      params:{
        slug
      }
    })
    return product?.data || null;
  } catch (error) {
    console.error("Error",error);
    return null;
  }
};

const getAllBlogs = async (quantity: number) => {
  try {
    const { data } = await sanityFetch({
      query: GET_ALL_BLOG,
      params: { quantity },
    });
    return data ?? [];
  } catch (error) {
    console.log("Error fetching all blogs", error);
    return [];
  }
};

const getSingleBlog = async (slug: string) => {
  try {
    const { data } = await sanityFetch({
      query: SINGLE_BLOG,
      params: { slug },
    });
    return data ?? [];
  } catch (error) {
    console.log("Error fetching single blog", error);
    return [];
  }
};

const getBlogCategories = async () => {
  try {
    const { data } = await sanityFetch({
      query: BLOG_CATEGORIES,
    });
    return data ?? [];
  } catch (error) {
    console.log ("Error fetching all brands:",error)
    return[];
  }
};

const getOthersBlog = async (slug: string, quantity: number) => {
  try {
    const { data } = await sanityFetch({
      query: OTHER_BLOGS,
      params: { slug, quantity },
    });
    return data ?? [];
  } catch (error) {
    console.log("Error fetching other blogs", error);
    return [];
  }
};

export { getCategories, getLatestBlogs, getDealProducts, getProductBySlug, getAllBlogs, getSingleBlog, getBlogCategories, getOthersBlog };
