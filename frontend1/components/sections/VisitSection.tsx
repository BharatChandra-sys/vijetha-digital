import Image from 'next/image';
import { MAIN_BRANCH, branchMapsUrl } from '@/lib/branches';
import { WA_URL } from '@/lib/constants';

export default function VisitSection({ tone = 'cream' }: { tone?: 'cream' | 'white' }) {
  return (
    <section className={`vd-section vd-section--${tone}`} aria-labelledby="visit-heading">
      <div className="wix-container vd-mach-visit">
        <div className="vd-mach-visit-photos">
          <div className="vd-mach-visit-photo wix-motion wix-fade-right">
            <Image
              src="/images/vd/building-chengicherla-front.jpg"
              alt="Vijetha Digital LLP building in Chengicherla"
              fill
              sizes="(max-width: 900px) 50vw, 25vw"
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className="vd-mach-visit-photo wix-motion wix-fade-right wix-delay-2">
            <Image
              src="/images/vd/office-cabin.jpg"
              alt="Client meeting cabin at the Vijetha Digital head office"
              fill
              sizes="(max-width: 900px) 50vw, 25vw"
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>
        <div className="wix-motion wix-fade-left wix-delay-2">
          <p className="vd-eyebrow">Visit us</p>
          <h2 id="visit-heading" className="vd-h2">See your job on the machine</h2>
          <p className="vd-body">
            Bring your artwork or a sample to our head office. We&apos;ll show you the materials,
            print a test strip, and agree on colour before the full run.
          </p>
          <address className="vd-mach-address">
            {MAIN_BRANCH.lines[0]}<br />{MAIN_BRANCH.lines[1]}
          </address>
          <div className="vd-link-row">
            <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="vd-btn">Book a visit on WhatsApp</a>
            <a href={branchMapsUrl(MAIN_BRANCH)} target="_blank" rel="noopener noreferrer" className="vd-text-link">Get directions</a>
          </div>
        </div>
      </div>
    </section>
  );
}
