import { useState } from "react";
import { Link } from "react-router-dom";
import { CATEGORY_ICON, isTallCategory, rupees, unitLabel } from "../../config/business";

const BADGE_MAP = {
  "3D Sign Board":              "Premium",
  "Aluminium Sign Board":       "Premium",
  "Glow Sign Board":            "Best Seller",
  "Vinyl Sign Board":           "Best Seller",
  "Open LED Sign Board":        "Best Seller",
  "Canvas Printing":            "Premium",
  "Catalogue Printing":         "Popular",
  "Flex Printing":              "Best Seller",
  "Gift Voucher Printing":      "Eco Friendly",
  "Offset Printing":            "Best Seller",
  "Heavy Roll Up Banner Stand": "Premium",
  "Roller Banner Stand":        "Best Seller",
  "Outdoor Demo Tent":          "Premium",
  "Demo Tent 6×6×7 ft":         "Best Seller",
  "Demo Tent 4×4×7 ft":         "Popular",
  "Acrylic Sign Board":         "Popular",
  "LED Acrylic Sign Board":     "Premium",
  "ACP Board":                  "Best Seller",
  "Star Flex Printing":         "Popular",
  "Vinyl Printing":             "Best Seller",
  "Business Card Printing":     "Best Seller",
  "Promo Table":                "Popular",
  "Cutout Sprint":              "Popular",
  "Vehicle Branding":           "Premium",
  "T-Shirt Printing":           "Popular",
  "SS Letter Sign Board":       "Premium",
  "ACP Cladding":               "Best Seller",
  "In-Shop Branding":           "Popular",
  "Translite Printing":         "Popular",
};

export function ProductCardSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="aspect-[4/3] vd-skeleton" />
      <div className="mt-3 h-4 w-4/5 vd-skeleton" />
      <div className="mt-2 h-3 w-1/2 vd-skeleton" />
      <div className="mt-3 h-4 w-1/3 vd-skeleton" />
    </div>
  );
}

export default function ProductCard({ product }) {
  const [imgError, setImgError] = useState(false);
  const badge = BADGE_MAP[product.name];
  const price = Number(product.base_price);

  return (
    <article className="group relative flex h-full flex-col">
      <div className={`vd-frame aspect-[4/3] flex-shrink-0 ${isTallCategory(product.category) ? "vd-frame-contain" : ""}`}>
        {product.image_url && !imgError ? (
          <img
            src={product.image_url}
            alt={product.name}
            width="400"
            height="300"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-ink-3">
            <span className="material-symbols-outlined text-4xl">{CATEGORY_ICON[product.category] || "print"}</span>
          </div>
        )}
        {badge && (
          <span className={`vd-chip absolute left-2 top-2 ${badge === "Best Seller" ? "!bg-accent !text-white" : "!bg-surface"}`}>
            {badge}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col pt-3">
        <p className="truncate text-[0.8125rem] text-ink-2">{product.category}</p>
        <h3 className="mt-0.5 text-[0.9375rem] font-semibold leading-snug sm:text-base">
          {/* Stretched link: the whole card is one real, keyboard-usable link */}
          <Link to={`/products/${product.id}`} className="after:absolute after:inset-0 group-hover:underline underline-offset-2">
            {product.name}
          </Link>
        </h3>
        {product.description && (
          <p className="mt-1 hidden text-sm leading-snug text-ink-2 line-clamp-2 sm:block sm:[display:-webkit-box]">{product.description}</p>
        )}

        <div className="mt-auto flex items-baseline justify-between gap-2 pt-2">
          <p className="vd-price min-w-0 text-[0.8125rem] text-ink-2">
            From <span className="text-base font-bold text-ink">{rupees(price)}</span>
            <span className="hidden sm:inline"> / {unitLabel(product.unit)}</span>
          </p>
          <span className="hidden items-center gap-0.5 whitespace-nowrap text-sm font-semibold text-accent-dark sm:inline-flex" aria-hidden="true">
            Order
            <span className="material-symbols-outlined text-base transition-transform group-hover:translate-x-0.5">arrow_forward</span>
          </span>
        </div>
      </div>
    </article>
  );
}
