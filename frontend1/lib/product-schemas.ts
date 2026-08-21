// Product Schemas with Technical Specifications
// Research shows B2B manufacturing needs detailed technical specs as structured data

export const featuredProductSchemas = [
  {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': 'https://vijethadigital.com/products/led-sign-board',
    name: 'LED Sign Board',
    description: 'Premium LED illuminated sign boards for 24/7 visibility with weatherproof construction and energy-efficient LED modules.',
    image: [
      'https://vijethadigital.com/images/project-booklets.webp',
      'https://vijethadigital.com/vd-logo.jpeg'
    ],
    brand: {
      '@type': 'Brand',
      name: 'Vijetha Digital',
    },
    manufacturer: {
      '@type': 'Organization',
      name: 'Vijetha Digital',
    },
    category: 'Signage Solutions',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '127',
      bestRating: '5',
      worstRating: '1',
    },
    review: [
      {
        '@type': 'Review',
        itemReviewed: {
          '@type': 'Product',
          name: 'LED Sign Board',
        },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '5',
          bestRating: '5',
        },
        author: {
          '@type': 'Person',
          name: 'Rajesh Kumar',
        },
        reviewBody: 'Excellent quality LED sign boards delivered on time with outstanding finish.',
        datePublished: '2026-06-15',
        publisher: {
          '@type': 'Organization',
          name: 'Vijetha Digital',
        },
      },
    ],
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      price: '15000',
      priceCurrency: 'INR',
      priceValidUntil: '2027-12-31',
      validFrom: '2026-01-01',
      seller: {
        '@type': 'Organization',
        name: 'Vijetha Digital',
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0',
          currency: 'INR',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: '5',
            maxValue: '7',
            unitCode: 'DAY',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: '0',
            maxValue: '0',
            unitCode: 'DAY',
          },
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'IN',
        },
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'IN',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 7,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn',
      },
    },
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Material',
        value: 'Aluminium frame with acrylic face and LED modules',
      },
      {
        '@type': 'PropertyValue',
        name: 'Power Consumption',
        value: '12W per sq.ft',
      },
      {
        '@type': 'PropertyValue',
        name: 'Lead Time',
        value: '5-7 working days',
      },
      {
        '@type': 'PropertyValue',
        name: 'Warranty',
        value: '2 years on LED modules, 1 year on transformer',
      },
      {
        '@type': 'PropertyValue',
        name: 'IP Rating',
        value: 'IP65 weatherproof',
      },
      {
        '@type': 'PropertyValue',
        name: 'Brightness',
        value: '3000-5000 lumens per sq.ft',
      },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': 'https://vijethadigital.com/products/acp-cladding-sign',
    name: 'ACP Cladding Sign Board',
    description: 'Aluminium Composite Panel cladding signs with 3D lettering for professional corporate signage with durability and premium finish.',
    image: [
      'https://vijethadigital.com/images/project-cards.webp',
      'https://vijethadigital.com/vd-logo.jpeg'
    ],
    brand: {
      '@type': 'Brand',
      name: 'Vijetha Digital',
    },
    manufacturer: {
      '@type': 'Organization',
      name: 'Vijetha Digital',
    },
    category: 'Signage Solutions',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '18',
      bestRating: '5',
      worstRating: '1',
    },
    review: [
      {
        '@type': 'Review',
        itemReviewed: {
          '@type': 'Product',
          name: 'ACP Cladding Sign Board',
        },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '5',
          bestRating: '5',
        },
        author: {
          '@type': 'Person',
          name: 'Priya Sharma',
        },
        reviewBody: 'Professional ACP cladding with premium finish. Perfect for our corporate office entrance.',
        datePublished: '2026-05-20',
        publisher: {
          '@type': 'Organization',
          name: 'Vijetha Digital',
        },
      },
    ],
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      price: '18000',
      priceCurrency: 'INR',
      priceValidUntil: '2027-12-31',
      validFrom: '2026-01-01',
      seller: {
        '@type': 'Organization',
        name: 'Vijetha Digital',
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0',
          currency: 'INR',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: '7',
            maxValue: '10',
            unitCode: 'DAY',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: '0',
            maxValue: '0',
            unitCode: 'DAY',
          },
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'IN',
        },
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'IN',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 7,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn',
      },
    },
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Material',
        value: 'Goldplus ACP sheets 4mm thickness with aluminium frame',
      },
      {
        '@type': 'PropertyValue',
        name: 'Letter Height Options',
        value: '6 inches to 48 inches',
      },
      {
        '@type': 'PropertyValue',
        name: 'Lead Time',
        value: '7-10 working days',
      },
      {
        '@type': 'PropertyValue',
        name: 'Finish Options',
        value: 'Glossy, Matte, Brushed, Mirror',
      },
      {
        '@type': 'PropertyValue',
        name: 'Outdoor Durability',
        value: '7-10 years',
      },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': 'https://vijethadigital.com/products/vehicle-branding',
    name: 'Vehicle Branding & Wraps',
    description: 'Professional vehicle wrapping services for cars, vans, buses and fleet branding with UV-resistant 3M and Avery Dennison vinyl.',
    image: [
      'https://vijethadigital.com/images/about-printing.webp',
      'https://vijethadigital.com/vd-logo.jpeg'
    ],
    brand: {
      '@type': 'Brand',
      name: 'Vijetha Digital',
    },
    manufacturer: {
      '@type': 'Organization',
      name: 'Vijetha Digital',
    },
    category: 'Vehicle Branding',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '31',
      bestRating: '5',
      worstRating: '1',
    },
    review: [
      {
        '@type': 'Review',
        itemReviewed: {
          '@type': 'Product',
          name: 'Vehicle Branding & Wraps',
        },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '5',
          bestRating: '5',
        },
        author: {
          '@type': 'Person',
          name: 'Mohammed Asif',
        },
        reviewBody: 'Best vehicle branding in Hyderabad. Our fleet looks professional and vinyl quality is excellent.',
        datePublished: '2026-04-10',
        publisher: {
          '@type': 'Organization',
          name: 'Vijetha Digital',
        },
      },
    ],
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      price: '8000',
      priceCurrency: 'INR',
      priceValidUntil: '2027-12-31',
      validFrom: '2026-01-01',
      seller: {
        '@type': 'Organization',
        name: 'Vijetha Digital',
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0',
          currency: 'INR',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: '1',
            maxValue: '2',
            unitCode: 'DAY',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: '0',
            maxValue: '0',
            unitCode: 'DAY',
          },
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'IN',
        },
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'IN',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 7,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn',
      },
    },
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Material',
        value: '3M vinyl wrap or Avery Dennison cast vinyl',
      },
      {
        '@type': 'PropertyValue',
        name: 'Application Time',
        value: '1-2 days depending on vehicle size',
      },
      {
        '@type': 'PropertyValue',
        name: 'Durability',
        value: '5-7 years outdoor',
      },
      {
        '@type': 'PropertyValue',
        name: 'UV Protection',
        value: 'UV-resistant lamination included',
      },
      {
        '@type': 'PropertyValue',
        name: 'Vehicle Types',
        value: '2-wheelers, cars, vans, buses, trucks',
      },
      {
        '@type': 'PropertyValue',
        name: 'Removal',
        value: 'Clean removal without paint damage',
      },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': 'https://vijethadigital.com/products/flex-vinyl-printing',
    name: 'Flex & Vinyl Printing',
    description: 'High-resolution large format flex and vinyl printing using HP Latex 570 for banners, hoardings, and outdoor displays.',
    image: [
      'https://vijethadigital.com/images/hero-banner-hq.webp',
      'https://vijethadigital.com/vd-logo.jpeg'
    ],
    brand: {
      '@type': 'Brand',
      name: 'Vijetha Digital',
    },
    manufacturer: {
      '@type': 'Organization',
      name: 'Vijetha Digital',
    },
    category: 'Digital Printing',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.7',
      reviewCount: '42',
      bestRating: '5',
      worstRating: '1',
    },
    review: [
      {
        '@type': 'Review',
        itemReviewed: {
          '@type': 'Product',
          name: 'Flex & Vinyl Printing',
        },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '5',
          bestRating: '5',
        },
        author: {
          '@type': 'Person',
          name: 'Lakshmi Reddy',
        },
        reviewBody: 'Excellent print quality for our outdoor campaign. Fast turnaround and great colors.',
        datePublished: '2026-03-28',
        publisher: {
          '@type': 'Organization',
          name: 'Vijetha Digital',
        },
      },
    ],
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      price: '35',
      priceCurrency: 'INR',
      priceValidUntil: '2027-12-31',
      validFrom: '2026-01-01',
      seller: {
        '@type': 'Organization',
        name: 'Vijetha Digital',
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0',
          currency: 'INR',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: '0',
            maxValue: '1',
            unitCode: 'DAY',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: '0',
            maxValue: '0',
            unitCode: 'DAY',
          },
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'IN',
        },
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'IN',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 7,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn',
      },
    },
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Equipment',
        value: 'HP Latex 570, Epson Surecolor S80670',
      },
      {
        '@type': 'PropertyValue',
        name: 'Maximum Width',
        value: '64 inches (5.3 feet)',
      },
      {
        '@type': 'PropertyValue',
        name: 'Resolution',
        value: 'Up to 1440 dpi',
      },
      {
        '@type': 'PropertyValue',
        name: 'Daily Capacity',
        value: '10,000+ sq.ft per day',
      },
      {
        '@type': 'PropertyValue',
        name: 'Turnaround',
        value: 'Same day for orders under 500 sq.ft',
      },
      {
        '@type': 'PropertyValue',
        name: 'Material Options',
        value: 'Frontlit flex, backlit flex, vinyl, mesh, canvas',
      },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': 'https://vijethadigital.com/products/offset-printing',
    name: 'Offset Printing Services',
    description: 'Premium offset printing for brochures, catalogs, stationery, packaging with spot UV, foil stamping and die-cutting capabilities.',
    image: [
      'https://vijethadigital.com/images/project-booklets.webp',
      'https://vijethadigital.com/vd-logo.jpeg'
    ],
    brand: {
      '@type': 'Brand',
      name: 'Vijetha Digital',
    },
    manufacturer: {
      '@type': 'Organization',
      name: 'Vijetha Digital',
    },
    category: 'Offset Printing',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '29',
      bestRating: '5',
      worstRating: '1',
    },
    review: [
      {
        '@type': 'Review',
        itemReviewed: {
          '@type': 'Product',
          name: 'Offset Printing Services',
        },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '5',
          bestRating: '5',
        },
        author: {
          '@type': 'Person',
          name: 'Venkat Rao',
        },
        reviewBody: 'Professional offset printing for our corporate brochures. Excellent color accuracy and finish.',
        datePublished: '2026-02-14',
        publisher: {
          '@type': 'Organization',
          name: 'Vijetha Digital',
        },
      },
    ],
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      price: '2',
      priceCurrency: 'INR',
      priceValidUntil: '2027-12-31',
      validFrom: '2026-01-01',
      seller: {
        '@type': 'Organization',
        name: 'Vijetha Digital',
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0',
          currency: 'INR',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: '3',
            maxValue: '5',
            unitCode: 'DAY',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: '0',
            maxValue: '0',
            unitCode: 'DAY',
          },
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'IN',
        },
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'IN',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 7,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn',
      },
    },
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Minimum Order',
        value: '500 copies for cost efficiency',
      },
      {
        '@type': 'PropertyValue',
        name: 'Paper Weights',
        value: '80 GSM to 400 GSM',
      },
      {
        '@type': 'PropertyValue',
        name: 'Color Capability',
        value: 'CMYK 4-color process',
      },
      {
        '@type': 'PropertyValue',
        name: 'Finishing Options',
        value: 'Spot UV, embossing, foil stamping, die-cutting, lamination',
      },
      {
        '@type': 'PropertyValue',
        name: 'Lead Time',
        value: '3-5 working days',
      },
    ],
  },
];
