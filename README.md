# Ederlyn H. Caparas — Portfolio

A minimalist, editorial personal portfolio built by hand with **vanilla HTML5,
CSS3, and JavaScript** — no framework, no build step, no dependencies to
install. The only external script is [anime.js](https://animejs.com/) (loaded
from a CDN) for subtle entrance motion; the site works fully even if it never
loads.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Content & structure (semantic, accessible markup) |
| `styles.css` | Styling, theme tokens, responsive layout, motion |
| `script.js` | Dark/light theme toggle, scroll reveals, smooth scroll, dynamic year |
| `README.md` | This file |

That's the whole project — four files, single folder, deploy anywhere.

## Features

- Semantic, accessible HTML5 (skip link, ARIA labels, `:focus-visible` rings)
- Responsive layout with CSS Grid & Flexbox (mobile → desktop)
- Persistent **dark / light theme** (`localStorage` + OS preference)
- Tasteful scroll-reveal animations that honor `prefers-reduced-motion`
- Design informed by Apple's Human Interface Guidelines and Vercel's Web
  Interface Guidelines (layered shadows, nested radii, hue-tinted borders)

## Run locally

Just open `index.html` in a browser, or serve the folder:

```bash
python -m http.server 8000   # then visit http://localhost:8000
```

## Add a real photo (optional)

The hero currently shows an inline SVG monogram placeholder ("EC"). To use a
real headshot:

1. Put the image file next to `index.html` (e.g. `ederlyn.jpg`).
2. In `index.html`, find the `<svg class="portrait" ...>...</svg>` block inside
   `<figure class="hero__portrait">` and replace the whole `<svg>` with:

   ```html
   <img src="ederlyn.jpg" alt="Portrait of Ederlyn H. Caparas" />
   ```

The CSS already crops it to a neat 5:6 portrait via `object-fit: cover`.

## Deploy (free)

Static files — host for free on **GitHub Pages** or **Vercel**.

### GitHub Pages
1. Push these files to a GitHub repo.
2. Repo → **Settings → Pages** → Source **"Deploy from a branch"** →
   Branch **`main`**, Folder **`/ (root)`** → Save.
3. Wait ~1 minute; your site goes live at
   `https://YOUR-USERNAME.github.io/REPO-NAME/`.

### Vercel
1. Push to a Git repo, then import it at [vercel.com](https://vercel.com).
2. Framework Preset **"Other"**; leave Build Command and Output Directory empty.
3. **Deploy** — you get a live URL in seconds. Future pushes auto-deploy.
