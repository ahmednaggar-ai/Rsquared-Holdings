# Rsquared Holding — website

The one-page website for **Rsquared Holding**, a diversified family business founded in 1981, and its six group companies: Construction, Trade, Development, Investment, Skylight (hotels & resorts) and Egyment (agriculture).

It is a static site: one `index.html` with plain CSS, JavaScript and images. There is no build step, no framework and no third-party JavaScript library.

---

## Run it locally

Open `index.html` in a browser. That's enough for almost everything.

To test it the way it behaves online (relative links, the contact form, `localStorage` for the theme), serve the folder with any static server:

```bash
# any one of these, from the project root
npx serve .
python -m http.server 8000
```

An internet connection is needed for the **Manrope** web font and the **Google Maps** embed in the contact section. Without one, the page falls back to a system font and an empty map box.

## Deploy

Upload the whole folder to any static host (cPanel, Netlify, GitHub Pages, S3…). Keep the folder structure as it is; all paths are relative. `favicon.ico` and `site.webmanifest` must stay at the root.

---

## Project structure

```
index.html                 the whole page
favicon.ico                16/32/48 px favicon (browsers request /favicon.ico)
site.webmanifest           name + icons for "Add to home screen"
README.md
assets/
  css/
    theme.css              colour tokens (light + dark) and the theme toggle  ← start here
    base.css               reset, page defaults, scroll-reveal animation
    header.css             layout tokens, navbar, hero, buttons
    focus.css              Our Focus + shared section header pattern
    companies.css          the six company sections + photo carousel
    about.css              About Us timeline + client logo slider
    team.css               Our Team carousel + credentials dialog
    contact.css            Contact section + footer
    loader.css             page loader (the R² mark builds itself)
  js/
    theme.js               light/dark theme (loads in <head>)
    loader.js              page loader (loads in <head>)
    header.js              navbar behaviour
    companies.js           Trade brand tabs + photo carousels (also used by Our Team)
    team.js                credentials dialogs
    contact.js             contact form, footer year, back-to-top
    reveal.js              fade-up animation when sections scroll into view
    counters.js            numbers count up when they scroll into view
  icons/                   favicon PNGs, apple-touch-icon, manifest icons
  images/
    brand/                 logo-mark.png (R² Holding logo), mark.png (R² only, loader)
    hero/                  hero-1..3.jpg (hero background slideshow)
    focus/                 construction, trade, hotels, agriculture
    companies/
      construction/        logo + project-01..12
      trade/               logo + lintec-1..4, optimas-1..4, mb-crusher-1..4
      development/         logo + project-01..08
      investment/          logo
      skylight/            logo + photo-01..12
      egyment/             logo + farm photos
    clients/               one logo per client, named after the client
    team/                  one portrait per person, named after the person + placeholder.svg
```

### Conventions

- **File names** are lowercase with hyphens, no spaces (`ahmed-mokhtar.jpg`, not `ahmed mokhtar.jpeg`).
- **Classes are prefixed `r2-`** (`.r2-nav`, `.r2-hero`, `.r2-card` …).
- **All colours come from tokens** in `assets/css/theme.css`. Never hard-code a colour that should change with the theme; use or add a token.
- **No dependencies.** Every script is plain JavaScript and does nothing if its section is missing.

---

## Page map

| Section | Anchor (`id`) | Nav label | Styles / scripts | Notes |
|---|---|---|---|---|
| Navbar | — | — | `header.css`, `theme.css`, `header.js` | Transparent over the hero, solid after scrolling. Includes the theme toggle. |
| Hero | `#home` | logo | `header.css` | Three background photos cross-fade; sector strip links to each company. |
| Our Focus | `#focus` | Our Focus | `focus.css` | Four sector cards + "Also in our portfolio" capabilities grid. |
| 01 Construction | `#works` | Businesses ▸ | `companies.css` | Project gallery. |
| 02 Trade | `#trade` | Businesses ▸ | `companies.css`, `companies.js` | Brand tabs (Lintec & Linnhoff, Optimas, MB Crusher). |
| 03 Development | `#pricingtable` | Businesses ▸ | `companies.css` | Project gallery, captions below. |
| 04 Investment | `#features` | Businesses ▸ | `companies.css` | Always-dark section, six principles. |
| 05 Hotels & Resorts | `#testimonials` | Businesses ▸ | `companies.css`, `companies.js` | Big numbers + photo carousel. |
| 06 Agriculture | `#products` | Businesses ▸ | `companies.css` | Gallery + "What we grow" tile. |
| About Us | `#aboutus` | About Us | `about.css` | Timeline 1981 → today. |
| Clients | `#clients` | (footer) | `about.css` | Auto-scrolling logo slider. |
| Our Team | `#team` | Team | `team.css`, `team.js`, `companies.js` | Fits one screen; carousel with drag + arrows. |
| Contact | `#contact` | Contact us | `contact.css`, `contact.js` | Contact methods, form, map. |
| Footer | — | — | `contact.css`, `contact.js` | Always dark. |

