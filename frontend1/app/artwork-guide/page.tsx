import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ScrollAnimations from '@/components/ui/ScrollAnimations';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import { CmykChips } from '@/components/brand/CmykStrip';
import { WA_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Print Artwork Guide: File Formats, Bleed & Resolution',
  description:
    'How to prepare print-ready artwork for flex banners, sign boards, vehicle wraps, brochures and visiting cards. File formats, colour mode, bleed and resolution by job.',
  alternates: { canonical: 'https://vijethadigital.com/artwork-guide' },
  openGraph: {
    title: 'Print Artwork Guide | Vijetha Digital',
    description: 'File formats, colour mode, bleed and resolution for each type of print and signage job.',
    url: 'https://vijethadigital.com/artwork-guide',
    type: 'article',
  },
};

const CHECKLIST: [string, string][] = [
  ['Set the document to final size', 'For very large jobs, work at 1:10 and tell us the scale.'],
  ['Use CMYK colour', 'RGB files shift when printed, and bright blues and greens shift the most.'],
  ['Convert fonts to outlines', 'A missing font can change the text or the layout.'],
  ['Embed linked images', 'Otherwise they can arrive missing or at low resolution.'],
  ['Add 3 mm bleed on trimmed items', 'Extend the background past the cut line so no white edge shows.'],
  ['Keep text 5 mm inside the trim', 'Small cutting movement then won’t clip your text.'],
];

const SPECS: [string, string, string, string][] = [
  ['Visiting cards, brochures, flyers', 'Print-ready PDF', '300 dpi at final size', '3 mm bleed on all sides'],
  ['Flex banners and hoardings', 'PDF, TIFF or CDR', '72 to 150 dpi at final size', 'Allow extra margin for hems and eyelets'],
  ['Stickers and die-cut vinyl', 'Vector: AI, CDR or PDF', 'Vector, or 300 dpi for images', 'Put the cut line on a separate layer'],
  ['Vehicle wraps', 'Vector: AI, CDR or PDF', '100 to 150 dpi at final size', 'Send the model and photos of every side'],
  ['LED, acrylic and ACP signs', 'Vector logo: AI, CDR or PDF', 'Vector only for cut letters', 'Send the board size and a site photo'],
];

export default function ArtworkGuidePage() {
  return (
    <>
      <ScrollAnimations />
      <Header />
      <main>
        <section className="vd-guide-hero">
          <div className="wix-container">
            <Breadcrumbs items={[{ name: 'Artwork Guide', url: '/artwork-guide' }]} />
            <p className="vd-eyebrow"><CmykChips /> For designers and print buyers</p>
            <h1 className="vd-guide-title">How to prepare artwork for print</h1>
            <p className="vd-body vd-guide-lead" data-speakable>
              A print-ready file is set at final size in CMYK, with fonts outlined, images embedded
              and 3 mm bleed on trimmed items. Resolution depends on viewing distance: 300 dpi for
              items held in the hand, and 72 to 150 dpi for large banners seen from a distance.
            </p>
          </div>
        </section>

        <section className="vd-section vd-section--white" aria-labelledby="checklist-heading">
          <div className="wix-container">
            <h2 id="checklist-heading" className="vd-h2 wix-motion wix-fade-up">Before you send any file</h2>
            <ol className="vd-checklist">
              {CHECKLIST.map(([title, detail], i) => (
                <li key={title} className="wix-motion wix-fade-up" style={{ transitionDelay: `${(i % 3) * 80}ms` }}>
                  <h3>{title}</h3>
                  <p>{detail}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="vd-section vd-section--cream" aria-labelledby="specs-heading">
          <div className="wix-container">
            <h2 id="specs-heading" className="vd-h2 wix-motion wix-fade-up">File specs by job</h2>
            <div className="vd-table-scroll wix-motion wix-fade-up">
              <table className="vd-table vd-table--wide">
                <thead>
                  <tr>
                    <th scope="col">Job</th>
                    <th scope="col">File format</th>
                    <th scope="col">Resolution</th>
                    <th scope="col">Also needed</th>
                  </tr>
                </thead>
                <tbody>
                  {SPECS.map(([job, format, resolution, extra]) => (
                    <tr key={job}>
                      <th scope="row">{job}</th>
                      <td>{format}</td>
                      <td>{resolution}</td>
                      <td>{extra}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="vd-section vd-section--white" aria-labelledby="unsure-heading">
          <div className="wix-container vd-guide-cta wix-motion wix-fade-up">
            <div>
              <h2 id="unsure-heading" className="vd-h2">Not sure your file is ready?</h2>
              <p className="vd-body">Send it on WhatsApp with the size you need, and we&apos;ll tell you what to change.</p>
            </div>
            <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="vd-btn">Check my file</a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
