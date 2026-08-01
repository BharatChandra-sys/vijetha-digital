'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ScrollAnimations from '@/components/ui/ScrollAnimations';
import { WA_URL, PHONE, PHONE_RAW, EMAIL } from '@/lib/constants';

const font     = "'helvetica-w01-roman','Helvetica Neue',Helvetica,Arial,sans-serif";
const fontBold = "'helvetica-w01-bold','Helvetica Neue',Helvetica,Arial,sans-serif";

const inputStyle: React.CSSProperties = {
  width: '100%',
  fontFamily: font,
  fontSize: '15px',
  color: '#000',
  backgroundColor: 'transparent',
  border: 'none',
  borderBottom: '1px solid #ccc',
  padding: '12px 0',
  outline: 'none',
  display: 'block',
};

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `Hi! I would like to get a quote.\n\nName: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nDetails: ${form.message}`;
    window.open(`https://wa.me/${PHONE_RAW}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <>
      <ScrollAnimations />
      <Header />

      {/* Page hero */}
      <section style={{ backgroundColor: '#f1f0eb', paddingTop: '140px', paddingBottom: '72px' }}>
        <div className="wix-container">
          <p style={{ fontFamily: font, fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgb(85,78,78)', marginBottom: '14px' }}>
            Get in Touch
          </p>
          <h1 style={{ fontFamily: font, fontSize: 'clamp(36px, 4.5vw, 58px)', fontWeight: 400, lineHeight: 1.1, color: '#000', maxWidth: '600px' }}>
            Let&apos;s talk about<br />your next print
          </h1>
        </div>
      </section>

      {/* Contact content */}
      <section style={{ backgroundColor: '#ffffff', padding: '80px 0' }}>
        <div className="wix-container">
          <div className="contact-grid">

            {/* Info */}
            <div className="wix-motion wix-fade-right">
              <h2 style={{ fontFamily: fontBold, fontSize: 'clamp(18px, 2vw, 24px)', fontWeight: 400, color: '#000', marginBottom: '32px' }}>
                Vijetha Digital
              </h2>

              {[
                { label: 'Address', value: 'Hyderabad, Telangana, India' },
                { label: 'Phone',   value: PHONE },
                { label: 'Email',   value: EMAIL },
                { label: 'Hours',   value: 'Mon – Sat, 9 am – 7 pm IST' },
              ].map(item => (
                <div key={item.label} style={{ marginBottom: '24px' }}>
                  <p style={{ fontFamily: font, fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgb(85,78,78)', marginBottom: '4px' }}>
                    {item.label}
                  </p>
                  <p style={{ fontFamily: font, fontSize: '15px', color: '#000', lineHeight: '1.5em' }}>
                    {item.value}
                  </p>
                </div>
              ))}

              <div style={{ marginTop: '40px' }}>
                <p style={{ fontFamily: font, fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgb(85,78,78)', marginBottom: '12px' }}>
                  Follow Us
                </p>
                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                  {[['Instagram', 'https://instagram.com'], ['Facebook', 'https://facebook.com'], ['LinkedIn', 'https://linkedin.com']].map(([name, href]) => (
                    <a key={name} href={href} target="_blank" rel="noopener noreferrer"
                      style={{ fontFamily: font, fontSize: '14px', color: '#000', textDecoration: 'none', borderBottom: '1px solid #000', paddingBottom: '1px' }}
                    >
                      {name}
                    </a>
                  ))}
                </div>
              </div>

              {/* WhatsApp direct link */}
              <div style={{ marginTop: '40px' }}>
                <a
                  href="https://wa.me/919248195552?text=Hi%21%20I%20would%20like%20to%20get%20a%20quote%20for%20printing%20services."
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '10px',
                    backgroundColor: '#25d366', color: '#fff',
                    fontFamily: font, fontSize: '14px', letterSpacing: '0.02em',
                    padding: '13px 28px', textDecoration: 'none',
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.116 1.52 5.845L.057 23.882l6.232-1.434A11.942 11.942 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.9 0-3.68-.522-5.2-1.43l-.373-.222-3.862.888.916-3.756-.243-.386A9.964 9.964 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                  </svg>
                  Chat on WhatsApp
                </a>
              </div>
            </div>

            {/* Form */}
            <div className="wix-motion wix-fade-left wix-delay-2">
              <form onSubmit={handleSubmit}>
                <p style={{ fontFamily: fontBold, fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#000', marginBottom: '32px' }}>
                  Request a Quote
                </p>

                {[
                  { id: 'name',    label: 'Full Name *',      type: 'text',  required: true  },
                  { id: 'email',   label: 'Email Address *',  type: 'email', required: true  },
                  { id: 'phone',   label: 'Phone Number',     type: 'tel',   required: false },
                ].map(field => (
                  <div key={field.id} style={{ marginBottom: '28px' }}>
                    <label style={{ fontFamily: font, fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgb(85,78,78)', display: 'block', marginBottom: '6px' }}>
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      required={field.required}
                      style={inputStyle}
                      value={form[field.id as keyof typeof form]}
                      onChange={e => setForm({ ...form, [field.id]: e.target.value })}
                    />
                  </div>
                ))}

                <div style={{ marginBottom: '36px' }}>
                  <label style={{ fontFamily: font, fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgb(85,78,78)', display: 'block', marginBottom: '6px' }}>
                    What do you need? *
                  </label>
                  <textarea
                    required
                    rows={4}
                    style={{ ...inputStyle, resize: 'none' }}
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                  />
                </div>

                <button type="submit" style={{
                  backgroundColor: '#000', color: '#fff',
                  fontFamily: font, fontSize: '14px', letterSpacing: '0.03em',
                  padding: '16px 44px', border: 'none', cursor: 'pointer',
                }}>
                  Send via WhatsApp
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1.4fr;
          gap: 80px;
          align-items: start;
        }
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr; gap: 48px; }
        }
        input:focus, textarea:focus {
          border-bottom-color: #000 !important;
        }
      `}</style>
    </>
  );
}
