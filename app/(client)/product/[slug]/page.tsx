import Container from "@/components/Container";
import ImageView from "@/components/ImageView";
import { getProductBySlug } from "@/sanity/queries";
import React from "react";

const SingleProductImage = async({
    params,
}: {
    params: Promise<{slug: string}>;
}) => {

    const { slug } = await params;
    const product = await getProductBySlug(slug);
    return(
        <Container>
            {product?.images && <ImageView />}
            <div className="w-full md:w-1/2 flex flex-col gap-5">Details</div>
        </Container>
    )
}

export default SingleProductImage;