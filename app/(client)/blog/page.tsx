import Container from "@/components/Container";
import { Title } from "@/components/Title";
import React from "react";

const SingleBlogPage = ({
    params,
}: {
    params: { slug: string };
}) => {
    const { slug } = params;
    return (
        <div>
            <Container>
                <Title>Single Blog page</Title>
                <p>{slug}</p>
            </Container>
        </div>
    );
};

export default SingleBlogPage;
