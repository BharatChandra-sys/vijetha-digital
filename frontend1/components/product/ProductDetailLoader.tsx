'use client';

// This client wrapper exists because `ssr: false` is not allowed in Server Components.
// ProductDetail uses useState for gallery/accordion — SSR would cause hydration mismatches.
// When we move to dynamic product data from an API, this loader can be extended
// to fetch data client-side or via Suspense while still disabling SSR for the UI.

import dynamic from 'next/dynamic';
import type { Product } from '@/lib/products-data';

const ProductDetail = dynamic(() => import('./ProductDetail'), {
  ssr: false,
  loading: () => (
    <div style={{ minHeight: '80vh', backgroundColor: '#fff' }} aria-busy="true" />
  ),
});

export default function ProductDetailLoader({
  product,
  related,
  waPhoneRaw,
}: {
  product: Product;
  related: Product[];
  waPhoneRaw: string;
}) {
  return (
    <ProductDetail
      product={product}
      related={related}
      waPhoneRaw={waPhoneRaw}
    />
  );
}
