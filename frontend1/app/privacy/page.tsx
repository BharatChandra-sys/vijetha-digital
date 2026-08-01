import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy | Vijetha Digital',
  description: 'How Vijetha Digital collects, uses, and protects your personal information.',
};

const font     = "'helvetica-w01-roman','Helvetica Neue',Helvetica,Arial,sans-serif";
const fontBold = "'helvetica-w01-bold','Helvetica Neue',Helvetica,Arial,sans-serif";

const sections = [
  {
    id: '01', title: 'Introduction',
    body: 'Vijetha Digital ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.',
  },
  {
    id: '02', title: 'Information We Collect',
    subsections: [
      {
        heading: 'Personal Information',
        intro: 'We collect personal information you voluntarily provide, such as:',
        items: ['Name and contact information (email, phone number)', 'Business information and company details', 'Billing and shipping addresses', 'Order information and payment details', 'Account credentials and preferences'],
      },
      {
        heading: 'Automatically Collected Information',
        intro: 'We automatically collect:',
        items: ['Browser type and operating system', 'IP address and device identifiers', 'Pages visited and time spent on site', 'Cookies and similar tracking technologies', 'Search queries and interaction data'],
      },
    ],
  },
  {
    id: '03', title: 'How We Use Your Information',
    intro: 'We use collected information to:',
    items: ['Process orders and deliver products/services', 'Send transactional emails and order updates', 'Respond to customer inquiries and support requests', 'Improve website functionality and user experience', 'Send marketing communications (with consent)', 'Comply with legal obligations and regulations', 'Prevent fraud and ensure account security'],
  },
  {
    id: '04', title: 'Information Sharing and Disclosure',
    intro: 'We may share your information with:',
    items: ['Service providers and vendors (payment processors, shipping partners)', 'Third-party partners for marketing purposes (with your consent)', 'Legal authorities when required by law', 'Successor organizations in case of business transfer'],
    footer: 'We do not sell your personal information to third parties.',
  },
  {
    id: '05', title: 'Data Security',
    body: 'We implement industry-standard security measures to protect your personal information, including encryption, secure server communication, and regular security assessments. However, no online transmission is 100% secure. We encourage you to use strong passwords and maintain the confidentiality of your account information.',
  },
  {
    id: '06', title: 'Your Privacy Rights',
    intro: 'You have the right to:',
    items: ['Access and review your personal information', 'Request correction of inaccurate data', 'Request deletion of your information', 'Opt-out of marketing communications', 'Request a copy of your data (data portability)', 'Object to certain processing activities'],
  },
  {
    id: '07', title: 'Cookies and Tracking',
    body: 'We use cookies to enhance your browsing experience, remember your preferences, and understand user behavior. You can control cookie settings through your browser preferences. Disabling cookies may affect some website functionality.',
  },
  {
    id: '08', title: 'Third-Party Links',
    body: 'Our website may contain links to third-party websites. We are not responsible for their privacy practices. We encourage you to review their privacy policies before sharing any information.',
  },
  {
    id: '09', title: "Children's Privacy",
    body: 'Our services are not directed toward individuals under 18 years of age. We do not knowingly collect personal information from children. If we become aware of such collection, we will take immediate steps to delete the information.',
  },
  {
    id: '10', title: 'Policy Updates',
    body: 'We may update this Privacy Policy from time to time. Changes will be effective upon posting to our website. We encourage you to review this policy regularly to stay informed about how we protect your privacy.',
  },
];

