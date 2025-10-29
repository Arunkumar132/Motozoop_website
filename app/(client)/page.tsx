// app/(client)/page.tsx
import Container from "@/components/Container";
import HomeBanner from "@/components/HomeBanner";
import HomeCategories from "@/components/HomeCategories";
import LatestBlog from "@/components/LatestBlog";
import ProductGrid from "@/components/ProductGrid";
import { getCategories } from "@/sanity/queries";

export default async function HomePage() {
  const categories = await getCategories(6);

  return (
    <Container>
      {/* ===== Hero Banner Section ===== */}
      <section className="bg-shop-light-pink rounded-lg overflow-hidden mb-10 md:mb-16">
        <HomeBanner />
      </section>

      {/* ===== Product Grid Section ===== */}
      <section className="mb-10 md:mb-16">
        {/* Client-side component must be dynamically imported */}
        <ProductGrid />
      </section>

      {/* ===== Popular Categories Section ===== */}
      <section className="mb-10 md:mb-16">
        <HomeCategories categories={categories} />
      </section>

      {/* ===== Latest Blog Section ===== */}
      <section className="mb-10 md:mb-16">
        <LatestBlog />
      </section>
    </Container>
  );
}
