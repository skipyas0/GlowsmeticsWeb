import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const outputFile = path.join(rootDir, 'src', 'data', 'reviews.json');

function loadEnvFile(fileName) {
  const filePath = path.join(rootDir, fileName);
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, 'utf8');
  const env = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const match = trimmed.match(/^([^=]+)=(.*)$/);
    if (match) {
      env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '');
    }
  }
  return env;
}

const envFile = {
  ...loadEnvFile('.env.example'),
  ...loadEnvFile('.env'),
};

const apiKey =
  process.env.GOOGLE_MAPS_API_KEY ||
  process.env.VITE_GOOGLE_MAPS_API_KEY ||
  envFile.GOOGLE_MAPS_API_KEY ||
  envFile.VITE_GOOGLE_MAPS_API_KEY;

const placeId =
  process.env.GOOGLE_PLACE_ID ||
  process.env.VITE_GOOGLE_PLACE_ID ||
  envFile.GOOGLE_PLACE_ID ||
  envFile.VITE_GOOGLE_PLACE_ID;

if (!apiKey || !placeId) {
  console.error('❌ Error: Missing Google Places API Key or Place ID.');
  if (fs.existsSync(outputFile)) {
    console.log('ℹ️ Existing src/data/reviews.json found, keeping cached reviews.');
    process.exit(0);
  }
  process.exit(1);
}

// Strip form values (Services, Price, Atmosphere, etc.) and trailing ellipsis
function cleanReviewText(rawText) {
  if (!rawText) return '';
  return rawText
    .replace(/(?:Services|Služby|Price|Cena|Atmosphere|Atmosféra|Maintenance|Requested style|Specialties)[\s\S]*$/i, '')
    .replace(/[\s\u2026.]*…\s*$/, '')
    .trim();
}

// Normalize relative time to clean language-specific strings
function normalizeRelativeTime(timeStr, targetLang) {
  if (!timeStr) return '';
  const s = timeStr.toLowerCase().trim();

  if (targetLang === 'cs') {
    if (s.includes('week') || s.includes('týdn')) {
      if (s.includes('2')) return 'před 2 týdny';
      if (s.includes('3')) return 'před 3 týdny';
      if (s.includes('4')) return 'před měsícem';
      return 'před týdnem';
    }
    if (s.includes('month') || s.includes('mesiac') || s.includes('měsíc')) {
      if (s.includes('2')) return 'před 2 měsíci';
      if (s.includes('3')) return 'před 3 měsíci';
      return 'před měsícem';
    }
    if (s.includes('day') || s.includes('dň') || s.includes('dn')) return 'před pár dny';
    return timeStr;
  } else {
    if (s.includes('týdn') || s.includes('week')) {
      if (s.includes('2')) return '2 weeks ago';
      if (s.includes('3')) return '3 weeks ago';
      if (s.includes('4')) return 'a month ago';
      return 'a week ago';
    }
    if (s.includes('měsíc') || s.includes('mesiac') || s.includes('month')) {
      if (s.includes('2')) return '2 months ago';
      if (s.includes('3')) return '3 months ago';
      return 'a month ago';
    }
    return timeStr;
  }
}

// Unique key for deduplication
function getReviewKey(review) {
  if (review.googleMapsUri) return review.googleMapsUri;
  const author = (review.authorName || '').trim().toLowerCase();
  const snippet = (review.text || '').slice(0, 35).trim().toLowerCase();
  return `${author}__${snippet}`;
}

// Merge and accumulate reviews: keeps all existing reviews and adds/updates new ones
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

async function fetchPlaceDetails(lang) {
  const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=${encodeURIComponent(lang)}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': 'displayName,rating,reviews,userRatingCount',
      'Referer': 'https://glowsmetics.cz/',
    },
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`HTTP ${response.status} from Places API: ${errText}`);
  }

  const data = await response.json();
  if (data.error) {
    throw new Error(`Places API Error: ${data.error.message || JSON.stringify(data.error)}`);
  }

  return data;
}

