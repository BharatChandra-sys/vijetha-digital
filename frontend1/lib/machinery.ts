// Machines on the Chengicherla production floor, photographed November 2026.
// `approx: true` means the width is read from the photo, not a spec sheet:
// confirm it from the machine's nameplate, then drop the flag.
// To add a video clip, put a short muted MP4 (5–10 s, under 4 MB) in
// public/videos/ and set `video` — the photo becomes its poster frame.

export type MachineGroup = 'roll' | 'uv' | 'cut';

export interface Machine {
  slug: string;
  name: string;
  maker?: string;
  model?: string;
  process: string;
  group: MachineGroup;
  /** Print width, or the long side of the bed, in millimetres. */
  widthMm: number;
  /** Second bed dimension for flatbeds and cutters. */
  depthMm?: number;
  approx?: boolean;
  image: string;
  imageAlt: string;
  /** Photo orientation, so cards can pick a sensible crop. */
  portrait?: boolean;
  video?: string;
  summary: string;
  makes: string[];
  materials: string[];
}

export const MACHINES: Machine[] = [
  {
    slug: 'solvent-roll-printer-3-2m',
    name: '3.2 m solvent roll printer',
    process: 'Solvent, roll to roll',
    group: 'roll',
    widthMm: 3200,
    approx: true,
    image: '/images/vd/solvent-printer-3-2m.jpg',
    imageAlt: '3.2 metre solvent roll printer printing a run of banners at Vijetha Digital, Chengicherla',
    summary: 'Our widest printer. Hoardings and building banners come off it in one piece, with no joins to hide.',
    makes: ['Hoardings', 'Shop and building banners', 'Stage backdrops', 'Election and event flex'],
    materials: ['Frontlit flex', 'Backlit flex', 'Star flex', 'Vinyl'],
  },
  {
    slug: 'skytek-uv-roll-printer',
    name: 'Skytek UV roll printer',
    maker: 'Skytek',
    process: 'UV-LED, roll to roll',
    group: 'uv',
    widthMm: 3200,
    approx: true,
    image: '/images/vd/skytek-uv-roll-printer.jpg',
    imageAlt: 'Skytek UV roll-to-roll printer with its operator workstation',
    summary: 'UV ink cures the moment it lands, so prints are dry, scratch-resistant and ready to install straight away.',
    makes: ['Backlit signage', 'Wallpaper and wall graphics', 'Indoor display prints', 'Soft signage'],
    materials: ['Backlit film', 'Vinyl', 'Wallpaper', 'Canvas'],
  },
  {
    slug: 'uv-flatbed-printer',
    name: 'UV flatbed printer',
    process: 'UV, direct to board',
    group: 'uv',
    widthMm: 2500,
    depthMm: 1300,
    approx: true,
    image: '/images/vd/uv-flatbed-printer.jpg',
    imageAlt: 'Large UV flatbed printer for printing directly onto rigid boards',
    summary: 'Prints straight onto rigid sheets, so there is no sticker to peel or bubble. Full 8 x 4 ft boards fit on the bed.',
    makes: ['Printed ACP and sunboard signs', 'Acrylic name plates', 'Wayfinding signs', 'Display panels'],
    materials: ['ACP', 'Acrylic', 'Sunboard', 'MDF', 'Glass', 'Wood'],
  },
  {
    slug: 'epson-surecolor-sc-s80670l',
    name: 'Epson SureColor SC-S80670L',
    maker: 'Epson',
    model: 'SC-S80670L',
    process: 'Eco-solvent, roll to roll',
    group: 'roll',
    widthMm: 1626,
    image: '/images/vd/epson-surecolor-s80670l.jpg',
    imageAlt: 'Epson SureColor SC-S80670L eco-solvent printer printing a poster',
    portrait: true,
    summary: 'Our fine-detail printer, for work seen up close where colour and small text matter.',
    makes: ['Vehicle wrap vinyl', 'Indoor posters', 'Canvas prints', 'Stickers and decals'],
    materials: ['Cast and calendered vinyl', 'Canvas', 'Photo paper', 'Backlit film'],
  },
  {
    slug: 'eco-solvent-roll-printer',
    name: 'Eco-solvent roll printer',
    process: 'Eco-solvent, roll to roll',
    group: 'roll',
    widthMm: 1800,
    approx: true,
    image: '/images/vd/eco-solvent-printer.jpg',
    imageAlt: 'Eco-solvent roll printer printing a delivery-brand banner',
    summary: 'The everyday workhorse for vinyl, standees and short runs that need to be ready the same day.',
    makes: ['Roll-up standees', 'Vinyl stickers', 'One-way vision', 'Flags'],
    materials: ['Vinyl', 'One-way vision film', 'Standee media', 'Flag fabric'],
  },
  {
    slug: 'k-tech-1325-cnc-router',
    name: 'K-Tech 1325 HD Pro servo CNC router',
    maker: 'K-Tech',
    model: '1325 HD Pro Servo',
    process: 'CNC routing and engraving',
    group: 'cut',
    widthMm: 2500,
    depthMm: 1300,
    image: '/images/vd/k-tech-1325-cnc-router.jpg',
    imageAlt: 'K-Tech 1325 HD Pro servo CNC router with dust extraction',
    portrait: true,
    summary: 'Takes a full 8 x 4 ft sheet and cuts letters, panels and shapes to the drawing, with servo motors for clean edges.',
    makes: ['3D letters', 'ACP fascia panels', 'LED sign board frames', 'MDF and PVC cut-outs'],
    materials: ['ACP', 'Acrylic', 'MDF', 'PVC foam board', 'Wood'],
  },
  {
    slug: 'marksys-co2-laser-cutter',
    name: 'Marksys CO2 laser cutter',
    maker: 'Marksys',
    process: 'CO2 laser cutting and engraving',
    group: 'cut',
    widthMm: 1300,
    depthMm: 900,
    approx: true,
    image: '/images/vd/marksys-laser-cutter.jpg',
    imageAlt: 'Marksys CO2 laser cutting and engraving machine',
    portrait: true,
    summary: 'Cuts acrylic with polished, flame-finished edges and engraves fine detail no blade can reach.',
    makes: ['Acrylic letters', 'Name plates and awards', 'Engraved signage', 'Packaging inserts'],
    materials: ['Acrylic', 'MDF', 'Wood', 'Leatherette', 'Paper and board'],
  },
];

/** Machines on the site before the photo shoot. Kept so nothing is lost. */
export const OTHER_EQUIPMENT = [
  'HP Latex 570 printer',
  'Roland Soljet EJ-640 printer',
  'Graphtec cutting plotter',
  '4-pillar screen printing press',
  'LED module fabrication bench',
];

export const WIDEST_MM = Math.max(...MACHINES.map((m) => m.widthMm));

export const formatMetres = (mm: number) => `${+(mm / 1000).toFixed(2)} m`;

export const formatFeet = (mm: number) => `${Math.round((mm / 304.8) * 10) / 10} ft`;

export const sizeLabel = (m: Machine) =>
  m.depthMm
    ? `${m.approx ? '≈ ' : ''}${m.widthMm} × ${m.depthMm} mm bed`
    : `${m.approx ? '≈ ' : ''}${formatMetres(m.widthMm)} print width`;
