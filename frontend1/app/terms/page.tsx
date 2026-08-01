import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Terms of Service | Vijetha Digital',
  description: 'Terms and conditions for using Vijetha Digital products and services.',
};

const font     = "'helvetica-w01-roman','Helvetica Neue',Helvetica,Arial,sans-serif";
const fontBold = "'helvetica-w01-bold','Helvetica Neue',Helvetica,Arial,sans-serif";

const sections = [
  {
    id: '01', title: 'Agreement to Terms',
    body: "By accessing and using Vijetha Digital's website and services, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must not use our website or services.",
  },
  {
    id: '02', title: 'Use License',
    parts: [
      { heading: 'Permitted', intro: 'We grant you a limited, non-exclusive, non-transferable license to:', items: ['Access our website for lawful purposes', 'Place orders and purchase products/services', 'Download information for personal use only'] },
      { heading: 'Prohibited', intro: 'You are prohibited from:', items: ['Reproducing, duplicating, or copying content without permission', 'Attempting to gain unauthorized access to systems', 'Transmitting malware, viruses, or harmful code', 'Using automated tools or bots to scrape data', 'Reselling or redistributing services without authorization'] },
    ],
  },
  {
    id: '03', title: 'Product and Service Information',
    intro: 'We strive to ensure accurate product descriptions and pricing. However:',
    items: ['We reserve the right to modify product information at any time', 'Prices are subject to change without notice', 'We do not guarantee product availability', 'All product images are for illustration purposes only', 'Actual colors and dimensions may vary slightly'],
  },
  {
    id: '04', title: 'Order Placement and Fulfillment',
    parts: [
      { heading: 'Order Acceptance', body: 'We reserve the right to accept or reject any order at our sole discretion. Orders are subject to verification and are not final until confirmed via email.' },
      { heading: 'Delivery', body: 'Delivery timelines are estimates and not guaranteed. We are not liable for delays caused by external factors including weather, transportation issues, or customs clearance.' },
      { heading: 'Minimum Order Quantity (MOQ)', body: 'Some products have minimum order quantities. These will be clearly indicated on product pages.' },
    ],
  },
  {
    id: '05', title: 'Payment Terms',
    items: ['Payment must be made in full before order processing', 'All prices include applicable GST and taxes', 'Accepted payment methods: Credit/Debit cards, bank transfers, digital wallets', 'We use secure payment gateways for transaction protection', 'GST invoices are issued for all transactions'],
  },
  {
    id: '06', title: 'Returns and Refunds',
    parts: [
      { heading: 'Return Policy', intro: 'Returns are accepted within 7 days of delivery if:', items: ['The product is unused and in original condition', 'Packaging is intact with all components', 'Return is initiated within the specified timeframe'] },
      { heading: 'Non-Returnable Items', body: 'Custom prints, personalized items, and made-to-order products cannot be returned unless defective.' },
      { heading: 'Refund Processing', body: "Approved refunds are processed within 10–15 business days to the original payment method. Return shipping costs are the customer's responsibility unless the return is due to our error." },
    ],
  },
  {
    id: '07', title: 'Warranty Disclaimer',
    body: 'Products are provided "as is" without warranties of any kind, express or implied. We do not warrant that our website will be error-free, secure, or uninterrupted. To the maximum extent permitted by law, Vijetha Digital disclaims all warranties.',
  },
  {
    id: '08', title: 'Limitation of Liability',
    body: 'In no event shall Vijetha Digital be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our website or services, even if advised of the possibility of such damages.',
  },
  {
    id: '09', title: 'User Accounts',
    intro: 'If you create an account with us:',
    items: ['You are responsible for maintaining account security', 'You must provide accurate and current information', 'You are liable for activities under your account', 'Do not share your credentials with others', 'We reserve the right to suspend accounts with suspicious activity'],
  },
  {
    id: '10', title: 'Intellectual Property',
    body: 'All content on our website, including text, graphics, logos, images, and software, is the property of Vijetha Digital or its content suppliers. Reproduction without permission is prohibited.',
  },
  {
    id: '11', title: 'Third-Party Links',
    body: 'Our website may contain links to third-party websites. We are not responsible for their content or practices. Use third-party links at your own risk.',
  },
  {
    id: '12', title: 'Prohibited Conduct',
    intro: 'You agree not to:',
    items: ['Harass, threaten, or defame other users', 'Post spam, advertisements, or promotional content', 'Attempt to hack or breach our systems', 'Violate any applicable laws or regulations', 'Engage in any unlawful activity'],
  },
  {
    id: '13', title: 'Indemnification',
    body: 'You agree to indemnify and hold harmless Vijetha Digital from any claims, damages, liabilities, and expenses arising from your violation of these terms or your use of our website.',
  },
  {
    id: '14', title: 'Modification of Terms',
    body: 'We reserve the right to modify these terms at any time. Changes become effective immediately upon posting. Continued use of our website constitutes acceptance of modified terms.',
  },
];

export default function TermsPage() {
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
            Terms of Service
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
                    {'intro' in s && s.intro && (
                      <>
                        <p style={{ fontFamily: font, fontSize: '15px', color: 'rgb(85,78,78)', marginBottom: '10px' }}>{s.intro}</p>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                          {(s as any).items?.map((item: string) => (
                            <li key={item} style={{ fontFamily: font, fontSize: '14px', color: 'rgb(85,78,78)', lineHeight: '1.8em', paddingLeft: '16px', position: 'relative' }}>
                              <span style={{ position: 'absolute', left: 0 }}>—</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                    {'items' in s && !('intro' in s) && (s as any).items && (
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {(s as any).items.map((item: string) => (
                          <li key={item} style={{ fontFamily: font, fontSize: '14px', color: 'rgb(85,78,78)', lineHeight: '1.8em', paddingLeft: '16px', position: 'relative' }}>
                            <span style={{ position: 'absolute', left: 0 }}>—</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                    {'parts' in s && s.parts && s.parts.map((part: any) => (
                      <div key={part.heading} style={{ marginBottom: '18px' }}>
                        <p style={{ fontFamily: fontBold, fontSize: '14px', color: '#000', marginBottom: '8px' }}>{part.heading}</p>
                        {part.body && <p style={{ fontFamily: font, fontSize: '14px', color: 'rgb(85,78,78)', lineHeight: '1.7em' }}>{part.body}</p>}
                        {part.intro && <p style={{ fontFamily: font, fontSize: '14px', color: 'rgb(85,78,78)', marginBottom: '8px' }}>{part.intro}</p>}
                        {part.items && (
                          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {part.items.map((item: string) => (
                              <li key={item} style={{ fontFamily: font, fontSize: '14px', color: 'rgb(85,78,78)', lineHeight: '1.8em', paddingLeft: '16px', position: 'relative' }}>
                                <span style={{ position: 'absolute', left: 0 }}>—</span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* Contact block */}
            <div>
              <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                <span style={{ fontFamily: font, fontSize: '12px', color: 'rgb(85,78,78)', paddingTop: '6px', minWidth: '28px' }}>15</span>
                <div style={{ flex: 1 }}>
                  <h2 style={{ fontFamily: fontBold, fontSize: 'clamp(18px, 1.8vw, 22px)', fontWeight: 400, color: '#000', marginBottom: '16px' }}>
                    Contact Information
                  </h2>
                  <p style={{ fontFamily: font, fontSize: '15px', color: 'rgb(85,78,78)', marginBottom: '20px' }}>
                    For questions about these terms, please contact us at:
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
