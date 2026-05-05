import { useState } from "react";

const BADGE_MAP = {
  "3D Sign Board":              { label: "Premium",      cls: "bg-purple-600" },
  "Aluminium Sign Board":       { label: "Premium",      cls: "bg-purple-600" },
  "Glow Sign Board":            { label: "Best Seller",  cls: "bg-coral-accent" },
  "Vinyl Sign Board":           { label: "Best Seller",  cls: "bg-coral-accent" },
  "Open LED Sign Board":        { label: "Best Seller",  cls: "bg-coral-accent" },
  "Canvas Printing":            { label: "Premium",      cls: "bg-purple-600" },
  "Catalogue Printing":         { label: "Popular",      cls: "bg-blue-600"   },
  "Flex Printing":              { label: "Best Seller",  cls: "bg-coral-accent" },
  "Gift Voucher Printing":      { label: "Eco Friendly", cls: "bg-green-600"  },
  "Offset Printing":            { label: "Best Seller",  cls: "bg-coral-accent" },
  "Heavy Roll Up Banner Stand": { label: "Premium",      cls: "bg-purple-600" },
  "Roller Banner Stand":        { label: "Best Seller",  cls: "bg-coral-accent" },
  "Outdoor Demo Tent":          { label: "Premium",      cls: "bg-purple-600" },
  "Demo Tent 6×6×7 ft":         { label: "Best Seller",  cls: "bg-coral-accent" },
  "Demo Tent 4×4×7 ft":         { label: "Popular",      cls: "bg-blue-600"   },
  "Acrylic Sign Board":         { label: "Popular",      cls: "bg-blue-600"   },
  "LED Acrylic Sign Board":     { label: "Premium",      cls: "bg-purple-600" },
  "ACP Board":                  { label: "Best Seller",  cls: "bg-coral-accent" },
  "Star Flex Printing":         { label: "Popular",      cls: "bg-blue-600"   },
  "Vinyl Printing":             { label: "Best Seller",  cls: "bg-coral-accent" },
  "Business Card Printing":     { label: "Best Seller",  cls: "bg-coral-accent" },
  "Promo Table":                { label: "Popular",      cls: "bg-blue-600"   },
  "Cutout Sprint":              { label: "Popular",      cls: "bg-blue-600"   },
  "Vehicle Branding":           { label: "Premium",      cls: "bg-purple-600" },
  "T-Shirt Printing":           { label: "Popular",      cls: "bg-blue-600"   },
  "SS Letter Sign Board":       { label: "Premium",      cls: "bg-purple-600" },
  "ACP Cladding":               { label: "Best Seller",  cls: "bg-coral-accent" },
  "In-Shop Branding":           { label: "Popular",      cls: "bg-blue-600"   },
  "Translite Printing":         { label: "Popular",      cls: "bg-blue-600"   },
};

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-[12px] overflow-hidden border border-stone-border/50 flex flex-col">
      {/* Image skeleton */}
      <div className="aspect-[4/3] bg-stone-light relative overflow-hidden">
        <div className="absolute inset-0 skeleton" />
      </div>
      {/* Content skeleton */}
      <div className="p-3 sm:p-4 flex flex-col gap-2 flex-1">
        <div className="h-2.5 skeleton rounded w-1/3" />
        <div className="h-4 skeleton rounded w-4/5" />
        <div className="h-3 skeleton rounded w-full" />
        <div className="h-3 skeleton rounded w-2/3" />
        <div className="mt-auto pt-2 border-t border-stone-border/40 flex items-center justify-between gap-2">
          <div className="space-y-1">
            <div className="h-2 skeleton rounded w-8" />
            <div className="h-5 skeleton rounded w-20" />
          </div>
          <div className="h-8 w-16 skeleton rounded-[8px]" />
        </div>
      </div>
    </div>
  );
}

export default function ProductCard({ product, navigate, compact = false }) {
  const [imgError, setImgError] = useState(false);
  const badge = BADGE_MAP[product.name];
  const price = Number(product.base_price);

  return (
    <div
      className="bg-white rounded-[12px] overflow-hidden border border-stone-border/50 flex flex-col h-full cursor-pointer group transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover active:scale-[0.98]"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)" }}
      onClick={() => navigate(`/products/${product.id}`)}
    >
      {/* Image */}
      <div className={`${compact ? "aspect-[4/3]" : "aspect-[4/3]"} bg-stone-light relative overflow-hidden flex-shrink-0`}>
        {product.image_url && !imgError ? (
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-stone-light to-surface-2">
            <span className="material-symbols-outlined text-plum-deep/15 text-4xl">print</span>
            <span className="text-[0.625rem] text-text-muted/40 font-medium text-center px-3 leading-tight uppercase tracking-wide">{product.category}</span>
          </div>
        )}

        {/* Badge */}
        {badge && (
          <span className={`absolute top-2 left-2 ${badge.cls} text-white text-[0.5625rem] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide`}>
            {badge.label}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        <span className="text-[0.5625rem] font-semibold text-text-muted uppercase tracking-widest mb-0.5 truncate">
          {product.category}
        </span>
        <h3 className="text-[0.8125rem] sm:text-[0.9375rem] font-bold text-plum-deep leading-snug line-clamp-2 mb-1 group-hover:text-coral-accent transition-colors">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-[0.75rem] text-text-muted line-clamp-2 leading-relaxed mb-2 hidden sm:block flex-1">
            {product.description}
          </p>
        )}

        {/* Price + CTA */}
        <div className="mt-auto pt-2 border-t border-stone-border/40">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <span className="text-[0.5625rem] text-text-muted font-medium block">From</span>
              <div className="flex items-baseline gap-0.5">
                <span className="text-[0.9375rem] sm:text-[1.0625rem] font-extrabold text-plum-deep leading-none">
                  ₹{price.toLocaleString("en-IN")}
                </span>
                <span className="text-[0.5625rem] text-text-muted hidden sm:inline ml-0.5">
                  / {product.unit || "unit"}
                </span>
              </div>
            </div>
            <button
              className="inline-flex items-center justify-center min-h-[44px] h-11 px-4 sm:px-5 bg-coral-accent hover:bg-coral-dark text-white font-bold rounded-[10px] text-[0.8125rem] sm:text-[0.875rem] flex-shrink-0 transition-colors active:scale-[0.97]"
              onClick={e => { e.stopPropagation(); navigate(`/products/${product.id}`); }}
            >
              Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
