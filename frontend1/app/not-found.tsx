import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found | Vijetha Digital',
  description: "The page you are looking for could not be found. Explore Vijetha Digital printing, signage, and branding services instead.",
};

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ maxWidth: '560px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '12px' }}>Page not found</h1>
        <p style={{ fontSize: '16px', lineHeight: 1.6, color: '#555' }}>
          The page you are looking for may have moved. Return to the homepage or explore our services.
        </p>
        <div style={{ marginTop: '32px', display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/" style={{ backgroundColor: '#000', color: '#fff', padding: '12px 28px', textDecoration: 'none', fontSize: '14px' }}>
            Go to Homepage
          </a>
          <a href="/services" style={{ backgroundColor: 'transparent', color: '#000', padding: '12px 28px', textDecoration: 'none', fontSize: '14px', border: '1px solid #000' }}>
            View Services
          </a>
        </div>
      </div>
    </div>
  );
}