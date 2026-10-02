# Handoff — Invert Digital website

Built 2026-10-02. Approved plan: C:\Users\ashis\.claude\plans\hi-this-project-contains-logical-whisper.md
Design ported from ../Landing Page Performance Marketing (Grow By Search LP): navy/blue/lavender, Roboto + italic Georgia.

## Run locally
powershell -ExecutionPolicy Bypass -File serve.ps1 -Port 8090   → http://localhost:8090/

## Structure
18 pages: index, services/ (index + 10 channel pages), industries, case-studies (6 dialogs, open via #case-<id>), about, contact, privacy, 404. One stylesheet css/site.css, one script js/main.js (no dependencies). sitemap.xml, robots.txt, netlify.toml.
Header/footer are duplicated in every page — edit all pages if nav/contact changes (search "HEADER (shared)").

## Before launch (TODO)
1. Logo: replace assets/images/logo-mark.svg (placeholder) and the "Invert Digital" wordmark text if needed.
2. Email: ashishgupta1350@gmail.com used everywhere — replace with the Invert Gmail/domain email (grep -r ashishgupta1350).
3. Domain: canonical/og/sitemap assume https://invertdigital.in/ — change if different. Add assets/images/og-image.png (1200x630).
4. GTM: uncomment snippet in each <head> and set the container ID. dataLayer events: generate_lead, click_call, click_whatsapp, view_case_study, calculator_use.
5. Confirm RingMoney figures (99 installs / ₹3,000) and site-wide "1,500+ leads", "70% lower CPL", "15 months".
6. Case screenshots: export 1–2 result screenshots per case from the Drive docs into assets/cases/ (blur personal data) and add to dialogs.
7. About photo: done (assets/images/ashish-gupta.jpg, 640x800, ~100 KB).
8. Social links in footer are "#" placeholders (LinkedIn, Instagram).
9. Deploy zip: use System.IO.Compression.ZipFile with "/" entry names; never Compress-Archive. Exclude serve.ps1 and project-notes/.

## Deploy (Git → Netlify)
Repo: https://github.com/ashishgupta1350/InvertDigitalMarketingAgency-Website (branch `main`).
Netlify site is connected via "Import from Git": no build command, publish directory `.`. Every push to `main` deploys.
Git push works from this machine via Git Credential Manager (git at C:\Program Files\Git\cmd, add to PATH per shell).
netlify.toml returns 404 for /project-notes/*, /serve.ps1 and /README.md on the live site.
