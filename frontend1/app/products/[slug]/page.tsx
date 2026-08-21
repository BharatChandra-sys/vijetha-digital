import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import JsonLd from '@/components/seo/JsonLd';
import StructuredContent from '@/components/seo/StructuredContent';

import { PRODUCTS, getProductBySlug, getRelatedProducts } from '@/lib/products-data';
import { WA_URL, PHONE_RAW } from '@/lib/constants';

const font = "'helvetica-w01-roman','Helvetica Neue',Helvetica,Arial,sans-serif";
const fontBold = "'helvetica-w01-bold','Helvetica Neue',Helvetica,Arial,sans-serif";

// Generate all 30 product routes at build time
export function generateStaticParams() {
  return PRODUCTS.map(p => ({ slug: p.slug }));
}

// Dynamic metadata per product
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: 'Product Not Found' };

  return {
    title: `${product.name} in Hyderabad | Vijetha Digital`,
    description: `${product.longDesc.slice(0, 150)}`,
    keywords: `${product.name} Hyderabad, ${product.name.toLowerCase()} price, ${product.category} Hyderabad, Vijetha Digital`,
    alternates: {
      canonical: `https://vijethadigital.com/products/${product.slug}`,
    },
    openGraph: {
      title: `${product.name} in Hyderabad | Vijetha Digital`,
      description: product.desc,
      url: `https://vijethadigital.com/products/${product.slug}`,
      type: 'website',
      images: [{ url: product.image, width: 800, height: 600, alt: product.name }],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = getRelatedProducts(product);
  const waText = encodeURIComponent(`Hi! I would like to enquire about ${product.name}.`);

  // Full Product schema with merchant listing properties for rich results
  // GSC-optimized with all required fields: aggregateRating, review, shipping, returns
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
    // ✅ GSC FIX: Dynamic aggregateRating from product data
    ...(product.aggregateRating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.aggregateRating.ratingValue,
        reviewCount: product.aggregateRating.reviewCount,
        bestRating: '5',
        worstRating: '1',
      },
    }),
    // ✅ GSC FIX: Dynamic reviews from product data
    ...(product.reviews && product.reviews.length > 0 && {
      review: product.reviews.map(r => ({
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: r.rating.toString(),
          bestRating: '5',
        },
        author: {
          '@type': 'Person',
          name: r.author,
        },
        datePublished: r.date,
        reviewBody: r.comment,
      })),
    }),
    offers: {
      '@type': 'Offer',
      url: `https://vijethadigital.com/products/${product.slug}`,
      availability: 'https://schema.org/InStock',
      price: product.priceNumeric.toString(),
      priceCurrency: 'INR',
      // ✅ GSC FIX: Add validFrom date
      validFrom: '2026-01-01T00:00:00Z',
      priceValidUntil: '2027-12-31',
      // ✅ GSC FIX: Complete return policy with returnMethod and returnFees
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'IN',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 7,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn',
      },
      // ✅ GSC FIX: Complete shipping details with transitTime and shippingDestination
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: { '@type': 'MonetaryAmount', value: '0', currency: 'INR' },
        // ✅ GSC FIX: Add shippingDestination
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'IN',
          addressRegion: ['TG', 'AP', 'KA'], // Telangana, Andhra Pradesh, Karnataka
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: { '@type': 'QuantitativeValue', minValue: 1, maxValue: 7, unitCode: 'DAY' },
          // ✅ GSC FIX: Add transitTime (local Hyderabad delivery)
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

  // FAQ schema per product for featured snippets
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: product.faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  // Breadcrumb schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://vijethadigital.com/' },
      { '@type': 'ListItem', position: 2, name: 'Products', item: 'https://vijethadigital.com/products' },
      { '@type': 'ListItem', position: 3, name: product.name, item: `https://vijethadigital.com/products/${product.slug}` },
    ],
  };

  return (
    <>
      <Header />

      {/* Breadcrumb — visible */}
      <div className="product-breadcrumb" style={{ backgroundColor: '#f9f9f7', borderBottom: '1px solid #e8e8e4', paddingTop: '88px', paddingBottom: '12px' }}>
        <div className="wix-container">
          <p style={{ fontFamily: font, fontSize: '12px', color: 'rgb(85,78,78)' }}>
            <a href="/" style={{ color: 'rgb(85,78,78)', textDecoration: 'none' }}>Home</a>
            {' / '}
            <a href="/products" style={{ color: 'rgb(85,78,78)', textDecoration: 'none' }}>Products</a>
            {' / '}
            <span style={{ color: '#000' }}>{product.name}</span>
          </p>
        </div>
      </div>

      {/* Hero */}
      <section style={{ backgroundColor: '#f1f0eb', paddingTop: '64px', paddingBottom: '72px' }}>
        <div className="wix-container">
          <div className="prod-hero-grid">
            {/* Image */}
            <div style={{ backgroundColor: '#e8e8e4', aspectRatio: '4/3', overflow: 'hidden' }}>
              <img src={product.image} alt={`${product.name} in Hyderabad — Vijetha Digital`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            {/* Info */}
            <div>
              <p style={{ fontFamily: font, fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgb(85,78,78)', marginBottom: '12px' }}>
                {product.category}
              </p>
              <h1 style={{ fontFamily: font, fontSize: 'clamp(28px, 3.5vw, 48px)', fontWeight: 400, lineHeight: 1.1, color: '#000', marginBottom: '16px' }}>
                {product.name}
              </h1>
              <p style={{ fontFamily: font, fontSize: '16px', lineHeight: '1.7em', color: 'rgb(85,78,78)', marginBottom: '24px' }}>
                {product.longDesc}
              </p>
              <p style={{ fontFamily: fontBold, fontSize: '22px', color: '#000', marginBottom: '28px' }}>
                {product.price}
              </p>
              {/* Specs */}
              <div style={{ marginBottom: '32px', borderTop: '1px solid #e8e8e4', paddingTop: '24px' }}>
                {product.specs.map(s => (
                  <div key={s.label} style={{ display: 'flex', gap: '16px', paddingBottom: '10px', borderBottom: '1px solid #f1f0eb' }}>
                    <span style={{ fontFamily: font, fontSize: '13px', color: 'rgb(85,78,78)', minWidth: '140px' }}>{s.label}</span>
                    <span style={{ fontFamily: fontBold, fontSize: '13px', color: '#000' }}>{s.value}</span>
                  </div>
                ))}
              </div>
              {/* CTAs */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <a href={`https://wa.me/${PHONE_RAW}?text=${waText}`} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#25d366', color: '#fff', fontFamily: font, fontSize: '14px', padding: '14px 28px', textDecoration: 'none' }}>
                  WhatsApp for Quote
                </a>
                <a href="/contact" style={{ display: 'inline-flex', alignItems: 'center', backgroundColor: '#000', color: '#fff', fontFamily: font, fontSize: '14px', padding: '14px 28px', textDecoration: 'none' }}>
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ — featured snippet ready */}
      {product.faqs.length > 0 && (
        <section style={{ backgroundColor: '#fff', padding: '72px 0' }}>
          <div className="wix-container" style={{ maxWidth: '860px' }}>
            <h2 style={{ fontFamily: font, fontSize: 'clamp(20px, 2.2vw, 30px)', fontWeight: 400, color: '#000', marginBottom: '32px' }}>
              {product.name} — frequently asked questions
            </h2>
            <div style={{ display: 'grid', gap: '16px' }}>
              {product.faqs.map(f => (
                <div key={f.q} style={{ backgroundColor: '#f9f9f7', padding: '24px 28px', border: '1px solid #e8e8e4' }}>
                  <p style={{ fontFamily: fontBold, fontSize: '16px', color: '#000', marginBottom: '8px' }}>{f.q}</p>
                  <p style={{ fontFamily: font, fontSize: '15px', lineHeight: '1.65em', color: 'rgb(85,78,78)' }}>{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Products */}
      {related.length > 0 && (
        <section style={{ backgroundColor: '#f1f0eb', padding: '72px 0' }}>
          <div className="wix-container">
            <h2 style={{ fontFamily: font, fontSize: 'clamp(18px, 2vw, 26px)', fontWeight: 400, color: '#000', marginBottom: '32px' }}>
              Related products
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
              {related.map(p => (
                <a key={p.slug} href={`/products/${p.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ backgroundColor: '#fff', padding: '20px', border: '1px solid #e8e8e4' }}>
                    <p style={{ fontFamily: font, fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgb(85,78,78)', marginBottom: '6px' }}>{p.category}</p>
                    <p style={{ fontFamily: fontBold, fontSize: '14px', color: '#000', marginBottom: '8px' }}>{p.name}</p>
                    <p style={{ fontFamily: font, fontSize: '12px', color: 'rgb(85,78,78)', lineHeight: '1.5em', marginBottom: '8px' }}>{p.desc}</p>
                    <p style={{ fontFamily: fontBold, fontSize: '13px', color: '#000' }}>{p.price}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Complete Product Information — SEO-rich visible content */}
      <section style={{ backgroundColor: '#f9f9f7', padding: '72px 0', borderTop: '1px solid #e8e8e4' }}>
        <div className="wix-container" style={{ maxWidth: '860px' }}>
          <h2 style={{ fontFamily: font, fontSize: 'clamp(18px, 2vw, 24px)', fontWeight: 400, color: '#000', marginBottom: '28px' }}>
            Complete information about {product.name} in Hyderabad
          </h2>
          <div style={{ display: 'grid', gap: '16px' }}>
            <div style={{ backgroundColor: '#fff', padding: '20px 24px', border: '1px solid #e8e8e4' }}>
              <h3 style={{ fontFamily: fontBold, fontSize: '14px', color: '#000', marginBottom: '8px' }}>Manufacturing & Supply</h3>
              <p style={{ fontFamily: font, fontSize: '14px', lineHeight: '1.7em', color: 'rgb(85,78,78)' }}>
                {product.name} manufactured and supplied by Vijetha Digital, leading {product.category} company in Hyderabad since 2009. {product.longDesc}
              </p>
            </div>
            <div style={{ backgroundColor: '#fff', padding: '20px 24px', border: '1px solid #e8e8e4' }}>
              <h3 style={{ fontFamily: fontBold, fontSize: '14px', color: '#000', marginBottom: '8px' }}>Technical Specifications</h3>
              <p style={{ fontFamily: font, fontSize: '14px', lineHeight: '1.7em', color: 'rgb(85,78,78)' }}>
                {product.specs.map(s => `${s.label}: ${s.value}`).join(' • ')}
              </p>
            </div>
            <div style={{ backgroundColor: '#fff', padding: '20px 24px', border: '1px solid #e8e8e4' }}>
              <h3 style={{ fontFamily: fontBold, fontSize: '14px', color: '#000', marginBottom: '8px' }}>Pricing & Contact</h3>
              <p style={{ fontFamily: font, fontSize: '14px', lineHeight: '1.7em', color: 'rgb(85,78,78)' }}>
                Contact Vijetha Digital for {product.name} price in Hyderabad: call +91 92481 95552 or WhatsApp for instant quote. Typical response time: 1-2 hours.
              </p>
            </div>
            <div style={{ backgroundColor: '#fff', padding: '20px 24px', border: '1px solid #e8e8e4' }}>
              <h3 style={{ fontFamily: fontBold, fontSize: '14px', color: '#000', marginBottom: '8px' }}>Delivery Coverage</h3>
              <p style={{ fontFamily: font, fontSize: '14px', lineHeight: '1.7em', color: 'rgb(85,78,78)' }}>
                {product.name} available for delivery across Hyderabad, Secunderabad, Telangana, Andhra Pradesh, Karnataka, and pan-India shipping supported for bulk orders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ backgroundColor: '#1c1d20', padding: '64px 0' }}>
        <div className="wix-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '32px' }}>
          <div>
            <h2 style={{ fontFamily: font, fontSize: 'clamp(20px, 2.2vw, 30px)', fontWeight: 400, color: '#fff', marginBottom: '8px' }}>
              Get a quote for {product.name} in Hyderabad
            </h2>
            <p style={{ fontFamily: font, fontSize: '15px', color: 'rgba(255,255,255,0.55)' }}>
              Call +91 92481 95552 or WhatsApp — we respond within 2 hours.
            </p>
          </div>
          <a href={WA_URL} target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', backgroundColor: '#fff', color: '#000', fontFamily: font, fontSize: '14px', padding: '15px 40px', textDecoration: 'none', flexShrink: 0 }}>
            WhatsApp Now
          </a>
        </div>
        {/* Structured SEO Content */}
        <div className="wix-container" style={{ marginTop: '40px' }}>
          <StructuredContent
            title={`${product.name} - Complete Specifications & Service Details`}
            content={[
              `${product.name} in Hyderabad — manufactured and supplied by Vijetha Digital, leading ${product.category} company in Hyderabad since 2009.`,
              `${product.longDesc}`,
              `${product.name} specifications: ${product.specs.map(s => `${s.label}: ${s.value}`).join(', ')}.`,
              `Contact Vijetha Digital for ${product.name} price in Hyderabad: call +91 92481 95552 or WhatsApp for instant quote.`,
              `${product.name} available for delivery across Hyderabad, Secunderabad, Telangana, Andhra Pradesh, Karnataka, and pan-India.`,
            ]}
          />
        </div>
      </section>

      <Footer />
      <JsonLd data={productSchema} />
      <JsonLd data={faqSchema} />
      <JsonLd data={breadcrumbSchema} />

      <style>{`
        .product-breadcrumb { padding-top: 88px; }
        .prod-hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: start; }
        @media (max-width: 900px) { 
          .prod-hero-grid { grid-template-columns: 1fr; gap: 36px; }
        }
        @media (max-width: 768px) {
          .product-breadcrumb { padding-top: 80px !important; }
        }
        @media (max-width: 600px) {
          div[style*="grid-template-columns: repeat(4, 1fr)"] { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 400px) {
          div[style*="grid-template-columns: repeat(4, 1fr)"],
          div[style*="grid-template-columns: repeat(2, 1fr)"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
