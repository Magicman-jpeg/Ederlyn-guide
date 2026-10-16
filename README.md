# Ederlyn H. Caparas — Portfolio

A minimalist, editorial personal portfolio built by hand with **vanilla HTML5,
CSS3, and JavaScript** — no framework, no build step. The only external script
is [anime.js](https://animejs.com/) (loaded from a CDN) for subtle entrance
motion; the site works fully even if it never loads.

## Features

- Semantic, accessible HTML5 (skip link, ARIA labels, `:focus-visible`)
- Responsive layout with CSS Grid & Flexbox (mobile → desktop)
- Persistent **dark / light theme** (`localStorage` + OS preference)
- Tasteful scroll-reveal animations that honor `prefers-reduced-motion`
- Responsive WebP portrait via `<picture>` (no layout shift)
- Design informed by Apple's Human Interface Guidelines and Vercel's Web
  Interface Guidelines (layered shadows, nested radii, hue-tinted borders)

## Files

| Path | Purpose |
| --- | --- |
| `index.html` | Content & structure |
| `styles.css` | Styling, theme tokens, responsive layout, motion |
| `script.js` | Theme toggle, scroll reveals, smooth scroll, dynamic year |
| `assets/` | Portrait images in WebP (640w & 1280w) |
| `scripts/` | **Optional** Node helpers (image conversion, placeholder, screenshots) |
| `CODE_EXPLANATION.txt` | Beginner-friendly, line-by-line walkthrough + deploy guide |

> The images in `assets/` are a generated placeholder. See
> **[`CODE_EXPLANATION.txt`](CODE_EXPLANATION.txt) → Part 5** to drop in the real headshot.

## Run locally

Just open `index.html`, or serve the folder:

```bash
python -m http.server 8000   # then visit http://localhost:8000
```

## Deploy

Static files — host free on **GitHub Pages** or **Vercel**. Step-by-step
instructions are in `CODE_EXPLANATION.txt` (Part 4).

## Optional build helpers

The `scripts/` folder is only needed if you want to regenerate images or
screenshots. Install dev dependencies first:

```bash
npm install
npm run portrait -- raw/ederlyn.jpg ederlyn   # convert a photo to WebP
```