export default function PrivacyPage() {
  return (
    <>
      <Header variant="home" />

      {/* Hero */}
      <section style={{ backgroundColor: '#1c1d20', paddingTop: '140px', paddingBottom: '64px' }}>
        <div className="wix-container">
          <p style={{ fontFamily: font, fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: '14px' }}>
            Legal
          </p>
          <h1 style={{ fontFamily: font, fontSize: 'clamp(36px, 4.5vw, 58px)', fontWeight: 400, lineHeight: 1.1, color: '#fff' }}>
            Privacy Policy
          </h1>
          <p style={{ fontFamily: font, fontSize: '14px', color: 'rgba(255,255,255,0.45)', marginTop: '16px' }}>
            Effective Date: January 1, 2025
          </p>
        </div>
      </section>

      {/* Content */}
      <section style={{ backgroundColor: '#fff', padding: '80px 0' }}>
        <div className="wix-container">
          <div style={{ maxWidth: '760px' }}>
            {sections.map((s) => (
              <div key={s.id} style={{ marginBottom: '56px', paddingBottom: '56px', borderBottom: '1px solid #e8e8e4' }}>
                <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                  <span style={{ fontFamily: font, fontSize: '12px', color: 'rgb(85,78,78)', paddingTop: '6px', minWidth: '28px' }}>{s.id}</span>
                  <div style={{ flex: 1 }}>
                    <h2 style={{ fontFamily: fontBold, fontSize: 'clamp(18px, 1.8vw, 22px)', fontWeight: 400, color: '#000', marginBottom: '16px' }}>
                      {s.title}
                    </h2>
                    {'body' in s && s.body && (
                      <p style={{ fontFamily: font, fontSize: '15px', lineHeight: '1.7em', color: 'rgb(85,78,78)' }}>{s.body}</p>
                    )}
                    {'subsections' in s && s.subsections && s.subsections.map((sub) => (
                      <div key={sub.heading} style={{ marginBottom: '20px' }}>
                        <p style={{ fontFamily: fontBold, fontSize: '14px', color: '#000', marginBottom: '8px' }}>{sub.heading}</p>
                        <p style={{ fontFamily: font, fontSize: '15px', color: 'rgb(85,78,78)', marginBottom: '8px' }}>{sub.intro}</p>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                          {sub.items.map((item) => (
                            <li key={item} style={{ fontFamily: font, fontSize: '14px', color: 'rgb(85,78,78)', lineHeight: '1.8em', paddingLeft: '16px', position: 'relative' }}>
                              <span style={{ position: 'absolute', left: 0 }}>—</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    {'intro' in s && s.intro && (
                      <>
                        <p style={{ fontFamily: font, fontSize: '15px', color: 'rgb(85,78,78)', marginBottom: '10px' }}>{s.intro}</p>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, marginBottom: ('footer' in s && s.footer) ? '14px' : 0 }}>
                          {(s as any).items?.map((item: string) => (
                            <li key={item} style={{ fontFamily: font, fontSize: '14px', color: 'rgb(85,78,78)', lineHeight: '1.8em', paddingLeft: '16px', position: 'relative' }}>
                              <span style={{ position: 'absolute', left: 0 }}>—</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                        {'footer' in s && s.footer && (
                          <p style={{ fontFamily: font, fontSize: '15px', color: 'rgb(85,78,78)', marginTop: '12px' }}>{(s as any).footer}</p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Contact block */}
            <div style={{ marginBottom: '56px' }}>
              <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                <span style={{ fontFamily: font, fontSize: '12px', color: 'rgb(85,78,78)', paddingTop: '6px', minWidth: '28px' }}>11</span>
                <div style={{ flex: 1 }}>
                  <h2 style={{ fontFamily: fontBold, fontSize: 'clamp(18px, 1.8vw, 22px)', fontWeight: 400, color: '#000', marginBottom: '16px' }}>
                    Contact Us
                  </h2>
                  <p style={{ fontFamily: font, fontSize: '15px', color: 'rgb(85,78,78)', marginBottom: '20px' }}>
                    For privacy-related questions or requests, please contact us at:
                  </p>
                  <div style={{ backgroundColor: '#f1f0eb', padding: '28px 32px', borderLeft: '3px solid #000' }}>
                    <p style={{ fontFamily: fontBold, fontSize: '15px', color: '#000', marginBottom: '8px' }}>Vijetha Digital</p>
                    <p style={{ fontFamily: font, fontSize: '14px', color: 'rgb(85,78,78)', lineHeight: '1.7em' }}>
                      H No. 11-5-456, Shop No. 5, Sanapride Complex<br />
                      Lakdikapool, Hyderabad – 500004<br /><br />
                      Email: <a href="mailto:info@vijethadigital.com" style={{ color: '#000', textDecoration: 'underline' }}>info@vijethadigital.com</a><br />
                      Phone: <a href="tel:+917942643004" style={{ color: '#000', textDecoration: 'underline' }}>+91 79426 43004</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
