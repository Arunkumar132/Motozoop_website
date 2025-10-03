import { defineQuery } from "next-sanity";

const LATEST_BLOG_QUERY = defineQuery(
  `*[_type == 'blog' && isLatest == true] | order(name asc){
    ...,
    blogcategories[]->{
      title
    }
  }`
);

const DEAL_PRODUCTS = defineQuery(
  `*[_type == 'product' && status == 'hot'] | order(name asc){
    ...,
    "categories": categories[]->title
  }`
);

const PRODUCTS_BY_SLUG_QUERY = defineQuery(
  `*[_type == 'product' && slug.current == $slug] | order(name asc) [0]`
);

const GET_ALL_BLOG = defineQuery(
  `*[_type == 'blog'] | order(publishedAt desc)[0...$quantity]{
    ...,
    blogcategories[]->{
      title
    }
  }`
);

export { LATEST_BLOG_QUERY, DEAL_PRODUCTS, PRODUCTS_BY_SLUG_QUERY, GET_ALL_BLOG };
