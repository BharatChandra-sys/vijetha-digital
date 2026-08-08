'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ScrollAnimations from '@/components/ui/ScrollAnimations';
import { WA_URL, PHONE, PHONE_RAW, EMAIL } from '@/lib/constants';
import JsonLd from '@/components/seo/JsonLd';
import { contactFaqContent } from './faq';

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

const BRANCHES = [
  {
    name: 'Nacharam (Main)',
    address: '42/B, No. 16, IDA, Nacharam, Hyderabad – 500076',
    maps: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.7!2d78.5647!3d17.4275!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb9971b6e4e3f3%3A0x4a39c8e3c2e3f3f3!2sNacharam%2C%20Hyderabad!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
    mapsLink: 'https://maps.google.com/?q=Nacharam+IDA+Hyderabad',
  },
  {
    name: 'Indira Park',
    address: 'Shop No. 1-2-607/75, 76, Opp NTR Stadium, LIC Colony Rd, Hyderabad – 500029',
    maps: null,
    mapsLink: 'https://maps.google.com/?q=NTR+Stadium+LIC+Colony+Road+Hyderabad',
  },
  {
    name: 'Lakdikapool',
    address: 'H No. 11-5-456, Shop No. 5, Sanapride Complex, Hyderabad – 500004',
    maps: null,
    mapsLink: 'https://maps.google.com/?q=Sanapride+Complex+Lakdikapool+Hyderabad',
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const contactFaqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: contactFaqContent.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `Hi! I would like to get a quote.\n\nName: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nDetails: ${form.message}`;
    window.open(`https://wa.me/${PHONE_RAW}?text=${encodeURIComponent(msg)}`, '_blank');
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <>
      <ScrollAnimations />
      <Header />

      {/* Hero */}
      <section style={{ backgroundColor: '#f1f0eb', paddingTop: '140px', paddingBottom: '72px' }}>
        <div className="wix-container">
          <p style={{ fontFamily: font, fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgb(85,78,78)', marginBottom: '14px' }}>
            Get in Touch
          </p>
          <h1 style={{ fontFamily: font, fontSize: 'clamp(36px, 4.5vw, 58px)', fontWeight: 400, lineHeight: 1.1, color: '#000', maxWidth: '760px' }}>
            Contact Vijetha Digital for printing, signage, and vehicle branding in Hyderabad.
          </h1>
          <p style={{ fontFamily: font, fontSize: '16px', color: 'rgb(85,78,78)', marginTop: '20px', maxWidth: '720px', lineHeight: '1.7em' }}>
            Reach our team for signage boards, flex printing, exhibition displays, vehicle wraps, corporate branding, and large-format production across Hyderabad and nearby regions.
          </p>
        </div>
      </section>

      {/* Contact grid */}
      <section style={{ backgroundColor: '#fff', padding: '80px 0' }}>
        <div className="wix-container">
          <div className="contact-grid">

            {/* ── LEFT: Info ── */}
            <div className="wix-motion wix-fade-right">
              <p style={{ fontFamily: fontBold, fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgb(85,78,78)', marginBottom: '20px' }}>
                Contact Details
              </p>
              <p style={{ fontFamily: font, fontSize: '15px', lineHeight: '1.7em', color: 'rgb(85,78,78)', marginBottom: '24px' }}>
                Whether you need a quote for signage boards, flex printing, vehicle wraps, exhibition displays, or corporate branding, our team can help you choose the right material, finish, and production method for your project.
              </p>
              <p style={{ fontFamily: font, fontSize: '15px', lineHeight: '1.7em', color: 'rgb(85,78,78)', marginBottom: '24px' }}>
                We work with clients from retail, healthcare, hospitality, education, government, and commercial sectors across Hyderabad and nearby regions.
              </p>

              {/* Phone */}
              <div style={{ marginBottom: '20px' }}>
                <p style={{ fontFamily: font, fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgb(85,78,78)', marginBottom: '4px' }}>Phone</p>
                <a href={`tel:+${PHONE_RAW}`} style={{ fontFamily: fontBold, fontSize: '18px', color: '#000', textDecoration: 'none' }}>{PHONE}</a>
              </div>

              {/* Email */}
              <div style={{ marginBottom: '20px' }}>
                <p style={{ fontFamily: font, fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgb(85,78,78)', marginBottom: '4px' }}>Email</p>
                <a href={`mailto:${EMAIL}`} style={{ fontFamily: font, fontSize: '15px', color: '#000', textDecoration: 'none' }}>{EMAIL}</a>
              </div>

              {/* Hours */}
              <div style={{ marginBottom: '32px' }}>
                <p style={{ fontFamily: font, fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgb(85,78,78)', marginBottom: '4px' }}>Hours</p>
                <p style={{ fontFamily: font, fontSize: '15px', color: '#000' }}>Mon – Sat, 9:00 AM – 8:00 PM</p>
                <p style={{ fontFamily: font, fontSize: '14px', color: 'rgb(85,78,78)', marginTop: '8px', lineHeight: '1.6em' }}>
                  Fast response for quotes, production planning, and project consultations.
                </p>
              </div>

              {/* Branches */}
              <p style={{ fontFamily: fontBold, fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgb(85,78,78)', marginBottom: '16px' }}>
                Our Branches
              </p>
              {BRANCHES.map(b => (
                <div key={b.name} style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #e8e8e4' }}>
                  <p style={{ fontFamily: fontBold, fontSize: '13px', color: '#000', marginBottom: '4px' }}>{b.name}</p>
                  <p style={{ fontFamily: font, fontSize: '13px', color: 'rgb(85,78,78)', lineHeight: '1.6em', marginBottom: '6px' }}>{b.address}</p>
                  <a href={b.mapsLink} target="_blank" rel="noopener noreferrer"
                    style={{ fontFamily: font, fontSize: '12px', color: '#000', letterSpacing: '0.04em', textDecoration: 'underline' }}>
                    Open in Maps →
                  </a>
                </div>
              ))}

              {/* WhatsApp CTA */}
              <a
                href={WA_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '10px',
                  backgroundColor: '#25d366', color: '#fff',
                  fontFamily: font, fontSize: '14px', letterSpacing: '0.02em',
                  padding: '13px 28px', textDecoration: 'none', marginTop: '8px',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Chat on WhatsApp
              </a>
            </div>

            {/* ── RIGHT: Form ── */}
            <div className="wix-motion wix-fade-left wix-delay-2">
              <p style={{ fontFamily: fontBold, fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgb(85,78,78)', marginBottom: '32px' }}>
                Request a Quote
              </p>

              <form onSubmit={handleSubmit}>
                {[
                  { id: 'name',    label: 'Full Name *',     type: 'text',  required: true  },
                  { id: 'email',   label: 'Email Address *', type: 'email', required: true  },
                  { id: 'phone',   label: 'Phone Number',    type: 'tel',   required: false },
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
                    rows={5}
                    placeholder="Describe your project — type of signage, quantity, size, timeline…"
                    style={{ ...inputStyle, resize: 'none' }}
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    backgroundColor: '#000', color: '#fff',
                    fontFamily: font, fontSize: '14px', letterSpacing: '0.03em',
                    padding: '16px 44px', border: 'none', cursor: 'pointer',
                    transition: 'opacity 0.2s ease', opacity: sent ? 0.6 : 1,
                  }}
                >
                  {sent ? 'Opening WhatsApp…' : 'Send via WhatsApp'}
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ section */}
      <section style={{ backgroundColor: '#f7f5ef', padding: '80px 0' }}>
        <div className="wix-container">
          <p style={{ fontFamily: font, fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgb(85,78,78)', marginBottom: '14px' }}>
            Frequently asked questions
          </p>
          <h2 style={{ fontFamily: font, fontSize: 'clamp(24px, 2.6vw, 36px)', fontWeight: 400, color: '#000', marginBottom: '36px', maxWidth: '680px' }}>
            Answers to common questions about printing, signage, and branding projects.
          </h2>
          <div style={{ display: 'grid', gap: '16px' }}>
            {contactFaqContent.map((item) => (
              <div key={item.question} style={{ backgroundColor: '#fff', padding: '24px 28px', border: '1px solid #e8e8e4' }}>
                <p style={{ fontFamily: fontBold, fontSize: '16px', color: '#000', marginBottom: '8px' }}>{item.question}</p>
                <p style={{ fontFamily: font, fontSize: '15px', lineHeight: '1.65em', color: 'rgb(85,78,78)' }}>{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MAP: Nacharam ── */}
      <section style={{ backgroundColor: '#f1f0eb', padding: '0' }}>
        <div style={{ position: 'relative' }}>
          {/* Label overlay */}
          <div style={{
            position: 'absolute', top: '24px', left: '50%', transform: 'translateX(-50%)',
            backgroundColor: '#000', color: '#fff',
            fontFamily: font, fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase',
            padding: '8px 20px', zIndex: 10, whiteSpace: 'nowrap',
          }}>
            Nacharam Main Branch
          </div>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.463043660484!2d78.56031497505163!3d17.42784518341956!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb9971b6e4e3f3%3A0x0!2sNacharam%20IDA%2C%20Hyderabad%2C%20Telangana%20500076!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
            width="100%"
            height="420"
            style={{ border: 0, display: 'block', filter: 'grayscale(20%)' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Vijetha Digital – Nacharam Main Branch"
          />
        </div>
      </section>

      <Footer />
      <JsonLd data={contactFaqSchema} />

      <style>{`
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1.4fr;
          gap: 80px;
          align-items: start;
        }
        @media (max-width: 900px) {
          .contact-grid { grid-template-columns: 1fr; gap: 48px; }
        }
        input:focus, textarea:focus {
          border-bottom-color: #000 !important;
        }
        textarea::placeholder {
          color: rgba(85,78,78,0.5);
          font-size: 13px;
        }
      `}</style>
    </>
  );
}
