import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Vijetha Digital',
    short_name: 'Vijetha',
    description: 'Printing, signage, and vehicle branding services in Hyderabad and across India.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f0f10',
    theme_color: '#0f0f10',
    icons: [
      {
        src: '/vd-logo.jpeg',
        sizes: 'any',
        type: 'image/jpeg',
      },
    ],
  };
}
