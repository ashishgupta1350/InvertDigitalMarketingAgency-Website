# Build brief for page agents — Invert Digital website

Site root: C:\Users\ashis\Downloads\invert-digital-website\
Approved plan (sitemap, case-study facts): C:\Users\ashis\.claude\plans\hi-this-project-contains-logical-whisper.md
Reference page: index.html (READ IT FULLY FIRST). Stylesheet: css/site.css (READ IT — use only existing classes). JS: js/main.js (auto-handles reveal, counters, accordion, filters, dialogs, forms, calculator).

## Hard rules
1. Copy the <head> pattern, HEADER block and FOOTER block (between the "(shared)" comments, including wa-float + mobile-bar) from index.html VERBATIM. Only change <title>, meta description, canonical, og:title/og:description/og:url, and add aria-current="page" to the matching nav link.
2. All links/assets are root-absolute: /css/site.css, /js/main.js, /services/google-ads.html, /contact.html#audit.
3. Use ONLY classes that exist in css/site.css. Do not add new CSS files. If you truly need a tiny tweak, use an inline style sparingly. Do NOT edit site.css, main.js or index.html.
4. Fonts/colours/spacing come from site.css: eyebrow pill -> h1/h2 with an <em> italic accent phrase -> muted sub. Every section uses .section / .section-soft / .section-lavender alternation like Home.
5. Real data only. Case-study numbers must match the plan file exactly (Sood & Sood, Alo Legal, Langma, Aggarwal College, TheSavvyCasa, RingMoney). Never invent stats, clients, testimonials or reviews. Platform facts (what LinkedIn Lead Gen Forms are etc.) are fine as general descriptions, no fabricated benchmarks.
6. Contact: phone +91 99101 40614 (tel:+919910140614), WhatsApp https://wa.me/919910140614, email ashishgupta1350@gmail.com, location 86, D-14, Sector 8, Rohini, Delhi.
7. Every page ends with the CTA band + Netlify form exactly like Home's #audit section (form name="audit", change hidden input name="page" value to the page slug, keep unique element ids per page).
8. Tone: plain, confident, specific, Indian-business friendly; British/Indian spelling (optimise). No hype words ("revolutionary", "skyrocket"). No em-dash overuse.
9. Copy-quality: each page must feel complete and premium — hero, 4–6 content sections, FAQ (4–6 platform-specific Qs), CTA.

## Service page template (services/*.html)
- .page-hero with .page-hero-grid: left = breadcrumb (Home › Services › X), .ch-icon.lg with the channel tint class (t-google, t-meta, t-linkedin, t-youtube, t-reddit, t-snap, t-microsoft, t-app, t-track, t-cro), eyebrow, h1 with <em>, .lead, .btn-row (Free audit + WhatsApp). Right = .hero-facts with 4 .fact tiles (use real case numbers where a case applies; otherwise use service facts like "Weekly" / "search-term reviews", "100%" / "accounts in your name" — no fake performance stats).
- "What's included" .grid-3 of .card (icon-box + h3 + p), 6 cards.
- "Campaign types we run" .split with .check-list and a visual card.
- Relevant case: a .case-grid with 1–2 .case-card linking to /case-studies.html#case-<id> (ids: case-sood, case-alo, case-langma, case-aggarwal, case-savvy, case-ringmoney). If no case exists for that platform, instead show a "Who it's for" .grid-2 and be honest.
- .process (5 steps tailored to the platform).
- FAQ .accordion, then CTA band + form, footer.
