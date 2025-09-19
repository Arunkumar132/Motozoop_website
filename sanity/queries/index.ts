import { sanityFetch } from "../lib/live";

const getCategories = async (quantity?: number) => {
    try{
        const query = quantity
            ? `*[_typr =='category] | order(name asc) [0...$quantity] {
                ...,
                'productCount': count(*[_type == 'product' && references(^._is)])
            }`
            : `*[_typr =='category] | order(name asc) {
                ...,
                'productCount': count(*[_type == 'product' && references(^._is)])
            }`;
        const {data}=await sanityFetch({
            query,
            params: quantity ? {quantity} : {},
        });
    } catch (error) {
        console.log("Error fetching categories", error);
        return [];
    }
};


export {getCategories};