Lag/scroll/partners fix completed.

- Lenis + ScrollTrigger cost reduced; homepage scenes changed to stronger but lighter section handoff.
- Gradient/light layer moved from weak body background to visible local hero/home overlays.
- `Our Partners` cards and partner detail media were compacted; giant/fullscreen image abuse removed.
- Legacy broken media src normalized/fallbacked for clean dev runtime.
- Validated on DevSov `http://localhost:3006` for `/`, `/our-partners`, `/en/gancia`, `/hy`, `/ru`.
- `npm run lint` clean; `npm run build` still hangs before first compile step and needs separate repo-level investigation.
