# Editing content

Almost all text on the site lives in two translation files:

- `src/locales/cs/translation.json` (Czech)
- `src/locales/en/translation.json` (English)

Both files must have the **same keys**. If a key is missing in Czech, the English text is shown instead.

## How the language is chosen

`src/i18n.js` checks the browser language when the page loads. If it starts with `cs`, the site opens in Czech. Otherwise it opens in English. Visitors can switch with the EN / CZ buttons in the navbar. The choice is not saved, so a page reload goes back to the browser language.

## Translation file structure

| Key | Used on |
| --- | --- |
| `nav.*` | Navbar link labels and the "Book Now" button |
| `about.title`, `about.subtitle`, `about.description` | Home page welcome text |
| `procedures.title` | Services page heading |
| `procedures.book_button` | Booking button on a service detail page |
| `procedures.<id>.*` | One service (see below) |
| `procedures.view_details` | "View Details" link on each service card |
| `procedures.detail.*` | Detail page labels: section headings, back link, "not found" message |
| `contact.*` | Contact page labels, address, phone, email, hours |
| `footer.rights` | Footer copyright text |
| `reviews.*` | Reviews carousel heading, rating badge and Google link text |

## Services

Each service has an ID (for example `hydration_facial`). The ID is used as the translation key and in the page URL: `/procedures/hydration_facial`.

Current services, in display order:

| ID | English name | Czech name | Price |
| --- | --- | --- | --- |
| `hydration_facial` | Hydration facial | Hydratační ošetření pleti | 1290 Kč |
| `calm_restore_facial` | Calm & Restore Facial | Zklidňující ošetření pleti | 1290 Kč |
| `korean_glow_facial` | Korean glow facial | Korean glow ošetření pleti | 1490 Kč |
| `brow_lamination_tint` | Brow Lamination with Tinting | Laminace obočí s barvením | 890 Kč |
| `brow_lamination` | Brow Lamination | Laminace obočí | 790 Kč |
| `korean_lash_lift` | Korean Lash Lift | Korejský lifting řas | 990 Kč |
| `brow_lamination_tint_lash_lift` | Brow Lamination with Tinting + Lash Lift | Laminace obočí s barvením + Lifting řas | 1590 Kč |

Each service entry has these fields:

```json
"hydration_facial": {
  "title": "Hydration facial",
  "description": "Shown on the card and on the detail page.",
  "price": "1290 CZK",
  "pre_care": ["Instruction 1", "Instruction 2"],
  "post_care": ["Instruction 1", "Instruction 2"],
  "contraindications": ["Item 1", "Item 2"]
}
```

`price` is plain text, so write the currency into it. Czech uses `Kč`, English uses `CZK`.

### Change a price or description

Edit the field in **both** translation files.

### Add a service

1. Pick an ID in `snake_case`, for example `lash_lift_tint`.
2. Add an entry with that ID under `procedures` in both translation files, with all six fields.
3. Add the ID to the `procedureList` array in `src/pages/Procedures.jsx`. Its position in the array sets its position on the Services page.

The detail page is created automatically. If an ID has no `title` in the translations, the page shows a "not found" message. A care section (pre-care, post-care, contraindications) is hidden if its list is missing or empty.

### Remove a service

Remove the ID from `procedureList` in `src/pages/Procedures.jsx`, then delete its entries from both translation files.

## Contact details

The address, phone, email and hours are under `contact` in the translation files. Some details also appear in code and must be changed there too:

| Detail | Also found in |
| --- | --- |
| Email | `src/pages/Contact.jsx` (the `mailto:` link) |
| Map location | `src/pages/Contact.jsx` (the Google Maps `iframe` address) |

## External links

These links are written directly in the code:

| Link | Where |
| --- | --- |
| Booking (Reservanto) `https://booking.reservanto.cz/Modal/?id=25208` | `src/components/Navbar.jsx`, `src/pages/About.jsx`, `src/pages/ProcedureDetail.jsx` |
| Instagram `https://www.instagram.com/glowsmetics_prague/` | `src/components/Navbar.jsx` (twice: desktop and mobile menu) |
| Google Maps reviews page | `GOOGLE_MAPS_PLACE_URL` in `src/components/GoogleReviewsCarousel.jsx` |

If the booking link changes, update all three files.

## Page title and favicon

The browser tab title ("Glowsmetics | Facials, Brows & Lashes") and the favicon path are set in `index.html`. The favicon file is `public/icon.svg`.
