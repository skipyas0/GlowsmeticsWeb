# Google reviews

The home page shows a carousel of the salon's Google Maps reviews. The reviews are fetched at **build time** and saved in `src/data/reviews.json`. The browser never calls Google directly, so no API key is ever sent to visitors.

## How it works

```text
Google Places API ──► scripts/fetch-reviews.js ──► src/data/reviews.json ──► GoogleReviewsCarousel.jsx
                       (runs during npm run build)    (saved in git)            (bundled into the site)
```

1. `npm run build` first runs `scripts/fetch-reviews.js`.
2. The script asks the Google Places API (New) for the salon's details twice, once in Czech and once in English.
3. It keeps only 5-star reviews, cleans the text, and **merges** them into the existing `reviews.json`. Old reviews are kept. The Places API only returns a few recent reviews per request, so merging lets the saved list grow over time.
4. Vite bundles `reviews.json` into the site.

If the API key or place ID is missing, or the request fails, the script keeps the existing `reviews.json` and the build continues. It only fails if there is no `reviews.json` at all.

## Configuration

The script reads these values from environment variables first, then from `.env`, then from `.env.example`:

| Variable | Meaning |
| --- | --- |
| `GOOGLE_MAPS_API_KEY` (older name `VITE_GOOGLE_MAPS_API_KEY` also works) | Google Cloud API key with the Places API (New) enabled |
| `GOOGLE_PLACE_ID` (older name `VITE_GOOGLE_PLACE_ID` also works) | The salon's Google place ID |

For local use, copy `.env.example` to `.env` and fill in the values. `.env` is ignored by git. In GitHub Actions the values come from repository secrets (see [deployment.md](deployment.md)).

The script sends `Referer: https://glowsmetics.cz/` (the live site) with each request. If the API key is restricted by HTTP referrer in Google Cloud, that domain must be allowed.

## `reviews.json` format

```jsonc
{
  "lastUpdated": "ISO date of the last update",
  "displayName": "Place name on Google",
  "rating": 5,
  "userRatingCount": 0,
  "cs": [ /* reviews with Czech text */ ],
  "en": [ /* the same reviews with English text */ ]
}
```

Each review:

| Field | Meaning |
| --- | --- |
| `authorName` | Reviewer's display name |
| `profilePhoto` | Reviewer's Google profile photo URL |
| `rating` | Always `5` |
| `text` | Review text in this list's language |
| `relativeTime` | For example "před týdnem" or "a week ago" |
| `authorUrl` | Reviewer's Google Maps profile |
| `googleMapsUri` | Link to the review itself (can be empty) |
| `publishTime` | ISO date; lists are sorted newest first |
| `original` | `true` if `text` is the reviewer's own words, `false` if translated |
| `originalLang` | Language the review was written in |

When merging, the script treats two reviews as the same if they share the reviewer's Google profile ID, the review link ID, or the reviewer's name (ignoring accents and case).

## How the carousel shows reviews

`src/components/GoogleReviewsCarousel.jsx`:

- On page load, picks **5 random** 5-star reviews that have text.
- The same 5 stay selected when the visitor switches language. They are picked by position in the list, so the `cs` and `en` lists must keep the same order and length.
- Moves to the next review every 6.5 seconds and pauses while the mouse is over it.
- Supports arrow buttons, dots and swiping on phones.
- Shows the reviewer's initials if the profile photo fails to load.
- The header badge shows the average rating (`rating`) and total review count (`userRatingCount`) and links to the Google Maps reviews page.
- If there are no usable reviews, the carousel is hidden.

## Other review scripts

These are manual tools. The build does not run them.

| Script | Purpose |
| --- | --- |
| `scripts/browser-extract-snippet.js` | Paste into the browser console on the salon's Google Maps reviews tab. It collects all loaded 5-star reviews and downloads them as `extracted-reviews.json`. Useful because the API only returns a few reviews. |
| `scripts/import-extracted-reviews.js` | Merges a JSON file of reviews into `reviews.json` for one language: `node scripts/import-extracted-reviews.js extracted-reviews.json cs` |
| `scripts/rebuild-reviews-data.js` | Rewrites `reviews.json` from scratch using a hand-written list of reviews with Czech and English text. It was used once to fill the file with all reviews, since the API only returns a few. **It replaces the whole file**, dropping reviews added since, so it refuses to run unless you pass `--force`. |

The browser snippet depends on Google Maps' internal CSS class names, which change from time to time. If it finds no reviews, the selectors need updating.

After using `import-extracted-reviews.js` on only one language, the `cs` and `en` lists may no longer line up. Keep them in the same order with the same reviews, or the carousel may show different reviews per language.
