/* Single source of truth for storefront business facts. */

// .env files ship with this placeholder, so treat it as unset.
const PLACEHOLDER_WHATSAPP = "919876543210";
const envWhatsapp = import.meta.env.VITE_WHATSAPP_NUMBER;

export const BUSINESS = {
  name: "Vijetha Digital",
  phone: "+91 79426 43004",
  phoneHref: "tel:+917942643004",
  altPhone: "+91 92481 95552",
  altPhoneHref: "tel:+919248195552",
  whatsapp: envWhatsapp && envWhatsapp !== PLACEHOLDER_WHATSAPP ? envWhatsapp : "919248195552",
  email: "info@vijethadigital.com",
  hours: "Mon – Sat, 9:00 AM – 8:00 PM",
  gstin: "36AGBPC3175H1ZP",
  established: 2002,
  proprietor: "Krishnam Raju",
};

export const whatsappUrl = (text = "") =>
  `https://wa.me/${BUSINESS.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

export const BRANCHES = [
  {
    id: "indira-park",
    name: "Indira Park",
    tag: "Main branch",
    address: "Shop No. 1-2-607/75, 76, Opp NTR Stadium, LIC Colony Rd, Hyderabad – 500029",
    mapQuery: "Vijetha Digital, Opp NTR Stadium, LIC Colony Rd, Hyderabad 500029",
  },
  {
    id: "lakdikapool",
    name: "Lakdikapool",
    address: "H No. 11-5-456, Shop No. 5, Sanapride Complex, Hyderabad – 500004",
    mapQuery: "Sanapride Complex, Lakdikapool, Hyderabad 500004",
  },
  {
    id: "nacharam",
    name: "Nacharam",
    address: "42/B, No. 16, IDA, Nacharam, Hyderabad – 500076",
    mapQuery: "42/B, No. 16, IDA, Nacharam, Hyderabad 500076",
  },
];

export const mapsLink = (branch) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branch.mapQuery)}`;

export const CATEGORIES = ["Sign Boards", "Printing Services", "Banner Stands", "Demo Tents", "Promotional Items"];

export const CATEGORY_LINK = (category) => `/products?category=${encodeURIComponent(category)}`;

export const CATEGORY_ICON = {
  "Sign Boards": "storefront",
  "Printing Services": "print",
  "Banner Stands": "flag",
  "Demo Tents": "holiday_village",
  "Promotional Items": "redeem",
};

/* Real work photos shipped in /public/products */
export const CATEGORY_PHOTO = {
  "Sign Boards": "/products/glow-sign-board.jpg",
  "Printing Services": "/products/offset-printing.jpg",
  "Banner Stands": "/products/roller-banner-stand.jpg",
  "Demo Tents": "/products/demo-tent-6x6x7-ft.jpg",
  "Promotional Items": "/products/gift-voucher-printing.png",
};

/* Tall products that should be shown whole rather than cropped to fill a frame */
export const isTallCategory = (category) => category === "Banner Stands" || category === "Demo Tents";

export const rupees = (value, fraction = 0) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: fraction,
    maximumFractionDigits: fraction || 2,
  })}`;

/* "per sq ft" and "sq ft" both become "sq ft" */
export const unitLabel = (unit) => String(unit || "unit").replace(/^\s*per\s+/i, "");
