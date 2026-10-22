import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const outputFile = path.join(rootDir, 'src', 'data', 'reviews.json');

// Unique key for deduplication
function getReviewKey(review) {
  if (review.googleMapsUri) return review.googleMapsUri;
  const author = (review.authorName || '').trim().toLowerCase();
  const snippet = (review.text || '').slice(0, 35).trim().toLowerCase();
  return `${author}__${snippet}`;
}

function mergeReviews(existingList = [], incomingList = []) {
  const map = new Map();
  for (const rev of existingList) {
    if (rev && rev.authorName) {
      map.set(getReviewKey(rev), rev);
    }
  }
  for (const rev of incomingList) {
    if (rev && rev.authorName) {
      const key = getReviewKey(rev);
      const existing = map.get(key);
      if (existing) {
        map.set(key, { ...existing, ...rev });
      } else {
        map.set(key, rev);
      }
    }
  }
  const merged = Array.from(map.values());
  merged.sort((a, b) => {
    if (a.publishTime && b.publishTime) {
      return new Date(b.publishTime) - new Date(a.publishTime);
    }
    return 0;
  });
  return merged;
}

export function importReviews(newReviewsArray, lang = 'cs') {
  if (!Array.isArray(newReviewsArray) || newReviewsArray.length === 0) {
    console.error('❌ Error: Expected a non-empty array of reviews.');
    return;
  }

  let existingCache = {
    displayName: 'Glowsmetics | Kosmetika, obočí & řasy',
    rating: 5.0,
    userRatingCount: 26,
    cs: [],
    en: [],
  };

  if (fs.existsSync(outputFile)) {
    try {
      existingCache = JSON.parse(fs.readFileSync(outputFile, 'utf8'));
    } catch {
      console.warn('⚠️ Starting fresh cache.');
    }
  }

  // Filter 5-star reviews only
  const fiveStarOnly = newReviewsArray.filter((r) => !r.rating || r.rating === 5);

  const prevCount = existingCache[lang]?.length || 0;
  existingCache[lang] = mergeReviews(existingCache[lang], fiveStarOnly);
  const newCount = existingCache[lang].length;

  existingCache.userRatingCount = Math.max(existingCache.userRatingCount || 0, newCount);
  existingCache.lastUpdated = new Date().toISOString();

  fs.writeFileSync(outputFile, JSON.stringify(existingCache, null, 2), 'utf8');
  console.log(`✅ Successfully imported reviews!`);
  console.log(`Language [${lang}]: Stored ${newCount} reviews (+${newCount - prevCount} new).`);
}

// If run from CLI: node scripts/import-extracted-reviews.js <path-to-json-file> [lang]
const args = process.argv.slice(2);
if (args.length > 0) {
  const filePath = path.resolve(process.cwd(), args[0]);
  const lang = args[1] || 'cs';
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    importReviews(Array.isArray(data) ? data : data.reviews || [], lang);
  } else {
    console.error(`❌ File not found: ${filePath}`);
  }
}