async function main() {
  console.log(`🔍 Fetching 5-star Google reviews for Place ID: ${placeId}...`);

  let existingCache = {
    displayName: 'Glowsmetics | Kosmetika, obočí & řasy',
    rating: 5.0,
    userRatingCount: 26,
    cs: [],
    en: [],
  };

  if (fs.existsSync(outputFile)) {
    try {
      const fileContent = fs.readFileSync(outputFile, 'utf8');
      existingCache = JSON.parse(fileContent);
    } catch {
      console.warn('⚠️ Could not parse existing reviews.json, starting fresh.');
    }
  }

  try {
    const [csData, enData] = await Promise.all([
      fetchPlaceDetails('cs'),
      fetchPlaceDetails('en'),
    ]);

    const rawReviewsCs = (csData.reviews || []).filter((r) => r.rating === 5);
    const rawReviewsEn = (enData.reviews || []).filter((r) => r.rating === 5);

    // Build map of English text by review name/id for cross-referencing
    const enTextByName = new Map();
    for (const r of rawReviewsEn) {
      const id = r.name || r.authorAttribution?.displayName;
      enTextByName.set(id, {
        text: cleanReviewText(r.text?.text || r.originalText?.text || ''),
        relativeTime: normalizeRelativeTime(r.relativePublishTimeDescription, 'en'),
        origLang: (r.originalText?.languageCode || 'cs').toLowerCase(),
      });
    }

    // Process reviews for CS
    const incomingCs = rawReviewsCs.map((r) => {
      const origLang = (r.originalText?.languageCode || 'cs').toLowerCase();
      const isOriginalCs = origLang.startsWith('cs') || origLang.startsWith('sk');
      const text = cleanReviewText(isOriginalCs ? (r.originalText?.text || r.text?.text) : (r.text?.text || r.originalText?.text));

      return {
        authorName: r.authorAttribution?.displayName || 'Anonymous',
        profilePhoto: r.authorAttribution?.photoUri || '',
        rating: 5,
        text,
        relativeTime: normalizeRelativeTime(r.relativePublishTimeDescription, 'cs'),
        authorUrl: r.authorAttribution?.uri || '',
        googleMapsUri: r.googleMapsUri || '',
        publishTime: r.publishTime || '',
        original: isOriginalCs,
        originalLang: origLang,
      };
    });

    // Process reviews for EN
    const incomingEn = rawReviewsEn.map((r) => {
      const origLang = (r.originalText?.languageCode || 'cs').toLowerCase();
      const isOriginalEn = origLang.startsWith('en');
      const text = cleanReviewText(r.text?.text || r.originalText?.text || '');

      return {
        authorName: r.authorAttribution?.displayName || 'Anonymous',
        profilePhoto: r.authorAttribution?.photoUri || '',
        rating: 5,
        text,
        relativeTime: normalizeRelativeTime(r.relativePublishTimeDescription, 'en'),
        authorUrl: r.authorAttribution?.uri || '',
        googleMapsUri: r.googleMapsUri || '',
        publishTime: r.publishTime || '',
        original: isOriginalEn,
        originalLang: origLang,
      };
    });

    const accumulatedCs = mergeReviews(existingCache.cs, incomingCs);
    const accumulatedEn = mergeReviews(existingCache.en, incomingEn);

    const result = {
      lastUpdated: new Date().toISOString(),
      displayName: csData.displayName?.text || existingCache.displayName || 'Glowsmetics',
      rating: csData.rating || existingCache.rating || 5.0,
      userRatingCount: Math.max(
        csData.userRatingCount || 0,
        existingCache.userRatingCount || 0,
        accumulatedCs.length
      ),
      cs: accumulatedCs,
      en: accumulatedEn,
    };

    const dataDir = path.dirname(outputFile);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    fs.writeFileSync(outputFile, JSON.stringify(result, null, 2), 'utf8');

    const addedCs = accumulatedCs.length - (existingCache.cs?.length || 0);
    const addedEn = accumulatedEn.length - (existingCache.en?.length || 0);

    console.log(
      `✅ Review Accumulation Complete: Total stored: ${accumulatedCs.length} Czech, ${accumulatedEn.length} English.` +
      ` (${addedCs > 0 ? `+${addedCs} new Czech` : '0 new Czech'}, ${addedEn > 0 ? `+${addedEn} new English` : '0 new English'})`
    );
  } catch (err) {
    console.error(`⚠️ Failed to fetch fresh reviews from Google: ${err.message}`);
    if (fs.existsSync(outputFile)) {
      console.log('ℹ️ Keeping existing src/data/reviews.json.');
      process.exit(0);
    } else {
      process.exit(1);
    }
  }
}

main();
