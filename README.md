# Rsquared Holding — website

The one-page website for **Rsquared Holding**, a diversified family business founded in 1981, and its six group companies: Construction, Trade, Development, Investment, Skylight (hotels & resorts) and Egyment (agriculture).

It is a static site: one `index.html` with CSS, JavaScript and images. There is no build step, framework or server code.

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

Upload the whole folder to any static host (cPanel, Netlify, GitHub Pages, S3…). Keep the folder structure as it is; all paths are relative.

---

## Project structure

```
index.html            the whole page
css/
  theme.css           colour tokens for light + dark themes, theme toggle  ← start here
  header.css          navbar, hero, buttons, layout tokens
  focus.css           "Our Focus" + shared section header pattern
  companies.css       the six group-company sections + photo carousel
  about.css           About Us timeline + client logo slider
  team.css            Our Team carousel + credentials dialog
  contact.css         Contact section + footer
  loader.css          page loader
  styles.css, responsive.css, bootstrap.min.css, …   legacy template files (see below)
js/
  theme.js            light/dark theme (loads in <head>)
  loader.js           page loader (loads in <head>)
  header.js           navbar behaviour
  companies.js        Trade brand tabs + photo carousels (also used by Our Team)
  team.js             credentials dialogs
  contact.js          contact form, footer year, back-to-top
  zerif.js, java.js, jquery*, wow.min.js, …           legacy template scripts
images/               photos and logos (see "Editing content")
```

### New design vs. legacy template

The site started from the *Zerif* one-page template. Every visible section has since been redesigned. The new code lives in the files listed above and follows two rules:

- **Everything is prefixed `r2-`** (`.r2-nav`, `.r2-hero`, `.r2-card` …), so it never collides with template classes.
- **All colours come from tokens** in `css/theme.css`. Never hard-code a colour in a component; use or add a token.

