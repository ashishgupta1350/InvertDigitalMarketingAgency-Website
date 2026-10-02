# Invert Digital — website

Static site (HTML/CSS/JS, no build step) for Invert Digital, a performance marketing agency in Delhi NCR.
Hosted on Netlify with Git deploys: every push to `main` goes live.

- Run locally: `powershell -ExecutionPolicy Bypass -File serve.ps1 -Port 8090` → http://localhost:8090/
- Styles: `css/site.css` · Behaviour: `js/main.js` · Forms: Netlify Forms (`name="audit"`)
- After changing CSS/JS, bump the `?v=` query on the links in every page.
- Notes and launch TODOs: `project-notes/handoff.md`
