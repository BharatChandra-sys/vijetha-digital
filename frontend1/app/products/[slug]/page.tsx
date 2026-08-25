import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import JsonLd from '@/components/seo/JsonLd';
import ProductDetailLoader from '@/components/product/ProductDetailLoader';
import { PRODUCTS, getProductBySlug, getRelatedProducts } from '@/lib/products-data';
import { PHONE_RAW } from '@/lib/constants';

// Force dynamic rendering — product data will be fetched per-request once
// connected to the backend API. No static pre-building of product pages.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// generateStaticParams removed intentionally — pages are rendered on-demand (SSR).
// Re-add it when you want ISR/static generation with revalidation periods.

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: 'Product Not Found' };
  return {
    title: `${product.name} in Hyderabad | Vijetha Digital`,
    description: product.longDesc.slice(0, 150),
    alternates: { canonical: `https://vijethadigital.com/products/${product.slug}` },
    openGraph: {
      title: `${product.name} in Hyderabad | Vijetha Digital`,
      description: product.desc,
      url: `https://vijethadigital.com/products/${product.slug}`,
      type: 'website',
      images: [{ url: product.image, width: 800, height: 600, alt: product.name }],
    },
  };
}

export default async function ProductPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = getRelatedProducts(product);

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `https://vijethadigital.com/products/${product.slug}`,
    name: product.name,
    description: product.longDesc,
    url: `https://vijethadigital.com/products/${product.slug}`,
    image: `https://vijethadigital.com${product.image}`,
    brand: { '@type': 'Brand', name: 'Vijetha Digital' },
    manufacturer: {
      '@type': 'Organization',
      '@id': 'https://vijethadigital.com/#organization',
      name: 'Vijetha Digital',
    },
    category: product.category,
    // aggregateRating and review removed - will be re-added with real data
    offers: {
      '@type': 'Offer',
      url: `https://vijethadigital.com/products/${product.slug}`,
      availability: 'https://schema.org/InStock',
      price: product.priceNumeric.toString(),
      priceCurrency: 'INR',
      validFrom: '2026-01-01T00:00:00Z',
      priceValidUntil: '2027-12-31',
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'IN',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 7,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn',
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: { '@type': 'MonetaryAmount', value: '0', currency: 'INR' },
        shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'IN' },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: { '@type': 'QuantitativeValue', minValue: 1, maxValue: 7, unitCode: 'DAY' },
          transitTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 1, unitCode: 'DAY' },
        },
      },
      seller: {
        '@type': 'Organization',
        '@id': 'https://vijethadigital.com/#organization',
        name: 'Vijetha Digital',
      },
    },
    additionalProperty: product.specs.map(s => ({
      '@type': 'PropertyValue',
      name: s.label,
      value: s.value,
    })),
  };

  const faqSchema = product.faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: product.faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  } : null;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://vijethadigital.com/' },
      { '@type': 'ListItem', position: 2, name: 'Products', item: 'https://vijethadigital.com/products' },
      { '@type': 'ListItem', position: 3, name: product.name, item: `https://vijethadigital.com/products/${product.slug}` },
    ],
  };

  // Serialise to plain objects for the client component boundary
  const productData = JSON.parse(JSON.stringify(product));
  const relatedData = JSON.parse(JSON.stringify(related));

  return (
    <>
      <Header />
      <ProductDetailLoader
        product={productData}
        related={relatedData}
        waPhoneRaw={PHONE_RAW}
      />
      <Footer />
      <JsonLd data={productSchema} />
      {faqSchema && <JsonLd data={faqSchema} />}
      <JsonLd data={breadcrumbSchema} />
    </>
  );
}