> Some anchors keep their original names (`#works`, `#pricingtable`, `#features`, `#testimonials`, `#products`) so existing links keep working. If you rename one, update the navbar, the hero sector strip, the footer and the `data-section` attribute on the "Businesses" nav item.

---

## Editing content

All content is plain HTML in `index.html`. Search for the section's comment banner (e.g. `<!-- 02 · TRADE -->`).

**Page title, description and sharing text:** the `<title>`, `<meta name="description">` and `og:*` tags at the top of `index.html`.

**Add a project photo** (Construction / Development / Egyment): put the file in `assets/images/companies/<company>/`, then copy one `<li>` inside that section's `<ul class="r2-gallery">` and change `src`, `alt` and the caption. Photos are shown at 4:3; 800×600 or larger looks best.

**Add a team member:** put the portrait in `assets/images/team/firstname-lastname.jpg`, then copy one `<li>` inside `#team .r2-strip__track`.
- No photo yet? Use `src="assets/images/team/placeholder.svg"` with `class="is-placeholder"` and an empty `alt=""`.
- Photo on a pure white background? Add `class="is-cutout"` so the card colour shows through.
- Credentials: add a `<button class="r2-member__more" data-r2-dialog="r2-dlg-NAME">` in the card and a matching `<dialog id="r2-dlg-NAME">` (copy an existing one at the end of the section).
- Update the count in "Leadership, board and executive team — 9 people."

**Add a client logo:** put the file in `assets/images/clients/client-name.png`, then add an `<li class="r2-logo">` to **both** lists in `#clients .r2-marquee`. The second list is an `aria-hidden` copy that makes the loop seamless. Logos display best around 400×160 px, ideally PNG/SVG.

**Change contact details:** the address, email and phone appear in the contact section, the form's `data-to` attribute, the map card and the footer. Search for `info@ecic.co` / `+20244875070` / `El-Obour`.

