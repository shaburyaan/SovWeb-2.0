Issue: partner logos disappeared in "Our partners" block on main pages.
Cause: lazy images were forced hidden via CSS (`img[loading="lazy"] { opacity: 0; }`) without JS adding `.loaded`.
Action: removed lazy-opacity rules in `index.html`, `ru/index.html`, `hy/index.html`.
Result: logos render again; image files and paths are valid.
