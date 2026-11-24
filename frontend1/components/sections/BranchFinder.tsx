'use client';

import { useEffect, useState } from 'react';
import { BRANCHES, HOURS_LABEL, getOpenStatus, branchMapsUrl } from '@/lib/branches';
import { PHONE, PHONE_RAW } from '@/lib/constants';

export default function BranchFinder() {
  // Set after mount: the time on the server differs from the visitor's, and the
  // result must never be cached into the static HTML.
  const [status, setStatus] = useState<ReturnType<typeof getOpenStatus> | null>(null);

  useEffect(() => {
    setStatus(getOpenStatus());
    const timer = window.setInterval(() => setStatus(getOpenStatus()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section id="branches" className="vd-section vd-section--cream" aria-labelledby="branches-heading">
      <div className="wix-container">
        <div className="vd-branches-head wix-motion wix-fade-up">
          <h2 id="branches-heading" className="vd-h2">Two branches in Hyderabad</h2>
          <div>
            <p className="vd-open-status" data-open={status?.open ?? undefined}>
              {status ? status.label : ' '}
            </p>
            <p className="vd-rating-meta">{HOURS_LABEL}</p>
          </div>
        </div>

        <div className="vd-branches">
          {BRANCHES.map((branch, i) => (
            <div key={branch.name} className={`vd-branch wix-motion wix-fade-up wix-delay-${i + 1}`}>
              <p className="vd-branch-role">{branch.role}</p>
              <h3 className="vd-branch-name">{branch.name}</h3>
              <address>{branch.lines[0]}<br />{branch.lines[1]}</address>
              <a href={branchMapsUrl(branch)} target="_blank" rel="noopener noreferrer" className="vd-text-link">
                Get directions
              </a>
            </div>
          ))}
        </div>

        <p className="vd-branches-call wix-motion wix-fade-up">
          Call or WhatsApp any time during opening hours: <a href={`tel:+${PHONE_RAW}`}>{PHONE}</a>
        </p>
      </div>
    </section>
  );
}
