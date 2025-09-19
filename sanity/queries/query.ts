import { defineQuery } from "next-sanity";

const LATEST_BLOG_QUERY = defineQuery(
    `*[_type == 'blog' && isLatest == true] | order(name asc){
    ...,
    blogcategories[]->{
    title
    }}`
);

export { LATEST_BLOG_QUERY };