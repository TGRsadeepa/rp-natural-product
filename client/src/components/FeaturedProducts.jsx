import products from "../data/products";
import ProductCard from "./ProductCard";

function FeaturedProducts() {
  return (
    <section className="py-24 bg-[#f8f6ef]">

      <div className="max-w-7xl mx-auto px-8">

        <div className="text-center">

          <p className="uppercase tracking-[5px] text-green-700 font-semibold">
            Featured Collection
          </p>

          <h2 className="text-5xl font-bold mt-4">
            Our Best Sellers
          </h2>

          <p className="mt-5 text-gray-600 text-lg">
            Carefully selected natural products for a healthier lifestyle.
          </p>

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 mt-20">

          {products.map((product) => (

            <ProductCard
              key={product.id}
              product={product}
            />

          ))}

        </div>

      </div>

    </section>
  );
}

export default FeaturedProducts;