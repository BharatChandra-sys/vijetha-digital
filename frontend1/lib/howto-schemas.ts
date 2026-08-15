// HowTo Schemas for Printing Processes
// Research shows process-based queries benefit from HowTo structured data

export const printingProcessSchemas = [
  {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How LED Sign Board Installation Works',
    description: 'Step-by-step process for professional LED sign board fabrication and installation by Vijetha Digital.',
    totalTime: 'P7D',
    estimatedCost: {
      '@type': 'MonetaryAmount',
      currency: 'INR',
      value: '15000',
    },
    tool: [
      {
        '@type': 'HowToTool',
        name: 'CNC Router',
      },
      {
        '@type': 'HowToTool',
        name: 'LED Modules 12V',
      },
      {
        '@type': 'HowToTool',
        name: 'Aluminium Frame',
      },
    ],
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Design Approval',
        text: 'Client approves design mockup with dimensions, colors, and LED placement.',
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Frame Fabrication',
        text: 'Aluminium frame cut and welded to exact specifications using measurements from site survey.',
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Acrylic Face Cutting',
        text: 'Acrylic face cut using CNC router for precision letter shapes and channels.',
      },
      {
        '@type': 'HowToStep',
        position: 4,
        name: 'LED Installation',
        text: 'LED modules installed inside channels with proper spacing for uniform illumination.',
      },
      {
        '@type': 'HowToStep',
        position: 5,
        name: 'Wiring and Testing',
        text: 'Electrical wiring connected, transformer installed, and full lighting test conducted.',
      },
      {
        '@type': 'HowToStep',
        position: 6,
        name: 'Site Installation',
        text: 'Sign board mounted on site with structural support, final alignment, and power connection.',
      },
      {
        '@type': 'HowToStep',
        position: 7,
        name: 'Quality Check',
        text: 'Final inspection for brightness uniformity, weather sealing, and client approval.',
      },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How Vehicle Wrapping Process Works',
    description: 'Professional vehicle wrapping process from design to application with 3M vinyl.',
    totalTime: 'P2D',
    estimatedCost: {
      '@type': 'MonetaryAmount',
      currency: 'INR',
      value: '8000',
    },
    tool: [
      {
        '@type': 'HowToTool',
        name: '3M Vinyl Wrap Material',
      },
      {
        '@type': 'HowToTool',
        name: 'Heat Gun',
      },
      {
        '@type': 'HowToTool',
        name: 'Squeegee Tools',
      },
    ],
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Vehicle Inspection',
        text: 'Vehicle inspected for paint condition, dents, and surface preparation requirements.',
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Design Mockup',
        text: 'Brand design created with vehicle dimensions and 3D mockup for client approval.',
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Vinyl Printing',
        text: 'Graphics printed on premium 3M vinyl with UV-resistant lamination for durability.',
      },
      {
        '@type': 'HowToStep',
        position: 4,
        name: 'Surface Preparation',
        text: 'Vehicle washed, degreased, and dried completely for optimal vinyl adhesion.',
      },
      {
        '@type': 'HowToStep',
        position: 5,
        name: 'Vinyl Application',
        text: 'Vinyl applied panel by panel using heat gun and squeegee for bubble-free finish.',
      },
      {
        '@type': 'HowToStep',
        position: 6,
        name: 'Edge Sealing',
        text: 'All edges heat-sealed and trimmed for weather resistance and long-term durability.',
      },
      {
        '@type': 'HowToStep',
        position: 7,
        name: 'Final Inspection',
        text: 'Quality check for bubbles, alignment, edge sealing, and overall finish before delivery.',
      },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How ACP Cladding Sign Board Fabrication Works',
    description: 'Complete fabrication process for ACP cladding signage with 3D lettering.',
    totalTime: 'P10D',
    estimatedCost: {
      '@type': 'MonetaryAmount',
      currency: 'INR',
      value: '18000',
    },
    tool: [
      {
        '@type': 'HowToTool',
        name: 'K Tech CNC Router',
      },
      {
        '@type': 'HowToTool',
        name: 'Goldplus ACP Sheets',
      },
      {
        '@type': 'HowToTool',
        name: 'MS Structural Frame',
      },
    ],
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Site Survey',
        text: 'Site measured for structural requirements and sign placement dimensions.',
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Design and Approval',
        text: 'Client approves letter height, finish, color, and mounting method.',
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Letter Cutting',
        text: 'ACP sheets cut into letter shapes using CNC router for precision edges.',
      },
      {
        '@type': 'HowToStep',
        position: 4,
        name: 'Letter Fabrication',
        text: 'Letters fabricated with depth using ACP strips and structural backing.',
      },
      {
        '@type': 'HowToStep',
        position: 5,
        name: 'Finish Application',
        text: 'Surface finished with chosen color and texture - matte, glossy, or brushed.',
      },
      {
        '@type': 'HowToStep',
        position: 6,
        name: 'Frame Installation',
        text: 'MS structural frame installed on building facade with chemical anchors.',
      },
      {
        '@type': 'HowToStep',
        position: 7,
        name: 'Letter Mounting',
        text: 'Individual letters mounted on frame with precise spacing and alignment.',
      },
      {
        '@type': 'HowToStep',
        position: 8,
        name: 'Quality Inspection',
        text: 'Final check for alignment, stability, finish quality, and weather sealing.',
      },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// CUSTOMER-FACING HOWTO SCHEMAS
