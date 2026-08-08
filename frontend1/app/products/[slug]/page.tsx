import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductsContent from '../ProductsContent';

const PRODUCT_CATEGORY_PAGES = {
  'sign-boards': {
    title: 'Sign Boards',
    description:
      'High-impact sign boards for retail, corporate and hospitality projects. Explore LED sign boards, acrylic letters, ACP cladding and fascia signage from Vijetha Digital.',
    scrollToId: 'signage-solutions',
  },
  'printing-services': {
    title: 'Printing Services',
    description:
      'End-to-end printing services including digital printing, offset printing, UV printing and large-format flex prints for Hyderabad businesses.',
    scrollToId: 'digital-printing',
  },
  'banner-stands': {
    title: 'Banner Stands',
    description:
      'Durable banner stands and exhibition displays for events, retail launches and campaigns. Browse Vijetha Digital’s portable display solutions.',
    scrollToId: 'display-and-exhibition',
  },
  'demo-tents': {
    title: 'Demo Tents',
    description:
      'Custom branded demo tents and canopies for outdoor promotions, trade shows and activations. Fast delivery across Hyderabad and Telangana.',
    scrollToId: 'display-and-exhibition',
  },
  'promotional-items': {
    title: 'Promotional Items',
    description:
      'Promotional items and advertising merchandise to boost your brand at events, stores and customer giveaways.',
    scrollToId: 'outdoor-advertising',
  },
} as const;

type ProductCategorySlug = keyof typeof PRODUCT_CATEGORY_PAGES;

type ProductCategoryPageParams = {
  params?: Promise<{ slug: string }>;
  searchParams?: Promise<any>;
};

function isProductCategorySlug(value: string): value is ProductCategorySlug {
  return value in PRODUCT_CATEGORY_PAGES;
}

export function generateStaticParams() {
  return Object.keys(PRODUCT_CATEGORY_PAGES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ProductCategoryPageParams): Promise<Metadata> {
  const resolvedParams = params ? await params : undefined;
  const slug = resolvedParams?.slug;
  if (!slug || !isProductCategorySlug(slug)) {
    return {
      title: 'Products | Vijetha Digital',
      description:
        'Explore Vijetha Digital’s product catalogue and printing solutions for Hyderabad businesses.',
      alternates: {
        canonical: 'https://vijethadigital.com/products',
      },
    };
  }
  const page = PRODUCT_CATEGORY_PAGES[slug];

  return {
    title: `${page.title} | Vijetha Digital`,
    description: page.description,
    alternates: {
      canonical: `https://vijethadigital.com/products/${slug}`,
    },
  };
}

export default async function ProductCategoryPage({ params }: ProductCategoryPageParams) {
  const resolvedParams = params ? await params : undefined;
  const slug = resolvedParams?.slug;
  if (!slug || !isProductCategorySlug(slug)) {
    notFound();
  }
  const page = PRODUCT_CATEGORY_PAGES[slug];

  return (
    <>
      <Header />

      <section style={{ backgroundColor: '#f1f0eb', paddingTop: '140px', paddingBottom: '72px' }}>
        <div className="wix-container">
          <p style={{ fontFamily: "'helvetica-w01-roman','Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgb(85,78,78)', marginBottom: '14px' }}>
            Product Category
          </p>
          <h1 style={{ fontFamily: "'helvetica-w01-roman','Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: 'clamp(36px, 4.5vw, 58px)', fontWeight: 400, lineHeight: 1.1, color: '#000', maxWidth: '760px' }}>
            {page.title}
          </h1>
          <p style={{ fontFamily: "'helvetica-w01-roman','Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: '16px', color: 'rgb(85,78,78)', marginTop: '20px', maxWidth: '620px', lineHeight: '1.65em' }}>
            {page.description}
          </p>
        </div>
      </section>

      <ProductsContent scrollToId={page.scrollToId} />

      <Footer />
    </>
  );
}
