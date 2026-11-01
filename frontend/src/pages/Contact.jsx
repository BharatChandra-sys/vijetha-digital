import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import usePageTitle from "../hooks/usePageTitle";
import { BRANCHES, BUSINESS, mapsLink, whatsappUrl } from "../config/business";

const SUBJECTS = [
  ["quote", "Request a Quote"],
  ["order", "Order Inquiry"],
  ["support", "Product Support"],
  ["partnership", "Business Partnership"],
  ["feedback", "Feedback"],
  ["other", "Other"],
];

const FAQS = [
  ["What is your minimum order quantity?", "We accept orders of all sizes, from single sign boards to bulk orders of 1000+ items. No minimum order quantity required."],
  ["How long does production take?", "Standard orders are completed within 3-5 business days. Rush orders are available for an additional fee and can be completed in 24-48 hours."],
  ["Do you provide installation services?", "Yes, we offer professional installation for sign boards, LED boards, and ACP panels across Hyderabad. Installation charges apply based on location and complexity."],
  ["Can I get a quotation before ordering?", "Absolutely! Use our online calculator for instant pricing, or contact us with your requirements for a detailed custom quote within 2-4 hours."],
  ["Do you offer GST invoices?", `Yes, all orders come with proper GST invoices. Our GSTIN is ${BUSINESS.gstin}. Perfect for business purchases and tax filing.`],
  ["What payment methods do you accept?", "We accept online payments (UPI, cards, net banking), NEFT/RTGS transfers, and cash. For bulk orders, we offer credit terms to verified corporate clients."],
];

const SOCIALS = [
  ["Facebook", "https://www.facebook.com/vijethadigital"],
  ["Instagram", "https://www.instagram.com/vijethadigital"],
  ["LinkedIn", "https://www.linkedin.com/company/vijethadigital"],
];

