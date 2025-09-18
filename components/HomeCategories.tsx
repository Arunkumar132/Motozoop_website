import React from "react";
import { Title } from "./Title";
import { Category } from "@/sanity.types";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

const HomeCategories = ({ categories }: { categories: Category[] }) => {
    return(
        <div className="bg-white border border-shop_light_green/20 my-10 md:my-20 p-5 lg:p-7 rounded-md">
            <Title className="border-b pb-3">Popular Categories</Title>
            <div>
                {categories?.map((category) => (
                    <div key={category?._id}>
                        {category?.image && (
                            <Image
                                src={urlFor(category?.image).url()}
                                alt='categotyImage'
                                width={500}
                                height={500}
                                className='w-full h-full object-contain group-hover:scale-110 hoverEffect'
                            />
                        )}
                    </div>))}
            </div>
        </div>
    );
};

export default HomeCategories;