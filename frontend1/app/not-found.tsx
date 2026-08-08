import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found | Vijetha Digital',
  description: 'The page you are looking for could not be found. Explore Vijetha Digital’s printing, signage, and branding services instead.',
};

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ maxWidth: '560px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '12px' }}>Page not found</h1>
        <p style={{ fontSize: '16px', lineHeight: 1.6, color: '#555' }}>
          The page you are looking for may have moved. Please return to the homepage or explore our services.
        </p>
      </div>
    </div>
  );
}
