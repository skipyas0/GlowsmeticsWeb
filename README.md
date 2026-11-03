# Glowsmetics website

The website for **Glowsmetics** ([glowsmetics.cz](https://glowsmetics.cz)), a cosmetics salon in Prague (Ve Smečkách 1258/6, Nové Město, near Muzeum). The salon offers Korean lash lifts, brow lamination and tinting, and facials with Korean cosmetics.

The site is in Czech and English. It has four pages:

| Path | Page | What it shows |
| --- | --- | --- |
| `/` | About | Welcome text, buttons to services and booking, Google reviews carousel |
| `/procedures` | Services | A card for each treatment with a short description and price |
| `/procedures/:id` | Service detail | Full description, price, booking button, pre-care, post-care and contraindications |
| `/contact` | Contact | Address, phone, email, opening hours, embedded Google Map |

Every page has a top navbar (logo, page links, EN/CZ switch, Instagram link, "Book Now" button) and a footer.

Bookings go to an external Reservanto page: `https://booking.reservanto.cz/Modal/?id=25208`. The site has no booking logic of its own.

## Tech stack

- [React 19](https://react.dev) + [Vite](https://vite.dev), plain JavaScript (JSX), no TypeScript
- [React Router](https://reactrouter.com) for client-side routing
- [i18next](https://www.i18next.com) / react-i18next for Czech and English text
- [lucide-react](https://lucide.dev) for icons
- Plain CSS (one file per component or page) with shared tokens in `src/index.css`
- [Oxlint](https://oxc.rs) for linting
- Hosted on **GitHub Pages** and deployed by GitHub Actions

## Quick start

Requires Node.js 20 or newer.

```bash
npm install
npm run dev        # local dev server with hot reload
```

Other scripts:

| Command | What it does |
| --- | --- |
| `npm run build` | Refreshes Google reviews, builds to `dist/`, and copies `index.html` to `404.html` |
| `npm run preview` | Serves the built `dist/` folder locally |
| `npm run fetch-reviews` | Refreshes `src/data/reviews.json` from the Google Places API only |
| `npm run lint` | Runs Oxlint |

`npm run build` works without Google API keys. It keeps the reviews already saved in `src/data/reviews.json`. See [docs/reviews.md](docs/reviews.md).

## Project layout

```text
index.html                 HTML shell (page title, favicon)
vite.config.js             Vite config (base path "/")
public/                    Files copied as-is into the build (favicon, icon)
src/
  main.jsx                 Entry point: loads global CSS and i18n, renders <App>
  App.jsx                  Router and page layout (Navbar, routes, Footer)
  i18n.js                  Language setup (picks Czech or English from the browser)
  index.css                Global styles, colors, fonts, buttons, glass effect
  locales/
    cs/translation.json    Czech text (all copy, prices, contact details)
    en/translation.json    English text (same keys as Czech)
  components/
    Navbar.jsx             Top bar, mobile menu, language switch, booking button
    Footer.jsx             Logo and copyright
    ProcedureCard.jsx      One service card on the Services page
    GoogleReviewsCarousel.jsx  Reviews slider on the home page
  pages/
    About.jsx              Home page
    Procedures.jsx         Services list (the order of services is set here)
    ProcedureDetail.jsx    Service detail page
    Contact.jsx            Contact page with map
  data/
    reviews.json           Saved Google reviews (updated by the build)
  assets/                  Logos used by the app
scripts/                   Tools for fetching and importing Google reviews
.github/workflows/deploy.yml   Build and deploy to GitHub Pages
```

The root folder also holds source material that the app does not use directly:

- `about.txt`, `procedures.txt`, `procedure-details.txt`, `info.txt`: the original Czech copy, prices, care instructions and contact details. The text in `src/locales/` was written from these files.
- `logo.svg`, `logo.png`, `logosimple.svg`, `logotext.svg`, `icon.svg`, `icon-uncropped.svg`: logo source files.

## More documentation

- [docs/content.md](docs/content.md): how to change text, prices, services, contact details and links
- [docs/reviews.md](docs/reviews.md): how Google reviews are fetched, saved and shown
- [docs/deployment.md](docs/deployment.md): hosting, the deploy workflow and secrets
- [docs/design.md](docs/design.md): colors, fonts, layout and responsive breakpoints
