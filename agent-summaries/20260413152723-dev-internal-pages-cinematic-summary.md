# Dev internal pages cinematic

- Replaced generic routed page shell with route-aware cinematic experiences for `about-us`, `distribution`, `our-partners`, `vacancy`, `contact-us`, including locale routes.
- Added scene adapters over `reports/pages.json` for narrative sections, galleries, partner cards, vacancy actions, and contact embeds without changing source content.
- Switched unstable `dev` from `next dev --turbopack` to `next dev`; ran clean DevSov on `http://localhost:3001`; validated `/`, `/about-us`, `/distribution`, `/our-partners`, `/vacancy`, `/contact-us`, `/hy`, `/hy/about-us`, `/ru/distribution`; captured fresh screenshots.