**Change colours:** edit the tokens in `assets/css/theme.css` (see [Colour tokens](#colour-tokens)).

**Animate an element in on scroll:** add `data-reveal` (optionally `data-reveal-delay=".1s"`).

**Animated numbers:** wrap the number in `<span data-count="1000">1,000</span>`. Options: `data-count-from` (start value; years use the value − 40), `data-count-suffix` (`+`, `K`), `data-count-group` (adds the thousands comma). Keep the final value as the text so it still shows without JavaScript.

**Animated numbers:** wrap the number in `<span data-count="1000">1,000</span>`. Options: `data-count-from` (start value; years use the value − 40), `data-count-suffix` ("+", "K"), `data-count-group` (adds the thousands comma). Keep the final value as the text so it shows without JS.

---

## Favicon and app icons

The favicon is the R² mark in white on a dark rounded tile, so it reads on both light and dark browser tabs.

| File | Size | Used by |
|---|---|---|
| `favicon.ico` | 16, 32, 48 | All browsers (requested at the site root) |
| `assets/icons/favicon-16.png`, `favicon-32.png`, `favicon-48.png` | — | Browser tabs, bookmarks |
| `assets/icons/apple-touch-icon.png` | 180 | iPhone / iPad home screen (iOS rounds the corners) |
| `assets/icons/icon-192.png`, `icon-512.png` | 192, 512 | Android home screen via `site.webmanifest` (full-bleed, maskable) |

To regenerate them, start from `assets/images/brand/logo-mark.png`: crop to the R² mark (without "HOLDING"), make it white, centre it at ~70% on a `#141414` tile. Use rounded corners for the small favicons and square tiles for the 180/192/512 icons.

---

## Light / dark theme

- By default the site **follows the visitor's operating system** and updates live if it changes.
- The sun/moon button in the navbar switches theme and remembers the choice (`localStorage` key `r2-theme`). Choosing the same theme as the system clears the override.
- The hero, loader, Investment section and footer are dark in both themes by design.
- Company and client logo cards stay white in dark mode because the logo files have white backgrounds.

How it works: `theme.css` defines the light tokens on `:root` and the dark tokens **twice**. Keep both dark blocks identical when you change a value.

```css
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) { /* dark tokens */ }   /* system is dark, no override */
}
:root[data-theme="dark"] { /* dark tokens */ }            /* visitor chose dark */
```

`theme.js` runs in `<head>` before the page paints. It sets `data-theme` only when the visitor has chosen, and always sets `data-theme-effective` (used for the toggle icon and the map hover).

---

## CSS

### Load order

```
theme.css → base.css → header.css → focus.css → companies.css → about.css → team.css → contact.css → loader.css
```

### Layout tokens (`header.css`)

| Token | Value | Use |
|---|---|---|
| `--r2-font` | Manrope, system fallbacks | All text |
| `--r2-container` | `1240px` | Max content width (`.r2-container`) |
| `--r2-gutter` | `clamp(20px, 4vw, 40px)` | Side padding |
| `--r2-nav-h` / `--r2-nav-h-scrolled` | `88px` / `70px` (76/64 on mobile) | Navbar heights, anchor offset |
| `--r2-ease` | `cubic-bezier(.22,.61,.36,1)` | Default easing |

### Colour tokens

Defined in `theme.css`. Raw `#fff` / `rgba(255,255,255,…)` is only used inside always-dark areas and on top of photos.

| Token | Light | Dark | Use |
|---|---|---|---|
| `--r2-accent` | `#e96656` | same | Brand red: eyebrows, links, highlights |
| `--r2-accent-strong` | `#cb4332` | same | Accent hover |
| `--r2-black` | `#141414` | same | Dark text on always-light chips/buttons |
| `--r2-ink` | `#141414` | `#f2efec` | Headings, strong text |
| `--r2-ink-soft` | `#4a4a4a` | `#c9c4bf` | Nav links, secondary strong text |
| `--r2-text-2` | `#666` | `#a8a29d` | Body copy |
| `--r2-text-3` | `#8a8a8a` | `#85807b` | Labels, captions |
| `--r2-paper` | `#fff` | `#0e0e0e` | Page background |
| `--r2-bg-alt` | `#f6f4f1` | `#151413` | Alternate (stone) sections |
| `--r2-surface` | `#fff` | `#1c1b1a` | Cards, panels, inputs |
| `--r2-surface-soft` | `#faf9f8` | `#232221` | Hover tints, input fill |
| `--r2-chip` | `#f3f0ed` | `#2a2826` | Tags |
| `--r2-media` | `#ece8e4` | `#262422` | Behind photos while loading |
| `--r2-line` | `#e6e1dc` | `rgba(255,255,255,.1)` | Borders, dividers |
| `--r2-accent-soft` | `#fbeeec` | accent at 16% | Icon tiles |
| `--r2-solid` / `--r2-on-solid` | `#141414` / `#fff` | `#f2efec` / `#141414` | Inverted buttons |
| `--r2-nav-bg` | white 94% | near-black 86% | Navbar after scrolling |
| `--r2-dark-section` | `#111` | `#070707` | Investment section |

Effect tokens: `--r2-logo-filter`, `--r2-cutout-blend`, `--r2-placeholder-filter`, `--r2-map-filter`, `--r2-select-arrow`.

### Shared building blocks

| Class | File | What it is |
|---|---|---|
| `.r2-container` | header.css | Centered, max 1240px, side gutters |
| `.r2-section` | focus.css | Section padding + font + left alignment |
| `.r2-section-head` | focus.css | Two-column header: title left, lead right |
| `.r2-eyebrow` | focus.css | Small red label with a line ("OUR FOCUS") |
| `.r2-section-title` / `.r2-section-lead` | focus.css | Section heading / intro paragraph |
| `.r2-btn` + `--primary` `--ghost` `--dark` `--nav` | header.css, companies.css | Pill buttons |
| `.r2-company`, `--stone`, `--dark` | companies.css | Company section shell and tones |
| `.r2-stats` | companies.css | Label/value list under an intro |
| `.r2-gallery`, `.r2-tile--overlay`, `.r2-tile--below` | companies.css | Photo grids, caption on / under the image |
| `.r2-strip` (+ `__track`, `__btn`, `__progress`) | companies.css | Horizontal scroll-snap carousel (Skylight, Our Team) |
| `.r2-marquee`, `.r2-logo` | about.css | Infinite logo slider |
| `.r2-dialog` | team.css | Modal built on `<dialog>` |
| `[data-reveal]` | base.css | Fade-up on scroll |

### Breakpoints and motion

Breakpoints: `1199.98px`, `991.98px` (navbar becomes the mobile menu), `767.98px`, `575.98px`; a few small-phone tweaks use `420px`.

Every animation respects `prefers-reduced-motion: reduce`: hero slides stop, the marquee becomes a static list, the loader fades instead of sliding, and scroll reveals are skipped.

---

## JavaScript

### Load order

```
<head>:        theme.js (before paint, avoids a wrong-theme flash), CSS, loader.js
end of <body>: header.js, companies.js, team.js, contact.js, reveal.js, counters.js
```

### What each script does

- **`theme.js`**: follows the OS theme by default; `.r2-theme-toggle` switches and saves the choice (`localStorage` `r2-theme`, in-memory fallback if storage is blocked). Updates `<meta name="theme-color">` and the toggle's `aria-label` / `aria-pressed`.
- **`loader.js`**: adds `r2-js r2-loading` to `<html>`, then hides the loader once the DOM, fonts and the **first hero photo** are ready (minimum 1.4 s, 0.4 s on repeat visits; maximum 4 s; CSS fallback at 8 s if JS fails). Adds `r2-ready`, which starts the hero entrance. The loader animation (bars rise → R is drawn → ² drops in) is pure CSS in `loader.css`; the mark shape is `mark.png` inlined there as a data URI so it also works when the page is opened from disk.
- **`header.js`**: `.is-scrolled` after 24 px; mobile menu (Esc / link click closes, body scroll lock); "Businesses" dropdown; highlights the current section's nav link via `IntersectionObserver` and each link's `data-section` (space-separated ids).
- **`companies.js`**:
  - `[data-r2-tabs]` turns stacked panels into ARIA tabs (arrow / Home / End keys).
  - `[data-r2-strip]` carousels get prev/next buttons (`[data-dir]`), a progress bar and mouse drag-to-scroll (touch scrolls natively). A drag never triggers a card button.
- **`team.js`**: `data-r2-dialog="ID"` buttons open `<dialog id="ID">`; closes on `[data-r2-close]`, Esc or backdrop click.
- **`contact.js`**: `[data-r2-contact-form]` validates and opens a pre-filled `mailto:` to the form's `data-to`; `[data-r2-year]` prints the current year; `[data-r2-totop]` scrolls to top.
- **`reveal.js`**: `[data-reveal]` elements fade up the first time they enter the viewport (`IntersectionObserver`). Without JS or with reduced motion, everything is simply visible.
- **`counters.js`**: `[data-count]` numbers count up (1.8 s, ease-out) the first time they are 60% visible; the final width is locked first so the layout doesn't shift. Skipped with reduced motion.

---

## Contact form

The site has no backend, so **Send message** opens the visitor's email app with a pre-filled message to `info@ecic.co`. To receive messages directly, point the form at a form service (Formspree, Basin, Netlify Forms…) or your own endpoint and replace the `submit` handler in `assets/js/contact.js`.

---

## Known issues / to-do

- Several images are heavier than they need to be: `assets/images/brand/logo-mark.png` (≈ 580 KB, 6360×8136), the Development/Investment logos (≈ 3150 px), and the hero photos (0.8–1.8 MB each). Export smaller versions / WebP.
- Project photos are only 400×300; higher-resolution originals would look much sharper.
- Board members Mamdouh El Faki, Ashraf Abd El Aziz and Sarah Abdel Raouf use the placeholder portrait.
- Egyment's acreage appears as both 2,000 and 4,000 acres in older copy; the Egyment section currently avoids stating it. Confirm and update.
- Contact email is on the `ecic.co` domain; update if there is a Rsquared address.
- No `og:image` yet: add a 1200×630 social preview image and an `og:url` once the final domain is known.
