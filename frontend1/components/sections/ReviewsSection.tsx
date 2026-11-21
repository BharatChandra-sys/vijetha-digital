import { CmykChips } from '@/components/brand/CmykStrip';
import { CUSTOMER_REVIEWS, PUBLIC_RATING } from '@/lib/reviews';
import { BRANCHES, mapsUrl } from '@/lib/branches';

function Stars({ value }: { value: number }) {
  const path = 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z';
  const row = (fill: string) =>
    Array.from({ length: 5 }).map((_, i) => (
      <svg key={i} width="20" height="20" viewBox="0 0 24 24" fill={fill} aria-hidden="true">
        <path d={path} />
      </svg>
    ));

  return (
    <span className="vd-stars" role="img" aria-label={`${value} out of 5 stars`}>
      <span className="vd-stars-row">{row('#e4e1d8')}</span>
      <span className="vd-stars-row vd-stars-fill" style={{ width: `${(value / 5) * 100}%` }}>
        {row('var(--wix-accent)')}
      </span>
    </span>
  );
}

// Visible, linked text only. See lib/reviews.ts for why there is no JSON-LD here.
export default function ReviewsSection({ id = 'reviews' }: { id?: string }) {
  const { value, count, source, url, listing, checked } = PUBLIC_RATING;

  return (
    <section id={id} className="vd-section vd-section--white" aria-labelledby={`${id}-heading`}>
      <div className="wix-container">
        <div className="vd-reviews-grid">
          <div className="wix-motion wix-fade-right">
            <p className="vd-eyebrow"><CmykChips /> Customer reviews</p>
            <p className="vd-rating-value">{value.toFixed(1)}</p>
            <Stars value={value} />
            <p className="vd-rating-meta">
              From {count} ratings on {source}, {listing}. Checked {checked}.
            </p>
          </div>

          <div className="wix-motion wix-fade-left wix-delay-2">
            <h2 id={`${id}-heading`} className="vd-h2">Read what customers posted, in their own words.</h2>
            <p className="vd-body">
              We don&apos;t publish reviews we can&apos;t point you to. Our rating sits on public
              listings we don&apos;t control, so you can read the feedback there and decide for yourself.
            </p>
            <div className="vd-link-row">
              <a href={url} target="_blank" rel="noopener noreferrer" className="vd-btn">
                Read reviews on {source}
              </a>
              <a
                href={mapsUrl(BRANCHES[0].mapsQuery)}
                target="_blank"
                rel="noopener noreferrer"
                className="vd-text-link"
              >
                Find us on Google Maps
              </a>
            </div>
          </div>
        </div>

        {CUSTOMER_REVIEWS.length > 0 && (
          <ul className="vd-quote-grid">
            {CUSTOMER_REVIEWS.map((review, i) => (
              <li
                key={`${review.author}-${review.date}`}
                className="wix-motion wix-fade-up"
                style={{ transitionDelay: `${(i % 3) * 80}ms` }}
              >
                <blockquote className="vd-quote" cite={review.url}>
                  <p>&ldquo;{review.quote}&rdquo;</p>
                  <footer>
                    <strong>{review.author}</strong>
                    <span>
                      {review.date}, on{' '}
                      <a href={review.url} target="_blank" rel="noopener noreferrer">{review.source}</a>
                    </span>
                  </footer>
                </blockquote>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
