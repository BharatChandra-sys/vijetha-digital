import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    // Simulate form submission - in production this would call an API
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      setError("Failed to send message. Please try again or contact us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-warm-white font-display">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-plum-deep via-plum-deep to-plum-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
            <p className="text-lg text-warm-white/90 max-w-2xl mx-auto">
              Have a question or need a quote? We're here to help you create stunning signage and prints for your business.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-plum-deep mb-6">Contact Information</h2>
                
                {/* Business Address */}
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-plum-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-plum-deep" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-plum-900 mb-1">Our Office</h3>
                      <p className="text-plum-700">
                        Vijetha Digital<br />
                        Plot No. 157, Road No. 3<br />
                        Jubilee Hills, Hyderabad<br />
                        Telangana 500033, India
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-plum-100 rounded-lg flex items-center justify-center">
                      <Phone className="w-6 h-6 text-plum-deep" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-plum-900 mb-1">Phone</h3>
                      <a href="tel:+914023558899" className="text-plum-700 hover:text-plum-deep transition-colors">
                        +91 40 2355 8899
                      </a>
                      <br />
                      <a href="tel:+919848012345" className="text-plum-700 hover:text-plum-deep transition-colors">
                        +91 98480 12345
                      </a>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-plum-100 rounded-lg flex items-center justify-center">
                      <Mail className="w-6 h-6 text-plum-deep" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-plum-900 mb-1">Email</h3>
                      <a href="mailto:info@vijethadigital.com" className="text-plum-700 hover:text-plum-deep transition-colors">
                        info@vijethadigital.com
                      </a>
                      <br />
                      <a href="mailto:orders@vijethadigital.com" className="text-plum-700 hover:text-plum-deep transition-colors">
                        orders@vijethadigital.com
                      </a>
                    </div>
                  </div>

                  {/* Business Hours */}
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-plum-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-plum-deep" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-plum-900 mb-1">Business Hours</h3>
                      <p className="text-plum-700">
                        Monday - Saturday<br />
                        9:00 AM - 7:00 PM<br />
                        <span className="text-sm italic">Sunday: Closed</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* GST & Business Details */}
              <div className="bg-plum-50 rounded-lg p-6 border-2 border-plum-100">
                <h3 className="font-semibold text-plum-900 mb-3">Business Details</h3>
                <div className="space-y-2 text-sm text-plum-700">
                  <p><span className="font-medium">Proprietor:</span> Krishnam Raju</p>
                  <p><span className="font-medium">GSTIN:</span> 36AGBPC3175H1ZP</p>
                  <p><span className="font-medium">Established:</span> 2002</p>
                  <p><span className="font-medium">Type:</span> Sole Proprietorship</p>
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-gradient-to-br from-plum-deep to-plum-600 rounded-lg p-6 text-white">
                <h3 className="font-semibold mb-3">Quick Actions</h3>
                <div className="space-y-3">
                  <a
                    href="https://wa.me/919848012345"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-white/10 hover:bg-white/20 rounded-lg px-4 py-3 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">💬</span>
                      <span className="font-medium">WhatsApp Us</span>
                    </div>
                  </a>
                  <a
                    href="tel:+919848012345"
                    className="block bg-white/10 hover:bg-white/20 rounded-lg px-4 py-3 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">📞</span>
                      <span className="font-medium">Call Now</span>
                    </div>
                  </a>
                  <a
                    href="https://maps.google.com/?q=Jubilee+Hills+Hyderabad"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-white/10 hover:bg-white/20 rounded-lg px-4 py-3 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🗺️</span>
                      <span className="font-medium">Get Directions</span>
                    </div>
                  </a>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-white rounded-lg p-6 border-2 border-plum-100">
                <h3 className="font-semibold text-plum-900 mb-4">Follow Us</h3>
                <div className="flex gap-3">
                  <a
                    href="https://www.facebook.com/vijethadigital"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-[#1877F2] hover:bg-[#166FE5] text-white rounded-lg px-4 py-3 transition-colors flex items-center justify-center space-x-2"
                    title="Follow us on Facebook"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span className="font-medium text-sm">Facebook</span>
                  </a>
                  <a
                    href="https://www.instagram.com/vijethadigital"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#F77737] hover:opacity-90 text-white rounded-lg px-4 py-3 transition-opacity flex items-center justify-center space-x-2"
                    title="Follow us on Instagram"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                    </svg>
                    <span className="font-medium text-sm">Instagram</span>
                  </a>
                </div>
                <div className="mt-4 pt-4 border-t border-plum-100">
                  <a
                    href="https://www.linkedin.com/company/vijethadigital"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-2 bg-[#0A66C2] hover:bg-[#004182] text-white rounded-lg px-4 py-3 transition-colors"
                    title="Connect on LinkedIn"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    <span className="font-medium text-sm">LinkedIn</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-plum-100">
                <h2 className="text-2xl font-bold text-plum-deep mb-6">Send us a Message</h2>

                {submitted ? (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-plum-900 mb-2">Message Sent!</h3>
                    <p className="text-plum-700 mb-6">
                      Thank you for contacting us. We'll get back to you within 24 hours.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="bg-plum-deep text-white px-6 py-2 rounded-lg hover:bg-plum-700 transition-colors"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        {error}
                      </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Name */}
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-plum-900 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border-2 border-plum-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-plum-500 focus:border-transparent transition-all"
                          placeholder="Your full name"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-plum-900 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border-2 border-plum-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-plum-500 focus:border-transparent transition-all"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Phone */}
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-plum-900 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border-2 border-plum-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-plum-500 focus:border-transparent transition-all"
                          placeholder="+91 98480 12345"
                        />
                      </div>

                      {/* Subject */}
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-plum-900 mb-2">
                          Subject *
                        </label>
                        <select
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border-2 border-plum-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-plum-500 focus:border-transparent transition-all"
                        >
                          <option value="">Select a topic</option>
                          <option value="quote">Request a Quote</option>
                          <option value="order">Order Inquiry</option>
                          <option value="support">Product Support</option>
                          <option value="partnership">Business Partnership</option>
                          <option value="feedback">Feedback</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-plum-900 mb-2">
                        Your Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full px-4 py-3 border-2 border-plum-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-plum-500 focus:border-transparent transition-all resize-none"
                        placeholder="Tell us about your requirements, project details, or any questions you have..."
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-gradient-to-r from-plum-deep to-plum-600 text-white py-4 rounded-lg font-semibold hover:from-plum-700 hover:to-plum-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg shadow-plum-500/30"
                    >
                      {submitting ? (
                        <>
                          <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          <span>Send Message</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>

              {/* Map Section */}
              <div className="mt-8 bg-white rounded-xl shadow-lg overflow-hidden border-2 border-plum-100">
                <div className="aspect-[16/9] bg-plum-50">
                  <iframe
                    title="Vijetha Digital Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.3928249792537!2d78.40684631487721!3d17.43395468805678!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb9147e08dc46d%3A0x6f89dd0d37d6c84e!2sJubilee%20Hills%2C%20Hyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1647856234567!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-plum-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-plum-deep text-center mb-12">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-plum-100">
              <h3 className="font-semibold text-plum-900 mb-2">What is your minimum order quantity?</h3>
              <p className="text-plum-700 text-sm">
                We accept orders of all sizes, from single sign boards to bulk orders of 1000+ items. No minimum order quantity required.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-plum-100">
              <h3 className="font-semibold text-plum-900 mb-2">How long does production take?</h3>
              <p className="text-plum-700 text-sm">
                Standard orders are completed within 3-5 business days. Rush orders are available for an additional fee and can be completed in 24-48 hours.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-plum-100">
              <h3 className="font-semibold text-plum-900 mb-2">Do you provide installation services?</h3>
              <p className="text-plum-700 text-sm">
                Yes, we offer professional installation for sign boards, LED boards, and ACP panels across Hyderabad. Installation charges apply based on location and complexity.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-plum-100">
              <h3 className="font-semibold text-plum-900 mb-2">Can I get a quotation before ordering?</h3>
              <p className="text-plum-700 text-sm">
                Absolutely! Use our online calculator for instant pricing, or contact us with your requirements for a detailed custom quote within 2-4 hours.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-plum-100">
              <h3 className="font-semibold text-plum-900 mb-2">Do you offer GST invoices?</h3>
              <p className="text-plum-700 text-sm">
                Yes, all orders come with proper GST invoices. Our GSTIN is 36AGBPC3175H1ZP. Perfect for business purchases and tax filing.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-plum-100">
              <h3 className="font-semibold text-plum-900 mb-2">What payment methods do you accept?</h3>
              <p className="text-plum-700 text-sm">
                We accept online payments (UPI, cards, net banking), NEFT/RTGS transfers, and cash. For bulk orders, we offer credit terms to verified corporate clients.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
