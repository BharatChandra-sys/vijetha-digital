import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy | Vijetha Digital',
  description:
    'Review how Vijetha Digital collects, uses, and protects your personal information on our website and in our services.',
  alternates: {
    canonical: 'https://vijethadigital.com/privacy',
  },
  robots: {
    index: false,
    follow: false,
  },
};

const font     = "'helvetica-w01-roman','Helvetica Neue',Helvetica,Arial,sans-serif";
const fontBold = "'helvetica-w01-bold','Helvetica Neue',Helvetica,Arial,sans-serif";

type Section = {
  id: string;
  title: string;
  body?: string;
  intro?: string;
  items?: string[];
  footer?: string;
  subsections?: Array<{
    heading: string;
    intro: string;
    items: string[];
  }>;
};

const sections: Section[] = [
  {
    id: '01', title: 'Introduction & DPDP Act 2023 Compliance',
    body: 'Vijetha Digital ("we," "our," or "us") is committed to protecting your privacy in compliance with the Digital Personal Data Protection Act, 2023 (DPDP Act) of India. This Privacy Policy explains how we collect, use, disclose, store, and safeguard your personal data when you visit our website and use our services. We process your data lawfully, transparently, and for specified purposes with your explicit consent.',
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
    id: '06', title: 'Your Rights Under DPDP Act 2023',
    intro: 'Under the Digital Personal Data Protection Act, 2023, you have the following rights:',
    items: [
      'Right to Access: Obtain confirmation and summary of personal data being processed',
      'Right to Correction: Request correction of inaccurate or misleading data',
      'Right to Erasure: Request deletion of your personal data (Right to be Forgotten)',
      'Right to Data Portability: Receive your data in a structured, machine-readable format',
      'Right to Withdraw Consent: Withdraw your consent at any time without penalty',
      'Right to Nominate: Nominate another individual to exercise your rights in case of death or incapacity',
      'Right to Grievance Redressal: File complaints with our Data Protection Officer or Data Protection Board of India',
    ],
    footer: 'To exercise any of these rights, contact us at privacy@vijethadigital.com or call +91 79426 43004. We will respond within 30 days.',
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
    id: '10', title: 'Data Localization & Cross-Border Transfers',
    body: 'In compliance with DPDP Act 2023, all personal data of Indian citizens is primarily stored and processed within India. If data transfer outside India is necessary for business operations, we ensure adequate safeguards through Standard Contractual Clauses (SCCs) and obtain explicit consent where required. Current data storage: AWS Mumbai Region (India).',
  },
  {
    id: '11', title: 'Data Breach Notification',
    body: 'In the event of a personal data breach that poses a risk to your rights and freedoms, we will notify the Data Protection Board of India and affected individuals within 72 hours of becoming aware of the breach. We maintain incident response procedures and conduct regular security audits to minimize breach risks.',
  },
  {
    id: '12', title: "Children's Privacy (DPDP Act Requirements)",
    body: "We do not knowingly process personal data of children below 18 years without verifiable parental consent. Parents/guardians have the right to review, delete, and refuse further collection of their child's data. If you believe we have inadvertently collected data from a child, contact us immediately at privacy@vijethadigital.com.",
  },
  {
    id: '13', title: 'Data Retention',
    body: 'We retain personal data only for as long as necessary to fulfill the purposes outlined in this policy or as required by law. Contact data: 3 years from last interaction. Transaction data: 7 years (as per Indian tax/accounting laws). Marketing data: Until consent is withdrawn. After retention periods, data is securely deleted or anonymized.',
  },
  {
    id: '14', title: 'Consent Management',
    body: 'We obtain your free, specific, informed, and unambiguous consent before processing your personal data. You can manage your consent preferences through our Cookie Consent Manager or by contacting us. Withdrawal of consent does not affect the lawfulness of processing based on consent before withdrawal. Critical service communications (order confirmations, security alerts) do not require consent.',
  },
  {
    id: '15', title: 'Grievance Redressal Mechanism',
    body: 'For privacy complaints or grievances, contact our Data Protection Officer (DPO): Vijetha Digital - Data Protection Officer, Email: privacy@vijethadigital.com, Phone: +91 79426 43004. We will acknowledge your complaint within 48 hours and resolve it within 30 days. If unsatisfied, you may escalate to the Data Protection Board of India (DPBI) at www.dpb.gov.in.',
  },
  {
    id: '16', title: 'Policy Updates',
    body: 'We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. Material changes will be communicated via email or prominent website notice 30 days before taking effect. Continued use after changes constitutes acceptance. Last updated: January 1, 2025. We encourage you to review this policy regularly.',
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
                    {s.body && (
                      <p style={{ fontFamily: font, fontSize: '15px', lineHeight: '1.7em', color: 'rgb(85,78,78)' }}>{s.body}</p>
                    )}
                    {s.subsections && s.subsections.map((sub) => (
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
                    {s.intro && (
                      <>
                        <p style={{ fontFamily: font, fontSize: '15px', color: 'rgb(85,78,78)', marginBottom: '10px' }}>{s.intro}</p>
                        {s.items && (
                          <ul style={{ listStyle: 'none', padding: 0, margin: 0, marginBottom: s.footer ? '14px' : 0 }}>
                            {s.items.map((item: string) => (
                              <li key={item} style={{ fontFamily: font, fontSize: '14px', color: 'rgb(85,78,78)', lineHeight: '1.8em', paddingLeft: '16px', position: 'relative' }}>
                                <span style={{ position: 'absolute', left: 0 }}>—</span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        )}
                        {s.footer && (
                          <p style={{ fontFamily: font, fontSize: '15px', color: 'rgb(85,78,78)', marginTop: '12px' }}>{s.footer}</p>
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
                <span style={{ fontFamily: font, fontSize: '12px', color: 'rgb(85,78,78)', paddingTop: '6px', minWidth: '28px' }}>17</span>
                <div style={{ flex: 1 }}>
                  <h2 style={{ fontFamily: fontBold, fontSize: 'clamp(18px, 1.8vw, 22px)', fontWeight: 400, color: '#000', marginBottom: '16px' }}>
                    Contact Us & Data Protection Officer
                  </h2>
                  <p style={{ fontFamily: font, fontSize: '15px', color: 'rgb(85,78,78)', marginBottom: '20px' }}>
                    For privacy-related questions, data access requests, or DPDP Act compliance queries, contact our Data Protection Officer:
                  </p>
                  <div style={{ backgroundColor: '#f1f0eb', padding: '28px 32px', borderLeft: '3px solid #000', marginBottom: '20px' }}>
                    <p style={{ fontFamily: fontBold, fontSize: '15px', color: '#000', marginBottom: '8px' }}>Vijetha Digital - Data Protection Officer</p>
                    <p style={{ fontFamily: font, fontSize: '14px', color: 'rgb(85,78,78)', lineHeight: '1.7em' }}>
                      H No. 11-5-456, Shop No. 5, Sanapride Complex<br />
                      Lakdikapool, Hyderabad, Telangana – 500004, India<br /><br />
                      <strong>Privacy Inquiries:</strong> <a href="mailto:privacy@vijethadigital.com" style={{ color: '#000', textDecoration: 'underline' }}>privacy@vijethadigital.com</a><br />
                      <strong>General Contact:</strong> <a href="mailto:info@vijethadigital.com" style={{ color: '#000', textDecoration: 'underline' }}>info@vijethadigital.com</a><br />
                      <strong>Phone:</strong> <a href="tel:+917942643004" style={{ color: '#000', textDecoration: 'underline' }}>+91 79426 43004</a><br />
                      <strong>WhatsApp:</strong> <a href="https://wa.me/919248195552" style={{ color: '#000', textDecoration: 'underline' }}>+91 92481 95552</a>
                    </p>
                  </div>
                  <div style={{ backgroundColor: '#e3f2fd', padding: '20px 24px', borderRadius: '8px', border: '1px solid #2196f3' }}>
                    <p style={{ fontFamily: fontBold, fontSize: '14px', color: '#1565c0', marginBottom: '8px' }}>
                      🛡️ DPDP Act 2023 Compliance Statement
                    </p>
                    <p style={{ fontFamily: font, fontSize: '13px', color: '#424242', lineHeight: '1.6em' }}>
                      Vijetha Digital is committed to full compliance with the Digital Personal Data Protection Act, 2023. 
                      We process personal data lawfully, transparently, and only for specified legitimate purposes. 
                      Your rights are protected, and we maintain robust security measures for all personal data. 
                      For escalations, contact the Data Protection Board of India at{' '}
                      <a href="https://www.dpb.gov.in" target="_blank" rel="noopener noreferrer" style={{ color: '#1565c0', textDecoration: 'underline' }}>
                        www.dpb.gov.in
                      </a>
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
