// ═══════════════════════════════════════════════════════════════════════════
// FAQ SCHEMA FOR HOMEPAGE
// Enterprise-level FAQ structured data for Google rich results
// ═══════════════════════════════════════════════════════════════════════════

export const homepageFAQSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': 'https://vijethadigital.com/#faq',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What services does Vijetha Digital offer in Hyderabad?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Vijetha Digital offers comprehensive printing and signage solutions including LED sign boards, ACP cladding signage, acrylic signs, vehicle branding and wraps, flex and vinyl printing, offset printing, digital printing, exhibition displays, trade show booths, rollup standees, and complete corporate branding solutions across Hyderabad and South India.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the typical turnaround time for signage projects?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Turnaround times vary by project: LED sign boards take 5-7 working days, ACP cladding requires 7-10 working days, vehicle branding is completed in 1-2 days, flex printing under 500 sq.ft is same-day, and offset printing takes 3-5 working days. Rush orders can be accommodated with prior coordination.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does Vijetha Digital provide installation services?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, Vijetha Digital provides complete end-to-end installation services with trained technicians across Hyderabad, Telangana, and pan-India. Our team handles signage mounting, vehicle wrap application, exhibition booth setup, and all installation requirements with professional project management.',
      },
    },
    {
      '@type': 'Question',
      name: 'What areas does Vijetha Digital serve?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Vijetha Digital serves Hyderabad, Secunderabad, Nacharam, Kukatpally, Gachibowli, Madhapur, Banjara Hills, and all areas across Telangana and Andhra Pradesh. We also provide services across South India including Bangalore, Chennai, Vijayawada, and Visakhapatnam with pan-India installation support.',
      },
    },
    {
      '@type': 'Question',
      name: 'What printing equipment does Vijetha Digital use?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Vijetha Digital operates industrial-grade equipment including HP Latex 570 wide-format printer, Roland LEF2-200 UV flatbed printer, Graphtec FC9000 vinyl cutter, Zünd G3 digital cutting table, Royal Sovereign laminator, Duplo slitter/cutter, and Konica AccurioPress C14000 digital press for world-class print quality.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can Vijetha Digital handle bulk orders for multiple locations?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, Vijetha Digital specializes in multi-location bulk orders. We have served clients like Airtel (40+ outlets), Samsung (12 stores), and various retail chains with consistent quality across hundreds of signage units. Our production capacity exceeds 10,000 sq.ft daily for large-scale projects.',
      },
    },
    {
      '@type': 'Question',
      name: 'What materials are used for outdoor signage durability?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Vijetha Digital uses premium materials for outdoor durability: Goldplus ACP sheets (7-10 years lifespan), 3M and Avery Dennison vinyl (5-7 years), UV-resistant inks, waterproof LED modules with IP65 rating, marine-grade aluminum frames, and protective laminates for weather resistance in harsh Indian climates.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does vehicle branding cost in Hyderabad?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Vehicle branding costs vary by vehicle size: 2-wheeler graphics start at ₹2,000, car/sedan wraps from ₹8,000-₹25,000, SUV wraps ₹15,000-₹35,000, van/tempo ₹20,000-₹50,000, and bus/truck branding ₹50,000+. Pricing includes design, printing, application, and 5-7 year durability guarantee.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does Vijetha Digital offer design services?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, Vijetha Digital provides professional design services with experienced graphic designers. We offer free design consultation, 3D mockups for signage projects, brand identity development, packaging design, exhibition booth design, and complete visual communication solutions tailored to your brand guidelines.',
      },
    },
    {
      '@type': 'Question',
      name: 'What payment methods does Vijetha Digital accept?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Vijetha Digital accepts multiple payment methods: bank transfer/NEFT/RTGS, UPI payments, credit/debit cards, cash, and cheques. For B2B clients, we offer credit terms with GST invoicing (GSTIN: 36AGBPC3175H1ZP). Advance payment of 50% is required for bulk orders with balance on delivery.',
      },
    },
  ],
};

// Service-specific FAQ schemas for individual pages
export const signageFAQSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What types of LED sign boards are available?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Vijetha Digital offers front-lit LED signs, backlit LED signs, edge-lit LED signs, neon flex LED signs, digital LED display boards, and RGB color-changing LED signs. All boards feature energy-efficient modules, IP65 waterproofing, and 2-year LED warranty with 1-year transformer warranty.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long do ACP cladding signs last outdoors?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'ACP cladding signs from Vijetha Digital last 7-10 years outdoors with proper maintenance. We use Goldplus ACP sheets with UV-resistant coating, corrosion-resistant aluminum frames, and weatherproof mounting systems tested for Indian tropical and monsoon conditions.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can acrylic letters be installed on glass facades?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, acrylic 3D letters can be mounted on glass facades using specialized transparent adhesives or standoff mounting systems. Vijetha Digital provides engineering consultation for structural load assessment and safe installation on glass, ACP, concrete, and painted surfaces.',
      },
    },
  ],
};

export const vehicleBrandingFAQSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Will vehicle wrap damage the original paint?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No, vehicle wraps from Vijetha Digital use 3M and Avery Dennison cast vinyl which removes cleanly without damaging paint. Our application process includes surface preparation and professional installation to protect your vehicle paint. Removal is damage-free when done by trained technicians.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does vehicle branding last?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Vehicle branding lasts 5-7 years with proper care. Vijetha Digital uses premium UV-resistant vinyl with protective lamination. Lifespan depends on usage, parking (covered vs outdoor), washing frequency, and maintenance. We recommend annual inspection for optimal appearance.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can we remove vehicle branding later?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, vehicle branding can be removed professionally without damage. Vijetha Digital provides removal services using heat application and specialized solvents. Removal takes 2-4 hours depending on coverage area. Paint condition returns to original state with no residue or damage.',
      },
    },
  ],
};

export const printingFAQSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the minimum order quantity for offset printing?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Offset printing is cost-effective from 500 copies onwards. For smaller quantities (under 500), Vijetha Digital recommends digital printing which offers quality comparable to offset without setup costs. We provide quotations for both methods to help you choose the most economical option.',
      },
    },
    {
      '@type': 'Question',
      name: 'What file formats do you accept for printing?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Vijetha Digital accepts PDF (preferred), AI, EPS, PSD, CDR, and TIFF files. For best results, submit print-ready PDFs with fonts embedded, CMYK color mode, 300 DPI resolution, and 3mm bleed. Our prepress team provides free file review and correction support.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you provide paper and material samples?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, Vijetha Digital provides physical samples of paper stocks, vinyl materials, ACP finishes, acrylic colors, and fabric options at our Lakdikapool and Indira Park showrooms. We also offer material swatches for client approval before production begins.',
      },
    },
  ],
};
