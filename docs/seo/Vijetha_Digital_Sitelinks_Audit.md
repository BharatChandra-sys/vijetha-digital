# **VIJETHA DIGITAL** 

Why Google Sitelinks Aren't Showing — Search Console Audit 

**Domain:** vijethadigital.com  (property: sc-domain:vijethadigital.com) 

**Data window:** 1 Aug 2025 – 20 Aug 2026 (12 months, Google Search Console) 

**Source:** Live GSC data pulled via Porter Metrics · vijetha-digital repo (BharatChandra-sys) · live site crawl **Prepared:** 23 Aug 2026 

## 1. Executive Summary 

Sitelinks are 100% algorithmic — there is no setting, schema, or GSC action that requests them. Google generates them only when it has (a) a clean, unambiguous site hierarchy and (b) enough branded, navigational search demand to justify surfacing sub-pages. The audit found a confirmed failure on both fronts: 

- Host fragmentation: www.vijethadigital.com and vijethadigital.com are both live and both indexed as separate URLs for the same content. GSC shows real impressions split across both — www./about even outranks the canonical /about (36 vs 11 impressions). 

- True legacy orphans: 5+ URLs from the pre-migration site (.php and .html) are still indexed under the www host with content that doesn't exist anywhere in the current site — none are covered by the redirects() array in next.config.ts. 

- Near-zero brand demand: the query "vijetha digitals" generated only 9 impressions and 5 clicks in 12 months. This is the dominant blocker — even a perfectly clean index won't earn sitelinks without a much larger base of people searching your name directly. 

_Fix priority: (1) canonicalize the host, (2) redirect the true orphans, (3) build branded search demand. Steps 1–2 remove the ceiling; step 3 is what actually earns the sitelinks over the following months._ 

## 2. Finding 1 — Host Fragmentation (www vs apex) 

vijethadigital.com is canonical per your own meta tags. But Google is actively crawling and ranking the www host as a distinct set of URLs, with real click activity. This directly undermines the "one coherent hierarchy" signal sitelinks depend on. 

### www.vijethadigital.com — indexed duplicate pages (GSC, 12 mo) 

|**Page**|**Impr.**|**Clicks**|**CTR**|**Avg Pos**|
|---|---|---|---|---|
|https://www.vijethadigital.com/about|36|4|11.1%|3.9|
|https://www.vijethadigital.com/contact.html|13|1|7.7%|5.8|
|https://www.vijethadigital.com/vijetha-digital|9|0|0%|7.6|
|https://www.vijethadigital.com/hyderabad-printing-signage|7|0|0%|18.0|
|https://www.vijethadigital.com/work.html|4|0|0%|6.0|
|https://www.vijethadigital.com/products|3|0|0%|4.0|
|https://www.vijethadigital.com/services.html|1|0|0%|10.0|
|https://www.vijethadigital.com/contact|1|0|0%|9.0|
|https://www.vijethadigital.com/|1|0|0%|4.0|



### Canonical apex equivalents, for comparison 

|**Page**|**Impr.**|**Clicks**|**CTR**|**Avg Pos**|
|---|---|---|---|---|
|https://vijethadigital.com/about|11|1|9.1%|10.9|
|https://vijethadigital.com/vijetha-digital|32|0|0%|6.7|
|https://vijethadigital.com/hyderabad-printing-signage|9|0|0%|4.7|
|https://vijethadigital.com/products|9|0|0%|13.4|
|https://vijethadigital.com/services|19|2|10.5%|13.2|
|https://vijethadigital.com/contact|26|0|0%|8.0|
|https://vijethadigital.com/|129|32|24.8%|3.1|



Note the /about split: the www version has more than 3x the impressions of the canonical version. Google hasn't decided which one is "real" — that indecision is exactly what blocks a confident sitelinks hierarchy. 

## 3. Finding 2 — True Legacy Orphans (Not in next.config.ts) 

These URLs belong to the old pre-migration site. They have no equivalent route in the current Next.js app, and none of them appear in the redirects() array — which currently only redirects speculative future location-based slugs that were never linked to or indexed (e.g. /led-sign-board-kukatpally). 

