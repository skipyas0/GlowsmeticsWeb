# Deployment

The site is live at **https://glowsmetics.cz**. It is a static build hosted on **GitHub Pages** from the `skipyas0/GlowsmeticsWeb` repository. Deployment is automatic via `.github/workflows/deploy.yml`.

## When it deploys

| Trigger | What happens |
| --- | --- |
| Push to `main` (or `master`) | Build and deploy |
| Every day at 04:00 UTC | Fetch new reviews, commit `src/data/reviews.json` if it changed, then build and deploy |
| Manual run from the GitHub Actions tab | Build and deploy |

Only one deployment runs at a time.

## Workflow steps

1. Check out the code and set up Node 20.
2. `npm ci` (falls back to `npm install`).
3. `npm run build`, which:
   - runs `scripts/fetch-reviews.js` to refresh reviews,
   - runs `vite build` to produce `dist/`,
   - copies `dist/index.html` to `dist/404.html`.
4. On the daily scheduled run only: if `reviews.json` changed, commit it as `github-actions[bot]` with the message `chore: update cached Google reviews [skip ci]` and push. `[skip ci]` stops the push from starting another deploy.
5. Upload `dist/` and deploy it to GitHub Pages.

The workflow needs `contents: write` permission so it can commit review updates.

## Secrets

Set these under **Settings → Secrets and variables → Actions** in the GitHub repo:

| Secret | Meaning |
| --- | --- |
| `GOOGLE_MAPS_API_KEY` | Google Places API key. `VITE_GOOGLE_MAPS_API_KEY` also works. |
| `GOOGLE_PLACE_ID` | The salon's Google place ID. `VITE_GOOGLE_PLACE_ID` also works. |

Without them the site still deploys, using the reviews already saved in git.

## Client-side routing on GitHub Pages

GitHub Pages serves plain files, so opening a URL like `/procedures/korean_lash_lift` directly would normally give a 404. The build copies `index.html` to `404.html`. GitHub Pages then serves the app for any unknown path, and React Router shows the right page.

`vite.config.js` uses `base: '/'`, so the site must be served from the root of a domain, not from a subfolder like `username.github.io/GlowsmeticsWeb/`. The `glowsmetics.cz` domain is set in the repository's GitHub Pages settings, not in a `CNAME` file.

## Deploying by hand

```bash
npm run build
npm run preview   # check the result locally
git push          # the workflow deploys main
```

`dist/` is ignored by git; never commit it.

## Pulling before you push

The daily job may have pushed a review update to `main`. Run `git pull` before starting work to avoid conflicts in `src/data/reviews.json`.
