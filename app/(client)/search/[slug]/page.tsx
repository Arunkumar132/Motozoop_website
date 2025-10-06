import { client } from "@/lib/sanityClient";
import Image from "next/image";

// Helper function to fetch a product by slug
async function getProductBySlug(slug: string) {
  return client.fetch(
    `*[_type=="product" && slug.current==$slug][0]{
      _id,
      name,
      price,
      description,
      "imageUrl": image.asset->url,
      stock
    }`,
    { slug }
  );
}

export default async function SingleProductPage({ params }: { params: { slug: string } }) {
  const slug = await params.slug; // await is needed in app router
  const product = await getProductBySlug(slug);

  if (!product) return <p className="p-4">Product not found.</p>;

  const isStock = product?.stock > 0;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

      {product.imageUrl ? (
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={600}
          height={400}
          className="w-full max-h-96 object-cover rounded mb-4"
        />
      ) : (
        <div className="w-full h-64 bg-gray-200 flex items-center justify-center mb-4">
          No Image
        </div>
      )}

      <p className="text-lg font-semibold mb-2">₹{product.price}</p>
      <p className="mb-2">{isStock ? "In Stock" : "Out of Stock"}</p>
      <p>{product.description || "No description available."}</p>
    </div>
  );
}
