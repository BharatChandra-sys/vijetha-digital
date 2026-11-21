// Branch details shown on the site. Keep in step with the LocalBusiness schema
// in app/layout.tsx and the Google Business Profiles: matching name, address and
// phone across all three is what local search relies on.

export interface Branch {
  name: string;
  role: string;
  lines: [string, string];
  mapsQuery: string;
}

export const BRANCHES: Branch[] = [
  {
    name: 'Indira Park',
    role: 'Main branch',
    lines: ['Shop No. 1-2-607/75, 76, Opp NTR Stadium,', 'LIC Colony Rd, Hyderabad 500029'],
    mapsQuery: 'Vijetha Digital, Opp NTR Stadium, LIC Colony Road, Indira Park, Hyderabad 500029',
  },
  {
    name: 'Lakdikapool',
    role: 'City branch',
    lines: ['H No. 11-5-456, Shop No. 5,', 'Sanapride Complex, Hyderabad 500004'],
    mapsQuery: 'Vijetha Digital, Sanapride Complex, Lakdikapool, Hyderabad 500004',
  },
  {
    name: 'Nacharam',
    role: 'Production facility',
    lines: ['42/B, No. 16, IDA,', 'Nacharam, Hyderabad 500076'],
    mapsQuery: 'Vijetha Digital, IDA Nacharam, Hyderabad 500076',
  },
];

export const mapsUrl = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

// Minutes from midnight, IST. Follows the footer, contact page and contact FAQ,
// which all say closed on Sunday. The schema in app/layout.tsx still lists Sunday
// 10:00 to 18:00, so update both once the real hours are confirmed.
const OPEN = 9 * 60;
const CLOSE = 20 * 60;

export const HOURS_LABEL = 'Mon to Sat, 9 AM to 8 PM. Closed on Sunday.';

function formatTime(minutes: number) {
  const h = Math.floor(minutes / 60);
  return `${h > 12 ? h - 12 : h} ${h >= 12 ? 'PM' : 'AM'}`;
}

const DAY_INDEX: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

/** Open/closed status for Hyderabad, whatever timezone the visitor is in. */
export function getOpenStatus(now: Date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h23',
  }).formatToParts(now);

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  const day = DAY_INDEX[get('weekday')] ?? 1;
  const minutes = Number(get('hour')) * 60 + Number(get('minute'));
  const isSunday = day === 0;

  if (!isSunday && minutes >= OPEN && minutes < CLOSE) {
    return { open: true, label: `Open now, until ${formatTime(CLOSE)}` };
  }
  if (!isSunday && minutes < OPEN) {
    return { open: false, label: `Closed, opens today at ${formatTime(OPEN)}` };
  }
  // After closing on Saturday, the next opening is Monday.
  if (day === 6) return { open: false, label: `Closed, opens Monday at ${formatTime(OPEN)}` };
  return { open: false, label: `Closed, opens tomorrow at ${formatTime(OPEN)}` };
}
