# Vijetha Digital storefront: design spec

Applies to customer pages only (`html[data-surface="store"]`). Admin, staff and reception portals keep their own styles.

## Direction
A print shop's proof sheet: real work photography, precise type, hairlines and exact numbers. No promo banners, no clip-art icon rows.

Printo and Vistaprint get these right, so we match them:
- category access straight away
- visible search
- Track Order and Store Locator links
- a business route

We beat them with:
- the real price shown while configuring
- real work instead of stock images
- branch-level local trust
- far less noise

## Tokens (see `tailwind.config.js`)
| Role | Token | Value |
| --- | --- | --- |
| Page | `paper` | #F7F5F0 |
| Panels | `surface` | #FFFFFF |
| Quiet fill | `shade` | #EEEBE4 |
| Hairline | `line` | #DEDAD0 |
| Text | `ink` / `ink-2` / `ink-3` | #14181F / #4A5261 / #667080 |
| Dark bands | `night` | #1A2332 |
| Single accent, purchase actions only | `accent` | #C0392B |
| Status only | `ok` | #1F7A4D |

## Type
Archivo (variable width). Display 700 at 110% width, tight tracking. Body 16/1.6. Prices use tabular numerals. Nothing below 12px.

Scale: display `clamp(2.5rem, 4.5vw, 3.875rem)`, h2 `clamp(1.75rem, 3vw, 2.5rem)`, h3 1.25rem, small 0.875rem.

## Spacing and shape
- Tailwind's default 4px scale. Do not redefine numeric spacing keys.
- Sections `clamp(3.5rem, 7vw, 6.5rem)`; gutters `clamp(1rem, 4vw, 2rem)`; content max 1280px.
- Radius: 8px for controls and images, 4px for chips. No pills.
- Depth comes from lines and fills. Shadows only on floating layers.
- Touch targets at least 44px.

## Signature elements
1. Crop-mark frame on hero work photos (`.vd-crop`).
2. CMYK colour bar (`.vd-colorbar`), used only in the hero and footer.
3. Spec rows: label left, value right, hairline between (`.vd-rows`).
4. Option tiles: selected means a 2px ink border and a tick (`.vd-option`).

Motion: one staggered reveal on load, one slow image scale on hover. Both turn off under `prefers-reduced-motion`.

## Layout rules
- One red button per view. Everything else is ink outline or a text link.
- Vary section rhythm. Do not repeat identical card rows.
- Mobile purchase pages keep price and CTA in a sticky bottom bar.
- Light theme only for now: customers judge print colour on a light proof, and competitors are all light.
