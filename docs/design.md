# Design and styling

The site uses plain CSS. Each component and page has its own `.css` file next to it. Shared styles are in `src/index.css`.

## Colors and fonts

Defined as CSS variables in `src/index.css`:

| Variable | Value | Use |
| --- | --- | --- |
| `--color-bg` | `#ffffff` | Page background |
| `--color-surface` | `#fafafa` | Cards and panels |
| `--color-surface-hover` | `#f5f5f5` | Hover background |
| `--color-text` | `#111111` | Main text |
| `--color-text-muted` | `#555555` | Secondary text, icons |
| `--color-gold` | `#c5a059` | Brand accent, primary buttons |
| `--color-gold-hover` | `#b08d4a` | Primary button hover |

Font: **Inter** (weights 300–600), loaded from Google Fonts at the top of `src/index.css`.

## Shared classes

| Class | What it does |
| --- | --- |
| `.container` | Centers content, max width 1200px |
| `.glass` | Frosted see-through white background with blur |
| `.btn` | Base button: uppercase, small letter spacing |
| `.btn-primary` | Gold filled button (used for booking) |
| `.btn-outline` | Outlined button |
| `.animate-fade-in` | Fade-in animation when a page opens |
| `.desktop-only` / `.mobile-only` | Show an element only on large or small screens |

## Responsive layout

Main breakpoints used across the CSS files:

| Width | Changes |
| --- | --- |
| ≤ 900px | Navbar switches to the mobile menu (hamburger button); contact and service grids get fewer columns |
| ≤ 768px | Smaller hero text and reviews carousel layout |
| ≤ 600px / 520px | Single-column grids, compact carousel |

On mobile, the language switch and Instagram icon move into the slide-out menu. The "Book Now" button stays visible in the top bar.

## Logos and icons

| File | Use |
| --- | --- |
| `src/assets/logosimple.svg` | Logo in the navbar and footer |
| `public/icon.svg` | Favicon |
| Root `logo.*`, `logotext.svg`, `icon*.svg` | Source files, not used by the app directly |

Icons in the UI come from `lucide-react`. The Instagram, menu and close icons in the navbar and the Google "G" logo in the reviews carousel are inline SVGs.

