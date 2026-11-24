// Public review data. Everything here must be copied from a live third-party
// listing, never written in-house.
//
// Deliberately NOT emitted as JSON-LD. Google treats Review / AggregateRating
// markup on a business's own LocalBusiness or Organization as self-serving and
// ineligible for stars, and ratings copied from another site breach the review
// snippet policy. Showing them as visible, linked text carries no such risk.

export const JUSTDIAL_URL =
  'https://www.justdial.com/Hyderabad/Vijetha-Digitals-Opp-Ntr-Stadium-Indira-Park/040PXX40-XX40-101021152838-U3B2_BZDET';

export const PUBLIC_RATING = {
  source: 'Justdial',
  url: JUSTDIAL_URL,
  value: 4.1,
  count: 73,
  listing: 'our earlier Indira Park listing',
  checked: 'November 2026',
};

export interface CustomerReview {
  /** Verbatim text. Do not edit or tidy it beyond trimming with an ellipsis. */
  quote: string;
  /** Name exactly as shown on the listing. */
  author: string;
  /** Date as shown on the listing. */
  date: string;
  source: 'Justdial' | 'Google';
  /** Link to where a visitor can check this review. */
  url: string;
}

// Add real reviews here. The quote grid appears automatically once this has entries.
export const CUSTOMER_REVIEWS: CustomerReview[] = [];