The template files (`styles.css`, `responsive.css`, Bootstrap, jQuery plugins, `zerif.js`) are **still loaded**. They no longer style any visible section, but some of their global rules are actively overridden by the new CSS (see [Legacy guards](#legacy-guards)). Removing them is part of the planned full redesign.

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

> Some anchors keep their template names (`#works`, `#pricingtable`, `#features`, `#testimonials`, `#products`) so existing links keep working. If you rename one, update the navbar, the hero sector strip, the footer and the `data-section` attribute on the "Businesses" nav item.

---

## Editing content

All content is plain HTML in `index.html`. Search for the section's comment banner (e.g. `<!-- 02 · TRADE -->`).

**Add a project photo** (Construction / Development / Egyment): copy one `<li>` inside that section's `<ul class="r2-gallery">` and change `src`, `alt` and the caption. Photos are shown at 4:3; 800×600 or larger looks best.

**Add a team member:** copy one `<li>` inside `#team .r2-strip__track`.
- No photo yet? Use `src="images/team/placeholder.svg"` with `class="is-placeholder"` and an empty `alt=""`.
- Photo on a pure white background? Add `class="is-cutout"` so the card colour shows through.
- Credentials: add a `<button class="r2-member__more" data-r2-dialog="r2-dlg-NAME">` in the card and a matching `<dialog id="r2-dlg-NAME">` (copy an existing one at the end of the section).
- Update the count in "Leadership, board and executive team — 9 people."

**Add a client logo:** add an `<li class="r2-logo">` to **both** lists in `#clients .r2-marquee`. The second list is an `aria-hidden` copy that makes the loop seamless. Logos display best around 400×160 px, ideally PNG/SVG.

**Change contact details:** the address, email and phone appear in the contact section, the form's `data-to` attribute, the map card and the footer. Search for `info@ecic.co` / `+20244875070` / `El-Obour`.

**Change colours:** edit the tokens in `css/theme.css` (see [Colour tokens](#colour-tokens)).

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

`js/theme.js` runs in `<head>` before the page paints. It sets `data-theme` only when the visitor has chosen, and always sets `data-theme-effective` (used for the toggle icon and the map hover).

---

## CSS

### Load order

Tokens first, legacy files before the new ones so the new rules win:

```
legacy:  bootstrap.min.css, all.min.css, owl.*.css, jquery.vegas.min.css, animate.min.css,
         assets/icon-fonts/styles.css, pixeden-icons.css, styles.css, responsive.css
new:     theme.css, header.css, focus.css, companies.css, about.css, team.css, contact.css, loader.css
```

### Layout tokens (`header.css`)

| Token | Value | Use |
|---|---|---|
| `--r2-font` | Manrope, system fallbacks | All new text |
| `--r2-container` | `1240px` | Max content width (`.r2-container`) |
| `--r2-gutter` | `clamp(20px, 4vw, 40px)` | Side padding |
| `--r2-nav-h` / `--r2-nav-h-scrolled` | `88px` / `70px` (76/64 on mobile) | Navbar heights, anchor offset |
| `--r2-ease` | `cubic-bezier(.22,.61,.36,1)` | Default easing |

### Colour tokens

Defined in `theme.css`. Components never use raw colours for anything that should change with the theme. Raw `#fff` / `rgba(255,255,255,…)` is only used inside always-dark areas and on top of photos.

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

### Breakpoints and motion

Breakpoints match Bootstrap 5: `1199.98px`, `991.98px` (navbar becomes the mobile menu), `767.98px`, `575.98px`; a few small-phone tweaks use `420px`.

Every animation respects `prefers-reduced-motion: reduce`: hero slides stop, the marquee becomes a static list, the loader fades instead of sliding, and entrance animations are skipped.

### Legacy guards

The template's global rules leak into the new design. These overrides exist only because of them; delete them together with the legacy files:

- `header.css`: `nav ul li a` colour/size overrides, `nav { box-shadow }` reset, hero `.r2-hero__sectors` guards.
- `contact.css`: footer link colour guards, `!important` on form field borders.
- `theme.css`: `html { font-size: 100% }` (responsive.css shrinks it to 90% / 70% / 62.5% on small screens).
- `!important` on `.r2-section-title` font sizes (responsive.css forces `h2 { font-size: 6.5vw !important }` on mobile).

---

## JavaScript

The new scripts are plain JavaScript with no dependencies. Each one is self-contained and does nothing if its section is missing.

### Load order

```
<head>:        theme.js (before paint, avoids a wrong-theme flash), then CSS, then loader.js
end of <body>: legacy (bootstrap, jquery, scrollTo, wow, jquery.nav, knob, owl, vegas, zerif.js, java.js)
               then header.js, companies.js, team.js, contact.js
```

### What each script does

- **`theme.js`**: follows the OS theme by default; `.r2-theme-toggle` switches and saves the choice (`localStorage` `r2-theme`, in-memory fallback if storage is blocked). Updates `<meta name="theme-color">` and the toggle's `aria-label` / `aria-pressed`.
- **`loader.js`**: adds `r2-js r2-loading` to `<html>`, then hides the loader once the DOM, fonts and the **first hero photo** are ready (minimum 1.4 s, 0.4 s on repeat visits; maximum 4 s; CSS fallback at 8 s if JS fails). Adds `r2-ready`, which starts the hero entrance.
- **`header.js`**: `.is-scrolled` after 24 px; mobile menu (Esc / link click closes, body scroll lock); "Businesses" dropdown; highlights the current section's nav link via `IntersectionObserver` and each link's `data-section` (space-separated ids).
- **`companies.js`**:
  - `[data-r2-tabs]` turns stacked panels into ARIA tabs (arrow / Home / End keys).
  - `[data-r2-strip]` carousels get prev/next buttons (`[data-dir]`), a progress bar and mouse drag-to-scroll (touch scrolls natively). A drag never triggers a card button.
- **`team.js`**: `data-r2-dialog="ID"` buttons open `<dialog id="ID">`; closes on `[data-r2-close]`, Esc or backdrop click.
- **`contact.js`**: `[data-r2-contact-form]` validates and opens a pre-filled `mailto:` to the form's `data-to`; `[data-r2-year]` prints the current year; `[data-r2-totop]` scrolls to top.

### Legacy scripts

- **`zerif.js` is still needed**: it runs `new WOW().init()`, which drives the `wow fadeInUp` scroll animations used in the new sections. Keep WOW (or replace it with an `IntersectionObserver`) before removing the legacy files. It also starts the old Vegas background slideshow, which is now hidden behind the redesigned sections.
- `java.js`, `jquery.nav.js`, `jquery.knob.js`, `owl.carousel.min.js`, `jquery.scrollTo.min.js` and Bootstrap JS are not used by the new design.

---

## Contact form

The site has no backend, so **Send message** opens the visitor's email app with a pre-filled message to `info@ecic.co`. To receive messages directly, point the form at a form service (Formspree, Basin, Netlify Forms…) or your own endpoint and replace the `submit` handler in `js/contact.js`.

---

## Known issues / to-do

- `images/focus/10.gif` is **~50 MB** and is not used anywhere. Delete it or keep it out of deployments.
- Several logos are very large files (`images/Navbar logomain1.png` ≈ 580 KB at 6360×8136; `logoDEVLOPMENT-1.png`, `logoINVESTMENT-1.png` ≈ 3150 px). Export small PNG/SVG versions.
- Hero backgrounds (`images/backgrounds/bg1–3.jpg`) are 0.8–1.8 MB each; compress or serve WebP.
- Project photos in `images/portfolio/` are only 400×300; higher-resolution originals would look much sharper.
- Board members Mamdouh El Faki, Ashraf Abd El Aziz and Sarah Abdel Raouf use the placeholder portrait.
- Egyment's acreage is stated differently in older copy (2,000 vs 4,000 acres); the Egyment section currently avoids stating it. Confirm and update.
- Contact email is on the `ecic.co` domain; update if there is a Rsquared address.
- Legacy template CSS/JS is still loaded (see [New design vs. legacy template](#new-design-vs-legacy-template)).
