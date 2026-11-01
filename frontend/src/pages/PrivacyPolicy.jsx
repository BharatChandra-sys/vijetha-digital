import usePageTitle from "../hooks/usePageTitle";
export default function PrivacyPolicy() {
  usePageTitle("Privacy Policy");
  return (
    <main id="main" className="font-display">
      {/* Header */}
      <section className="pt-8 lg:pt-14">
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:max-w-4xl">
          <h1 className="vd-h1 mb-2">Privacy Policy</h1>
          <p className="vd-lede">Effective Date: January 1, 2025</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-10 lg:py-14">
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:max-w-4xl space-y-12">
          
          <div>
            <h2 className="vd-h3 !text-[1.375rem] mb-4">1. Introduction</h2>
            <p className="text-ink-2 leading-relaxed">
              Vijetha Digital ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
            </p>
          </div>

          <div>
            <h2 className="vd-h3 !text-[1.375rem] mb-4">2. Information We Collect</h2>
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-ink mb-2">Personal Information</h3>
                <p className="text-ink-2">We collect personal information you voluntarily provide, such as:</p>
                <ul className="list-disc list-inside text-ink-2 mt-2 space-y-1">
                  <li>Name and contact information (email, phone number)</li>
                  <li>Business information and company details</li>
                  <li>Billing and shipping addresses</li>
                  <li>Order information and payment details</li>
                  <li>Account credentials and preferences</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-ink mb-2">Automatically Collected Information</h3>
                <p className="text-ink-2">We automatically collect:</p>
                <ul className="list-disc list-inside text-ink-2 mt-2 space-y-1">
                  <li>Browser type and operating system</li>
                  <li>IP address and device identifiers</li>
                  <li>Pages visited and time spent on site</li>
                  <li>Cookies and similar tracking technologies</li>
                  <li>Search queries and interaction data</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h2 className="vd-h3 !text-[1.375rem] mb-4">3. How We Use Your Information</h2>
            <p className="text-ink-2 mb-3">We use collected information to:</p>
            <ul className="list-disc list-inside text-ink-2 space-y-1">
              <li>Process orders and deliver products/services</li>
              <li>Send transactional emails and order updates</li>
              <li>Respond to customer inquiries and support requests</li>
              <li>Improve website functionality and user experience</li>
              <li>Send marketing communications (with consent)</li>
              <li>Comply with legal obligations and regulations</li>
              <li>Prevent fraud and ensure account security</li>
            </ul>
          </div>

          <div>
            <h2 className="vd-h3 !text-[1.375rem] mb-4">4. Information Sharing and Disclosure</h2>
            <p className="text-ink-2 mb-3">We may share your information with:</p>
            <ul className="list-disc list-inside text-ink-2 space-y-1">
              <li>Service providers and vendors (payment processors, shipping partners)</li>
              <li>Third-party partners for marketing purposes (with your consent)</li>
              <li>Legal authorities when required by law</li>
              <li>Successor organizations in case of business transfer</li>
            </ul>
            <p className="text-ink-2 mt-3">We do not sell your personal information to third parties.</p>
          </div>

          <div>
            <h2 className="vd-h3 !text-[1.375rem] mb-4">5. Data Security</h2>
            <p className="text-ink-2 leading-relaxed">
              We implement industry-standard security measures to protect your personal information, including encryption, secure server communication, and regular security assessments. However, no online transmission is 100% secure. We encourage you to use strong passwords and maintain the confidentiality of your account information.
            </p>
          </div>

          <div>
            <h2 className="vd-h3 !text-[1.375rem] mb-4">6. Your Privacy Rights</h2>
            <p className="text-ink-2 mb-3">You have the right to:</p>
            <ul className="list-disc list-inside text-ink-2 space-y-1">
              <li>Access and review your personal information</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your information</li>
              <li>Opt-out of marketing communications</li>
              <li>Request a copy of your data (data portability)</li>
              <li>Object to certain processing activities</li>
            </ul>
          </div>

          <div>
            <h2 className="vd-h3 !text-[1.375rem] mb-4">7. Cookies and Tracking</h2>
            <p className="text-ink-2 leading-relaxed">
              We use cookies to enhance your browsing experience, remember your preferences, and understand user behavior. You can control cookie settings through your browser preferences. Disabling cookies may affect some website functionality.
            </p>
          </div>

          <div>
            <h2 className="vd-h3 !text-[1.375rem] mb-4">8. Third-Party Links</h2>
            <p className="text-ink-2 leading-relaxed">
              Our website may contain links to third-party websites. We are not responsible for their privacy practices. We encourage you to review their privacy policies before sharing any information.
            </p>
          </div>

          <div>
            <h2 className="vd-h3 !text-[1.375rem] mb-4">9. Children's Privacy</h2>
            <p className="text-ink-2 leading-relaxed">
              Our services are not directed toward individuals under 18 years of age. We do not knowingly collect personal information from children. If we become aware of such collection, we will take immediate steps to delete the information.
            </p>
          </div>

          <div>
            <h2 className="vd-h3 !text-[1.375rem] mb-4">10. Policy Updates</h2>
            <p className="text-ink-2 leading-relaxed">
              We may update this Privacy Policy from time to time. Changes will be effective upon posting to our website. We encourage you to review this policy regularly to stay informed about how we protect your privacy.
            </p>
          </div>

          <div>
            <h2 className="vd-h3 !text-[1.375rem] mb-4">11. Contact Us</h2>
            <p className="text-ink-2 mb-3">For privacy-related questions or requests, please contact us at:</p>
            <div className="bg-shade p-6 rounded-lg">
              <p className="font-semibold text-ink">Vijetha Digital</p>
              <p className="text-ink-2">H No. 11-5-456, Shop No. 5, Sanapride Complex</p>
              <p className="text-ink-2">Lakdikapool, Hyderabad - 500004</p>
              <p className="text-ink-2 mt-2">Email: <a href="mailto:info@vijethadigital.com" className="text-accent-dark hover:underline">info@vijethadigital.com</a></p>
              <p className="text-ink-2">Phone: <a href="tel:+917942643004" className="text-accent-dark hover:underline">+91 79426 43004</a></p>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
