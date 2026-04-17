# Perf cleanup pass summary

- Proved top hot spots: global light/blur layers, Lenis->ScrollTrigger sync, cursor idle RAF/state churn, dense reveal/scrub paths, marquee/logo filters.
- Reduced constant GPU/CPU load: throttled smooth-scroll sync, stopped idle cursor loop, weakened heavy blur/backdrop/filter/light paths, limited backdrop light rendering to home/partners routes.
- Reduced page-level interaction cost: removed magnetic from header nav and partners tabs, softened scrub/parallax intensity, downgraded non-hero long char splits to words.
- Cleanup: removed temporary screenshot/test artifacts, ignored `out/`, `test-results/`, local perf screenshot patterns.
- Validation: `npm run lint`, `npm run build`, `npm run build:pages` passed; static export routes checked for `/`, `/our-partners`, mobile `our-partners`, `/garofalo`.