// These target "how to order" and "how to get" queries
// ═══════════════════════════════════════════════════════════════════════════

export const howToOrderPrintingSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Order Commercial Printing from Vijetha Digital in Hyderabad',
  description: 'Step-by-step guide to ordering printing and signage services from Vijetha Digital in Hyderabad',
  image: 'https://vijethadigital.com/vd-logo.jpeg',
  totalTime: 'PT15M',
  estimatedCost: {
    '@type': 'MonetaryAmount',
    currency: 'INR',
    value: '500',
  },
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Contact Vijetha Digital',
      text: 'WhatsApp +91 92481 95552 or call +91 79426 43004 with your printing requirements. Share product type, dimensions, quantity, and timeline.',
      url: 'https://vijethadigital.com/contact',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Receive Quote',
      text: 'Get a detailed quotation within 1-2 hours on WhatsApp or 4-6 hours via email. Quote includes material specs, pricing, and delivery timeline.',
      url: 'https://vijethadigital.com/contact',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Share Design Files',
      text: 'Send print-ready files in PDF, AI, EPS, or PSD format. Design assistance available if needed. Vijetha Digital team reviews files for print compatibility.',
      url: 'https://vijethadigital.com/services',
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: 'Approve Proof',
      text: 'Review and approve the digital proof or physical sample before production. Changes can be made at this stage without additional cost.',
      url: 'https://vijethadigital.com/services',
    },
    {
      '@type': 'HowToStep',
      position: 5,
      name: 'Make Payment',
      text: 'Pay 50% advance via bank transfer, UPI, card, or cash. Balance payment on delivery or installation. GST invoice provided for B2B clients.',
      url: 'https://vijethadigital.com/contact',
    },
    {
      '@type': 'HowToStep',
      position: 6,
      name: 'Production & Delivery',
      text: 'Production begins after payment confirmation. Track progress via WhatsApp updates. Delivery or installation scheduled as per agreed timeline.',
      url: 'https://vijethadigital.com/services',
    },
  ],
};

export const howToChooseSignageBoardSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Choose the Right Signage Board for Your Business in Hyderabad',
  description: 'Expert guide to selecting the best signage type for your business from Vijetha Digital',
  image: 'https://vijethadigital.com/images/project-booklets.webp',
  totalTime: 'PT30M',
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Identify Location',
      text: 'Determine if signage is for indoor or outdoor use. Outdoor signs need weatherproof materials. Indoor signs can use lighter materials like acrylic.',
      url: 'https://vijethadigital.com/products',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Consider Visibility Requirements',
      text: 'For 24/7 visibility, choose LED illuminated signs. For daytime-only use, non-lit ACP cladding or acrylic signs work well. Night visibility requires backlit or LED options.',
      url: 'https://vijethadigital.com/products',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Assess Budget',
      text: 'LED signs start from ₹15,000. ACP cladding from ₹18,000. Acrylic letters from ₹8,000. Flex boards from ₹35/sq.ft. Vijetha Digital provides quotes for all options.',
      url: 'https://vijethadigital.com/contact',
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: 'Check Durability Needs',
      text: 'ACP cladding lasts 7-10 years outdoors. LED signs last 5-7 years. Acrylic indoor signs last 10+ years. Flex boards last 2-3 years. Choose based on longevity needs.',
      url: 'https://vijethadigital.com/products',
    },
    {
      '@type': 'HowToStep',
      position: 5,
      name: 'Consult Vijetha Digital Experts',
      text: 'Contact Vijetha Digital for site assessment. Team recommends best signage type for your location, budget, and branding goals. Free consultation available.',
      url: 'https://vijethadigital.com/contact',
    },
  ],
};

