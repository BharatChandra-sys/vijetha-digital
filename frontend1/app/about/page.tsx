'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ScrollAnimations from '@/components/ui/ScrollAnimations';
import { WA_URL } from '@/lib/constants';
import {
  COMPANY_STATS,
  CLIENT_PORTFOLIO,
  CLIENT_TESTIMONIALS,
  OPERATIONAL_PRINCIPLES,
  CREDENTIALS,
  COMPANY_TIMELINE,
  MANUFACTURING_SYSTEMS,
  FOUNDER_INFO,
} from '@/lib/about-data';

const font     = "'helvetica-w01-roman','Helvetica Neue',Helvetica,Arial,sans-serif";
const fontBold = "'helvetica-w01-bold','Helvetica Neue',Helvetica,Arial,sans-serif";

function StarRating({ count }: { count: number }) {
  return (
    <div style={{ display: 'flex', gap: '4px' }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={i < count ? '#000' : '#e8e8e4'}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </div>
  );
}

export default function AboutPage() {
  return (
    <>
      <ScrollAnimations />
      <Header variant="home" />

      {/* ── HERO ── */}
      <section style={{ backgroundColor: '#1c1d20', paddingTop: '140px', paddingBottom: '80px' }}>
        <div className="wix-container">
          <p style={{ fontFamily: font, fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: '14px' }}>
            Company Profile
          </p>
          <h1 style={{ fontFamily: font, fontSize: 'clamp(36px, 4.5vw, 64px)', fontWeight: 400, lineHeight: 1.05, color: '#fff', maxWidth: '960px', marginBottom: '24px' }}>
            Trusted printing and signage company in Hyderabad for brands that need quality, speed, and scale.
          </h1>
          <p style={{ fontFamily: font, fontSize: '16px', color: 'rgba(255,255,255,0.55)', maxWidth: '760px', lineHeight: '1.7em' }}>
            Vijetha Digital is a vertically integrated printing and signage manufacturer serving businesses across Hyderabad, Telangana, and South India. We deliver premium signage, vehicle branding, digital printing, offset printing, and exhibition solutions with dependable execution.
          </p>

          {/* Stats strip */}
          <div className="hero-stats">
            {COMPANY_STATS.map(s => (
              <div key={s.label} className="hero-stat">
                <p style={{ fontFamily: fontBold, fontSize: 'clamp(24px, 2.5vw, 36px)', color: '#fff', marginBottom: '4px' }}>{s.value}</p>
                <p style={{ fontFamily: font, fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPANY OVERVIEW ── */}
      <section style={{ backgroundColor: '#fff', padding: '96px 0' }}>
        <div className="wix-container">
          <div className="story-grid">
            {/* Content */}
            <div className="wix-motion wix-fade-right">
              <p style={{ fontFamily: font, fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgb(85,78,78)', marginBottom: '14px' }}>
                Company Overview
              </p>
              <h2 style={{ fontFamily: font, fontSize: 'clamp(26px, 2.8vw, 42px)', fontWeight: 400, lineHeight: 1.2, color: '#000', marginBottom: '24px' }}>
                Manufacturer of choice for<br />India's leading enterprises
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontFamily: font, fontSize: '15px', lineHeight: '1.7em', color: 'rgb(85,78,78)' }}>
                <p>
                  Established in 2009 by <strong style={{ color: '#000', fontFamily: fontBold }}>{FOUNDER_INFO.name}</strong>, Vijetha Digital operates as a sole proprietorship with a clear mandate: deliver industrial-grade printing and signage solutions that meet the exacting standards of corporate India.
                </p>
                <p>
                  Our 10,000 sq.ft production facility in Nacharam IDA houses seven specialized manufacturing systems covering wide-format printing, UV flatbed direct-to-substrate printing, precision vinyl cutting, digital fabric processing, and high-volume offset finishing.
                </p>
                <p>
                  We serve clients across retail (Samsung, Reliance Digital), telecom (Airtel, Jio), FMCG (Pepsi, Heritage Foods), banking (SBI), technology (Microsoft, Vivo), government (GHMC, Telangana Tourism), and pharmaceuticals (Dr. Reddy's). Our client retention rate exceeds 85% — a testament to consistent quality and service reliability.
                </p>
                <p>
                  Unlike print brokers or aggregators, we manufacture in-house. This vertical integration enables tighter quality control, faster turnaround, and direct cost advantages that we pass to our clients. Every project — whether 100 business cards or a 50-store rebranding campaign — receives the same engineering rigor.
                </p>
              </div>
            </div>

            {/* Founder Card */}
            <div className="wix-motion wix-fade-left wix-delay-2">
              <div style={{ backgroundColor: '#f1f0eb', padding: '40px', borderRadius: '2px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                  <div style={{
                    width: '72px', height: '72px', borderRadius: '50%',
                    backgroundColor: '#1c1d20', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontFamily: fontBold, fontSize: '24px', flexShrink: 0,
                  }}>
                    {FOUNDER_INFO.initials}
                  </div>
                  <div>
                    <p style={{ fontFamily: fontBold, fontSize: '18px', color: '#000', marginBottom: '4px' }}>{FOUNDER_INFO.name}</p>
                    <p style={{ fontFamily: font, fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgb(85,78,78)' }}>{FOUNDER_INFO.title}</p>
                  </div>
                </div>
                <p style={{ fontFamily: font, fontSize: '15px', lineHeight: '1.7em', color: 'rgb(85,78,78)', fontStyle: 'italic', marginBottom: '32px', paddingLeft: '20px', borderLeft: '3px solid #1c1d20' }}>
                  &ldquo;{FOUNDER_INFO.quote}&rdquo;
                </p>
              </div>

              {/* Credentials Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {CREDENTIALS.map((cred) => (
                  <div key={cred.label} style={{ backgroundColor: '#fff', padding: '20px', border: '1px solid rgba(0,0,0,0.06)' }}>
                    <p style={{ fontFamily: font, fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.35)', marginBottom: '8px' }}>{cred.label}</p>
                    <p style={{ fontFamily: fontBold, fontSize: '14px', color: '#000', marginBottom: '2px', lineHeight: '1.3' }}>{cred.value}</p>
                    <p style={{ fontFamily: font, fontSize: '11px', color: 'rgb(85,78,78)' }}>{cred.sublabel}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CLIENT PORTFOLIO ── */}
      <section style={{ backgroundColor: '#f1f0eb', padding: '96px 0' }}>
        <div className="wix-container">
          <div className="wix-motion wix-fade-up" style={{ textAlign: 'center', marginBottom: '64px' }}>
            <p style={{ fontFamily: font, fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgb(85,78,78)', marginBottom: '14px' }}>
              Client Portfolio
            </p>
            <h2 style={{ fontFamily: font, fontSize: 'clamp(26px, 2.8vw, 42px)', fontWeight: 400, lineHeight: 1.2, color: '#000', marginBottom: '20px' }}>
              Trusted by market leaders<br />across 12+ industries
            </h2>
          </div>

          {/* Premium Client Grid */}
          <div className="client-premium-grid">
            {CLIENT_PORTFOLIO.map((client, i) => {
              const initials = client.name.substring(0, 2).toUpperCase();
              return (
                <a
                  key={client.domain}
                  href={client.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="client-premium-card wix-motion wix-fade-up"
                  style={{ transitionDelay: `${(i % 5) * 60}ms` }}
                >
                  <div className="client-logo-wrapper">
                    <div className="client-initials">{initials}</div>
                  </div>
                  <div className="client-info">
                    <p className="client-brand-name">{client.name}</p>
                    <p className="client-industry">{client.industry}</p>
                  </div>
                </a>
              );
            })}
          </div>

          <div className="wix-motion wix-fade-up" style={{ textAlign: 'center', marginTop: '64px' }}>
            <p style={{ fontFamily: font, fontSize: '14px', color: 'rgb(85,78,78)', maxWidth: '720px', margin: '0 auto', lineHeight: '1.7em' }}>
              From MNC headquarters to government institutions — 1,000+ organizations across Telangana, Andhra Pradesh, and Karnataka rely on Vijetha Digital for their branding infrastructure.
            </p>
          </div>
        </div>
      </section>

      {/* ── CLIENT TESTIMONIALS ── */}
      <section style={{ backgroundColor: '#fff', padding: '96px 0' }}>
        <div className="wix-container">
          <div className="wix-motion wix-fade-up" style={{ textAlign: 'center', marginBottom: '64px' }}>
            <p style={{ fontFamily: font, fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgb(85,78,78)', marginBottom: '14px' }}>
              Client Testimonials
            </p>
            <h2 style={{ fontFamily: font, fontSize: 'clamp(26px, 2.8vw, 42px)', fontWeight: 400, lineHeight: 1.2, color: '#000', marginBottom: '16px' }}>
              What our clients say
            </h2>
            <p style={{ fontFamily: font, fontSize: '15px', color: 'rgb(85,78,78)', maxWidth: '600px', margin: '0 auto', lineHeight: '1.7em' }}>
              Real feedback from real projects — verified client reviews across 15+ years of operation.
            </p>
          </div>

          <div className="testimonial-grid">
            {CLIENT_TESTIMONIALS.map((review, i) => (
              <div
                key={i}
                className="testimonial-card wix-motion wix-fade-up"
                style={{ transitionDelay: `${(i % 3) * 80}ms` }}
              >
                <div style={{ marginBottom: '16px' }}>
                  <StarRating count={review.rating} />
                </div>
                <p style={{ fontFamily: font, fontSize: '15px', lineHeight: '1.7em', color: '#000', marginBottom: '24px' }}>
                  &ldquo;{review.text}&rdquo;
                </p>
                <div style={{ borderTop: '1px solid #e8e8e4', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div>
                    <p style={{ fontFamily: fontBold, fontSize: '14px', color: '#000', marginBottom: '4px' }}>{review.name}</p>
                    <p style={{ fontFamily: font, fontSize: '12px', color: 'rgb(85,78,78)', marginBottom: '2px' }}>{review.role}</p>
                    <p style={{ fontFamily: font, fontSize: '11px', color: 'rgb(85,78,78)' }}>{review.company}</p>
                  </div>
                  {review.verified && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgb(85,78,78)', fontFamily: font }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#1c1d20">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                      Verified
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OPERATIONAL PRINCIPLES ── */}
      <section style={{ backgroundColor: '#f1f0eb', padding: '96px 0' }}>
        <div className="wix-container">
          <div className="wix-motion wix-fade-up" style={{ textAlign: 'center', marginBottom: '56px' }}>
            <p style={{ fontFamily: font, fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgb(85,78,78)', marginBottom: '14px' }}>
              Operational Framework
            </p>
            <h2 style={{ fontFamily: font, fontSize: 'clamp(26px, 2.8vw, 42px)', fontWeight: 400, lineHeight: 1.2, color: '#000', marginBottom: '16px' }}>
              Core principles driving our operations
            </h2>
            <p style={{ fontFamily: font, fontSize: '15px', color: 'rgb(85,78,78)', maxWidth: '680px', margin: '0 auto', lineHeight: '1.7em' }}>
              These operational standards govern every decision — from material procurement to final installation — ensuring consistent delivery excellence.
            </p>
          </div>

          <div className="values-grid">
            {OPERATIONAL_PRINCIPLES.map((v, i) => (
              <div
                key={v.number}
                className="value-card wix-motion wix-fade-up"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <p style={{ fontFamily: font, fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.35)', marginBottom: '16px' }}>{v.number}</p>
                <h3 style={{ fontFamily: fontBold, fontSize: '16px', color: '#000', marginBottom: '10px', letterSpacing: '0.02em' }}>
                  {v.title}
                </h3>
                <p style={{ fontFamily: font, fontSize: '14px', lineHeight: '1.65em', color: 'rgb(85,78,78)' }}>
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section style={{ backgroundColor: '#fff', padding: '96px 0' }}>
        <div className="wix-container">
          <div className="wix-motion wix-fade-up" style={{ marginBottom: '56px' }}>
            <p style={{ fontFamily: font, fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgb(85,78,78)', marginBottom: '14px' }}>
              Company Timeline
            </p>
            <h2 style={{ fontFamily: font, fontSize: 'clamp(26px, 2.8vw, 42px)', fontWeight: 400, lineHeight: 1.2, color: '#000', maxWidth: '700px' }}>
              15 years of consistent growth
            </h2>
          </div>

          <div className="timeline-container">
            {COMPANY_TIMELINE.map((m, i) => (
              <div
                key={m.year}
                className="timeline-item wix-motion wix-fade-up"
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                <div className="timeline-year">
                  <p style={{ fontFamily: fontBold, fontSize: '20px', color: '#000' }}>{m.year}</p>
                </div>
                <div className="timeline-content">
                  <h3 style={{ fontFamily: fontBold, fontSize: '15px', color: '#000', marginBottom: '8px', letterSpacing: '0.02em' }}>
                    {m.title}
                  </h3>
                  <p style={{ fontFamily: font, fontSize: '14px', lineHeight: '1.65em', color: 'rgb(85,78,78)' }}>
                    {m.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MANUFACTURING INFRASTRUCTURE ── */}
      <section style={{ backgroundColor: '#f1f0eb', padding: '96px 0' }}>
        <div className="wix-container">
          <div className="wix-motion wix-fade-up" style={{ marginBottom: '56px' }}>
            <p style={{ fontFamily: font, fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgb(85,78,78)', marginBottom: '14px' }}>
              Manufacturing Capability
            </p>
            <h2 style={{ fontFamily: font, fontSize: 'clamp(26px, 2.8vw, 42px)', fontWeight: 400, lineHeight: 1.2, color: '#000', maxWidth: '700px' }}>
              Industrial-grade production systems
            </h2>
          </div>

          <div className="machinery-grid">
            {MANUFACTURING_SYSTEMS.map((m, i) => (
              <div
                key={m.num}
                className="machinery-card wix-motion wix-fade-up"
                style={{ transitionDelay: `${(i % 4) * 80}ms` }}
              >
                <p style={{ fontFamily: font, fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.35)', marginBottom: '12px' }}>
                  {m.num}
                </p>
                <h3 style={{ fontFamily: fontBold, fontSize: '15px', color: '#000', marginBottom: '10px', letterSpacing: '0.02em' }}>
                  {m.name}
                </h3>
                <p style={{ fontFamily: font, fontSize: '13px', lineHeight: '1.65em', color: 'rgb(85,78,78)' }}>
                  {m.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ backgroundColor: '#1c1d20', padding: '80px 0' }}>
        <div className="wix-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '32px' }}>
          <div className="wix-motion wix-fade-right">
            <h2 style={{ fontFamily: font, fontSize: 'clamp(24px, 2.5vw, 36px)', fontWeight: 400, color: '#fff', marginBottom: '8px' }}>
              Partner with us for your next project
            </h2>
            <p style={{ fontFamily: font, fontSize: '15px', color: 'rgba(255,255,255,0.55)' }}>
              Request technical specifications or schedule a facility tour — our team responds within 24 hours.
            </p>
          </div>
          <a
            href={WA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="wix-motion wix-fade-left"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              backgroundColor: '#fff', color: '#000',
              fontFamily: font, fontSize: '14px', letterSpacing: '0.03em',
              padding: '16px 44px', textDecoration: 'none', flexShrink: 0,
            }}
          >
            Request Information
          </a>
        </div>
      </section>

      <Footer />

      <style>{`
        .hero-stats {
          display: flex;
          gap: 48px;
          margin-top: 56px;
          padding-top: 40px;
          border-top: 1px solid rgba(255,255,255,0.1);
          flex-wrap: wrap;
        }
        .hero-stat { min-width: 100px; }

        .story-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: start;
        }

        .client-premium-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 20px;
        }
        .client-premium-card {
          background: #fff;
          padding: 28px 20px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          text-decoration: none;
          border: 1px solid rgba(0,0,0,0.04);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          min-height: 180px;
        }
        .client-premium-card:hover {
          border-color: rgba(0,0,0,0.12);
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.06);
        }
        .client-logo-wrapper {
          width: 72px;
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #1c1d20 0%, #2a2b2f 100%);
          border-radius: 10px;
          transition: all 0.3s ease;
          flex-shrink: 0;
          position: relative;
          overflow: hidden;
        }
        .client-logo-wrapper::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .client-premium-card:hover .client-logo-wrapper {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(28, 29, 32, 0.15);
        }
        .client-premium-card:hover .client-logo-wrapper::before {
          opacity: 1;
        }
        .client-initials {
          font-family: ${fontBold};
          font-size: 22px;
          color: #fff;
          letter-spacing: 0.05em;
          font-weight: 700;
          position: relative;
          z-index: 1;
        }
        .client-brand-logo {
          width: 100%;
          height: 100%;
          object-fit: contain;
          max-width: 100%;
          max-height: 100%;
        }
        .client-info {
          display: flex;
          flex-direction: column;
          gap: 6px;
          width: 100%;
        }
        .client-brand-name {
          font-family: ${fontBold};
          font-size: 13px;
          color: #000;
          letter-spacing: 0.02em;
          line-height: 1.3;
        }
        .client-industry {
          font-family: ${font};
          font-size: 10px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgb(85,78,78);
          line-height: 1.4;
        }

        .testimonial-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
        }
        .testimonial-card {
          background: #f9f9f7;
          padding: 32px;
          border: 1px solid rgba(0,0,0,0.04);
        }

        .values-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 32px;
        }
        .value-card {
          background: #fff;
          padding: 32px;
          border: 1px solid rgba(0,0,0,0.06);
        }

        .timeline-container {
          display: flex;
          flex-direction: column;
          gap: 0;
          border-left: 2px solid #e8e8e4;
          padding-left: 0;
        }
        .timeline-item {
          display: grid;
          grid-template-columns: 140px 1fr;
          gap: 40px;
          padding: 32px 0;
          border-bottom: 1px solid #e8e8e4;
          margin-left: -2px;
          padding-left: 40px;
          position: relative;
        }
        .timeline-item:before {
          content: '';
          position: absolute;
          left: -6px;
          top: 40px;
          width: 10px;
          height: 10px;
          background: #1c1d20;
          border-radius: 50%;
        }
        .timeline-item:last-child {
          border-bottom: none;
        }
        .timeline-year {
          display: flex;
          align-items: flex-start;
        }
        .timeline-content {
          padding-top: 2px;
        }

        .machinery-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1px;
          background: #e8e8e4;
          border: 1px solid #e8e8e4;
        }
        .machinery-card {
          background: #fff;
          padding: 28px 24px;
          transition: background 0.2s ease;
        }
        .machinery-card:hover {
          background: #fafaf8;
        }

        @media (max-width: 1200px) {
          .client-premium-grid { grid-template-columns: repeat(4, 1fr); gap: 18px; }
          .client-premium-card { padding: 24px 18px; min-height: 170px; }
        }
        @media (max-width: 1100px) {
          .machinery-grid { grid-template-columns: repeat(3, 1fr); }
          .values-grid { grid-template-columns: repeat(2, 1fr); }
          .client-premium-grid { grid-template-columns: repeat(3, 1fr); gap: 16px; }
        }
        @media (max-width: 900px) {
          .story-grid { grid-template-columns: 1fr; gap: 48px; }
          .machinery-grid { grid-template-columns: repeat(2, 1fr); }
          .timeline-item { grid-template-columns: 100px 1fr; gap: 24px; padding-left: 32px; }
          .testimonial-grid { grid-template-columns: repeat(2, 1fr); gap: 24px; }
          .client-premium-card { padding: 20px 16px; min-height: 160px; }
          .client-logo-wrapper { width: 64px; height: 64px; padding: 12px; }
        }
        @media (max-width: 768px) {
          .client-premium-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
          .hero-stats { gap: 32px; }
          .testimonial-card { padding: 28px; }
        }
        @media (max-width: 600px) {
          .machinery-grid { grid-template-columns: 1fr; }
          .values-grid { grid-template-columns: 1fr; }
          .hero-stats { gap: 24px; justify-content: space-between; }
          .hero-stat { min-width: calc(50% - 12px); text-align: center; }
          .timeline-item { grid-template-columns: 80px 1fr; gap: 20px; padding-left: 24px; }
          .testimonial-grid { grid-template-columns: 1fr; gap: 20px; }
          .client-premium-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          .client-premium-card { padding: 20px 14px; min-height: 150px; gap: 12px; }
          .client-logo-wrapper { width: 56px; height: 56px; padding: 10px; }
          .client-brand-name { font-size: 12px; }
          .client-industry { font-size: 9px; }
          .story-grid { gap: 36px; }
        }
        @media (max-width: 400px) {
          .client-premium-grid { grid-template-columns: 1fr; }
          .client-premium-card { min-height: auto; }
          .hero-stat { min-width: 100%; }
        }
      `}</style>
    </>
  );
}