|**Legacy URL**|**Where indexed**|**Current status**|
|---|---|---|
|.php — display-standees-embossing-<br>printing-manufacturers-hyderabad.php|www host, old catalog page|No current equivalent — old<br>wholesale-signage catalog page|
|.php — clip-on-snap-frames-manufacturers-<br>hyderabad.php|www host, old catalog page|No current equivalent — product line<br>not in current /products taxonomy|
|.html — contact.html|www host, old static page|→ /contact|
|.html — work.html|www host, old static page|→ /projects|
|.html — services.html|www host, old static page|→ /services|



The two .php URLs were confirmed live in Google's index via direct search — one still serves old cookie-banner copy ("Copyright © 2025... we use cookies to analyze website traffic") that matches no page on the current site. 

## 4. Finding 3 — Brand Search Volume Is the Real Ceiling 

This is the finding that matters most. Over the full 12-month GSC window, every query containing your brand name totals: 

|**Query**|**Impr.**|**Clicks**|**CTR**|**Avg Pos**|
|---|---|---|---|---|
|vijetha digitals|9|5|55.6%|2.1|
|vijetha logo|2|0|0%|5.0|



11 branded impressions and 5 clicks in a year. Sitelinks exist to help users navigate a site people are already deliberately searching for by name — Google needs a track record of that behavior before it will build the block. Raghu Digitals showing sitelinks is very likely explained more by their branded search volume and click history than by anything different in their markup. No amount of redirect cleanup substitutes for real people typing "vijetha digital" into Google. 

#### **How to build this (outside the codebase):** 

- Every WhatsApp quote, invoice, and vehicle/signage you produce should carry the exact string "Vijetha Digital" prominently — repeat customers searching by name is the #1 driver of branded query volume. 

- Push Google reviews on the GBP listing — each review interaction is a branded-query touchpoint and also fixes the "Closed" status showing in Image 1's local pack, which is actively costing you local-pack clicks. 

- Get the domain linked from IndiaMART, JustDial, and other listings you're already on, using the exact business name as anchor text. 

- Any print/vehicle branding you do for clients — put the domain and "Vijetha Digital" text on it. You are, literally, a sign company; this is free distribution you're not using yet. 

## 5. Redirect Map — What Actually Needs to Go in next.config.ts 

|**Source**|**Destination**|**Fix location**|
|---|---|---|
|/display-standees-embossing-printing-<br>manufacturers-hyderabad.php|/products?<br>category=Display%20%26%20Exhibition|www host|
|/clip-on-snap-frames-manufacturers-hyderabad.php|/products?category=Signage%20Solutions|www host|
|/contact.html|/contact|www host|
|/work.html|/projects|www host|
|/services.html|/services|www host|
|/products (www)|/products (apex)|host-level<br>canonicalization|
|/ (www root + all paths)|vijethadigital.com equivalent path|host-level 301,<br>not per-path|



The last two rows aren't next.config.ts redirects() entries — they're a host-level 301 (www → apex) configured in Vercel's domain settings (Project → Settings → Domains → set vijethadigital.com as primary, www as redirect). next.config.ts redirects only fire for requests that reach the Next.js app; if www is currently served as its own valid deployment target, Vercel needs the redirect, not the app. 

## 6. Action Plan 

- Vercel dashboard → Domains → confirm www.vijethadigital.com is set to redirect (307/308) to vijethadigital.com, not served as a second valid host. 

- Add the 5 legacy-orphan redirects (php + html) to next.config.ts redirects(), pointing at the destinations in Section 5. 

- GSC → URL Inspection → Request Indexing on each of the 9 www-host URLs in Section 2, after the host redirect is live, so Google recrawls and merges signals into the canonical URL. 

- GSC → Removals → Temporarily remove the 2 dead .php URLs if the redirect doesn't get them dropped within ~2 weeks. 

- Fix the "Closed" status on the Google Business Profile shown in the local pack (Image 1) — separate from organic sitelinks, but it's suppressing local-pack clicks right now. 

- Re-check site:vijethadigital.com and the www-host GSC numbers in 4–6 weeks to confirm the split has collapsed to one host before expecting any sitelinks movement. 

- Sitelinks themselves: no action item. Revisit brand-query volume in GSC monthly — that's the leading indicator, not a settings toggle. 

