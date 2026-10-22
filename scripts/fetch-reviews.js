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

async function fetchPlaceReviewsForLang(lang) {
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

  const rawReviews = data.reviews || [];
  const reviews = rawReviews
    .filter((r) => r.rating === 5)
    .map((r) => ({
      authorName: r.authorAttribution?.displayName || 'Anonymous',
      profilePhoto: r.authorAttribution?.photoUri || '',
      rating: r.rating || 5,
      text: r.text?.text || r.originalText?.text || '',
      relativeTime: r.relativePublishTimeDescription || '',
      authorUrl: r.authorAttribution?.uri || '',
      googleMapsUri: r.googleMapsUri || '',
      publishTime: r.publishTime || '',
    }));

  return {
    displayName: data.displayName?.text || 'Glowsmetics',
    rating: data.rating || 5.0,
    userRatingCount: data.userRatingCount || reviews.length,
    reviews,
  };
}

async function main() {
  console.log(`🔍 Fetching 5-star Google reviews for Place ID: ${placeId}...`);

  try {
    const [csData, enData] = await Promise.all([
      fetchPlaceReviewsForLang('cs'),
      fetchPlaceReviewsForLang('en'),
    ]);

    const result = {
      lastUpdated: new Date().toISOString(),
      displayName: csData.displayName || enData.displayName || 'Glowsmetics',
      rating: csData.rating || 5.0,
      userRatingCount: csData.userRatingCount || csData.reviews.length,
      cs: csData.reviews,
      en: enData.reviews,
    };

    const dataDir = path.dirname(outputFile);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    fs.writeFileSync(outputFile, JSON.stringify(result, null, 2), 'utf8');
    console.log(`✅ Successfully saved ${result.cs.length} Czech and ${result.en.length} English 5-star reviews to src/data/reviews.json`);
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
