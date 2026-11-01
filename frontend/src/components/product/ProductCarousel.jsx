/**
 * Product row used on the home page. A plain grid rather than a side-scroller,
 * so customers on phones can see every item without swiping.
 */
import ProductCard, { ProductCardSkeleton } from "./ProductCard";

export default function ProductCarousel({ products, loading, count = 4 }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4 lg:gap-x-6">
      {loading
        ? Array.from({ length: count }).map((_, i) => <ProductCardSkeleton key={i} />)
        : products.map((product) => <ProductCard key={product.id} product={product} />)}
    </div>
  );
}