export default function Contact() {
  usePageTitle("Contact Us");
  const [searchParams] = useSearchParams();
  const presetSubject = searchParams.get("subject");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: SUBJECTS.some(([value]) => value === presetSubject) ? presetSubject : "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [activeBranch, setActiveBranch] = useState(BRANCHES[0]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* There is no contact API, so hand the message to the customer's email app
     rather than showing a success screen for a message that went nowhere. */
  const handleSubmit = (e) => {
    e.preventDefault();
    const subjectLabel = SUBJECTS.find(([value]) => value === formData.subject)?.[1] || "Website enquiry";
    const body = [
      formData.message,
      "",
      `Name: ${formData.name}`,
      `Phone: ${formData.phone}`,
      `Email: ${formData.email}`,
    ].join("\n");
    window.location.href = `mailto:${BUSINESS.email}?subject=${encodeURIComponent(`${subjectLabel} - ${formData.name}`)}&body=${encodeURIComponent(body)}`;
    setSubmitted(true);
  };

  const sendOnWhatsApp = () => {
    const text = `Hello Vijetha Digital, I'm ${formData.name || "interested in your services"}.\n\n${formData.message}`;
    window.open(whatsappUrl(text), "_blank", "noopener,noreferrer");
  };

  return (
    <main id="main" className="font-display">
      <section className="vd-wrap pb-8 pt-8 lg:pb-12 lg:pt-14">
        <h1 className="vd-display">Get in Touch</h1>
        <p className="vd-lede mt-4 max-w-2xl">
          Have a question or need a quote? We're here to help you create stunning signage and prints for your business.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a href={BUSINESS.phoneHref} className="vd-btn vd-btn-lg vd-btn-accent vd-price">
            <span className="material-symbols-outlined text-xl">call</span>Call {BUSINESS.phone}
          </a>
          <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="vd-btn vd-btn-lg vd-btn-outline">WhatsApp Us</a>
          <a href={mapsLink(activeBranch)} target="_blank" rel="noopener noreferrer" className="vd-btn vd-btn-lg vd-btn-outline">Get Directions</a>
        </div>
      </section>

      <section className="vd-wrap grid gap-10 pb-14 lg:grid-cols-12 lg:gap-14 lg:pb-20">
        {/* Form */}
        <div className="lg:col-span-7">
          <h2 className="vd-h2">Send us a Message</h2>

          {submitted ? (
            <div className="mt-6 rounded-lg bg-surface p-6 shadow-[inset_0_0_0_1px_#DEDAD0]" role="status">
              <h3 className="vd-h3">Finish sending in your email app</h3>
              <p className="mt-2 text-ink-2">
                We've opened an email with your message filled in. Press send there and we'll get back to you within 24 hours.
                If nothing opened, email <a className="vd-link text-ink" href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a> or send it on WhatsApp instead.
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button onClick={sendOnWhatsApp} className="vd-btn vd-btn-ink">Send on WhatsApp</button>
                <button onClick={() => setSubmitted(false)} className="vd-btn vd-btn-quiet">Edit Message</button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor="name" className="vd-label">Full Name *</label>
                  <input type="text" id="name" name="name" autoComplete="name" value={formData.name} onChange={handleChange} required className="vd-input" placeholder="Your full name" />
                </div>
                <div>
                  <label htmlFor="email" className="vd-label">Email Address *</label>
                  <input type="email" id="email" name="email" autoComplete="email" spellCheck={false} value={formData.email} onChange={handleChange} required className="vd-input" placeholder="your@email.com" />
                </div>
                <div>
                  <label htmlFor="phone" className="vd-label">Phone Number *</label>
                  <input type="tel" id="phone" name="phone" inputMode="tel" autoComplete="tel" value={formData.phone} onChange={handleChange} required className="vd-input" placeholder="+91 98765 43210" />
                </div>
                <div>
                  <label htmlFor="subject" className="vd-label">Subject *</label>
                  <select id="subject" name="subject" value={formData.subject} onChange={handleChange} required className="vd-input">
                    <option value="">Select a topic</option>
                    {SUBJECTS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="message" className="vd-label">Your Message *</label>
                <textarea id="message" name="message" value={formData.message} onChange={handleChange} required rows={6} className="vd-input resize-y" placeholder="Tell us about your requirements, project details, or any questions you have…" />
              </div>
              <button type="submit" className="vd-btn vd-btn-lg vd-btn-ink w-full sm:w-auto">
                Send Message <span className="material-symbols-outlined text-xl">send</span>
              </button>
            </form>
          )}
        </div>

        {/* Details */}
        <aside className="lg:col-span-5">
          <h2 className="vd-h3">Contact Information</h2>
          <dl className="vd-rows mt-3 border-y border-line text-[0.9375rem]">
            <div>
              <dt className="font-semibold">Phone</dt>
              <dd className="vd-price text-right">
                <a className="block hover:underline underline-offset-2" href={BUSINESS.phoneHref}>{BUSINESS.phone}</a>
                <a className="block text-ink-2 hover:underline underline-offset-2" href={BUSINESS.altPhoneHref}>{BUSINESS.altPhone}</a>
              </dd>
            </div>
            <div>
              <dt className="font-semibold">Email</dt>
              <dd className="min-w-0 break-words text-right"><a className="hover:underline underline-offset-2" href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a></dd>
            </div>
            <div>
              <dt className="font-semibold">Business Hours</dt>
              <dd className="text-right">{BUSINESS.hours}<span className="block text-ink-2">Sunday: Closed</span></dd>
            </div>
            <div><dt className="font-semibold">Proprietor</dt><dd>{BUSINESS.proprietor}</dd></div>
            <div><dt className="font-semibold">GSTIN</dt><dd>{BUSINESS.gstin}</dd></div>
            <div><dt className="font-semibold">Established</dt><dd>{BUSINESS.established}</dd></div>
            <div><dt className="font-semibold">Type</dt><dd>Sole Proprietorship</dd></div>
            <div>
              <dt className="font-semibold">Follow Us</dt>
              <dd className="flex flex-wrap justify-end gap-x-3">
                {SOCIALS.map(([label, href]) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="vd-link">{label}</a>
                ))}
              </dd>
            </div>
          </dl>
        </aside>
      </section>

      {/* Branches and map */}
      <section id="branches" className="bg-surface">
        <div className="vd-wrap vd-section grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <h2 className="vd-h2">Our Branches</h2>
            <ul className="mt-6 space-y-2">
              {BRANCHES.map((b) => (
                <li key={b.id}>
                  <label className="relative block cursor-pointer">
                    <input type="radio" name="branch" className="sr-only" checked={activeBranch.id === b.id} onChange={() => setActiveBranch(b)} />
                    <span className="vd-option !p-4">
                      <span className="material-symbols-outlined vd-option-tick !right-3 !top-3 text-xl" aria-hidden="true">check_circle</span>
                      <span className="block pr-8 font-semibold">{b.name}{b.tag ? <span className="font-normal text-ink-2"> · {b.tag}</span> : null}</span>
                      <span className="mt-0.5 block pr-8 text-[0.9375rem] leading-snug text-ink-2">{b.address}</span>
                    </span>
                  </label>
                </li>
              ))}
            </ul>
            <a href={mapsLink(activeBranch)} target="_blank" rel="noopener noreferrer" className="vd-btn vd-btn-outline mt-4 w-full sm:w-auto">
              Directions to {activeBranch.name}
              <span className="material-symbols-outlined text-lg">open_in_new</span>
            </a>
          </div>
          <div className="vd-frame aspect-[4/3] lg:col-span-7 lg:aspect-auto lg:min-h-[420px]">
            <iframe
              key={activeBranch.id}
              title={`Map showing Vijetha Digital ${activeBranch.name}`}
              src={`https://maps.google.com/maps?q=${encodeURIComponent(activeBranch.mapQuery)}&z=15&output=embed`}
              className="absolute inset-0 h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="vd-wrap vd-section grid gap-8 lg:grid-cols-12 lg:gap-12">
        <h2 className="vd-h2 lg:col-span-4">Frequently Asked Questions</h2>
        <div className="divide-y divide-line border-y border-line lg:col-span-8">
          {FAQS.map(([q, a]) => (
            <details key={q} className="group py-1">
              <summary className="flex min-h-[52px] cursor-pointer list-none items-center justify-between gap-4 font-semibold [&::-webkit-details-marker]:hidden">
                {q}
                <span className="material-symbols-outlined text-xl text-ink-3 transition-transform group-open:rotate-180">expand_more</span>
              </summary>
              <p className="pb-4 pr-8 leading-relaxed text-ink-2">{a}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
