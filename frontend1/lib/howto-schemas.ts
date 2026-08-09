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
