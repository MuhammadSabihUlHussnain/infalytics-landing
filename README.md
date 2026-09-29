# Infalytics landing page

The landing page for [Infalytics](mailto:sabih@infalytics.com), the AI analytics firm for broadcasters. Plain HTML, CSS and a little JavaScript, no build step.

## Run it locally

```sh
python -m http.server 4173 --bind 127.0.0.1
```

Then open http://localhost:4173.

## What's here

| Path | What |
|---|---|
| `index.html` | The page |
| `styles.css` | Styles, built on the Infalytics design system tokens (dark theme) |
| `main.js` | Motion: hero sequence, scroll reveals, count-ups, pointer tilt |
| `assets/logo/` | Logo files (lockup, mark, app icon) |
| `assets/fonts/` | IBM Plex Sans and Plex Mono (SIL Open Font License) |
| `assets/vendor/` | GSAP 3.13 and ScrollTrigger, served locally |

## Rules the page follows

- Brand: the Infalytics design system. Marketing pages may use depth and motion; product UI stays flat.
- Content is visible without JavaScript. With reduced motion, a background tab or no JS, the page shows its finished state.
- Chart numbers on the page are illustrative and labeled as such.
- MPB wording: "working with Mississippi Public Broadcasting", never "built with".
