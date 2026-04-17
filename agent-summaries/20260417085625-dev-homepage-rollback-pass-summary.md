Homepage rollback pass:
- Removed the active homepage fullpage controller path and restored the plain homepage scene flow.
- Stopped home-only backdrop light rendering and disabled home hero zoom to cut constant GPU load.
- Removed home locale hero `accent` overrides so the hero keeps only the seated-people background image.
- Validation: `npm run lint`, `npm run build`, `npm run build:pages`, static `200` checks for `/`, `/our-partners`, `/garofalo`, and fresh rollback screenshots.
