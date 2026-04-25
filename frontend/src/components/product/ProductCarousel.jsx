/**
 * ProductCarousel — horizontal scroll on mobile, grid on desktop
 * Matches the pattern used by Flipkart, Amazon, Meesho for product rows
 */
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard, { ProductCardSkeleton } from "./ProductCard";

export default function ProductCarousel({ products, loading, count = 8 }) {
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir * 280, behavior: "smooth" });
  };

  if (loading) {
    return (
      <>
        {/* Mobile skeleton — horizontal strip */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 sm:hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-[160px]">
              <ProductCardSkeleton />
            </div>
          ))}
        </div>
        {/* Desktop skeleton — grid */}
        <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: count }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      {/* ── MOBILE: horizontal scroll carousel ── */}
      <div className="relative sm:hidden">
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {products.map(product => (
            <div
              key={product.id}
              className="flex-shrink-0 w-[168px]"
              style={{ scrollSnapAlign: "start" }}
            >
              <ProductCard product={product} navigate={navigate} compact />
            </div>
          ))}
        </div>

        {/* Scroll hint fade on right */}
        <div className="absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-warm-white to-transparent pointer-events-none" />
      </div>

      {/* ── DESKTOP: standard grid ── */}
      <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 stagger-children">
        {products.map(product => (
          <ProductCard key={product.id} product={product} navigate={navigate} />
        ))}
      </div>
    </>
  );
}
