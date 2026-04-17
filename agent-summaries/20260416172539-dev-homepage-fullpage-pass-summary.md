Homepage fullpage pass:
- Homepage GPU/RAM load reduced by removing duplicate home light/glow layers, toning down hero/header compositing, and disabling Lenis on locale home routes.
- Added custom fullPage-like homepage controller with section auto-scroll, wheel/key/touch navigation, anchors, bullets, and mobile fallback, avoiding `react-fullpage` integration/license/routing risk.
- Validation: `npm run lint`, `npm run build:pages`, static route `200` checks, and screenshots for `/`, `/#partners`, mobile home, and `/garofalo`.
