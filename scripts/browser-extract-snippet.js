/**
 * Google Maps Reviews Extractor Snippet
 * 
 * Instructions:
 * 1. Open Glowsmetics on Google Maps in your browser:
 *    https://www.google.com/maps/place/Glowsmetics/@50.0777994,14.4266736,17z/data=!4m8!3m7!1s0x470b9532fbe640c7:0x374423533b5360c!8m2!3d50.0777994!4d14.4266736!9m1!1b1
 * 2. Click on the "Reviews" tab and scroll down until all 26 reviews are loaded in the list.
 * 3. Open Developer Tools (Press F12, or Right Click -> Inspect -> Console tab).
 * 4. Copy and paste the code below into the console and press Enter.
 * 5. It will automatically download 'extracted-reviews.json' and copy the JSON to your clipboard!
 */

(() => {
  // 1. Expand all "More" / "Více" buttons
  document.querySelectorAll('button.w8nwRe, button[aria-label*="Více"], button[aria-label*="More"]').forEach(b => b.click());

  // 2. Extract each review card
  const cards = document.querySelectorAll('.jftiEf, div[data-review-id]');
  const reviews = [];

  cards.forEach(card => {
    const authorEl = card.querySelector('.d4r55, .X5PpBb, [class*="author"]');
    const authorName = authorEl ? authorEl.textContent.trim() : 'Anonymous';

    const textEl = card.querySelector('.wiI7pd, .MyEned');
    const text = textEl ? textEl.textContent.trim() : '';

    const starEl = card.querySelector('.kvMYJc, span[role="img"]');
    const aria = starEl ? (starEl.getAttribute('aria-label') || '') : '';
    const ratingMatch = aria.match(/(\d+)/);
    const rating = ratingMatch ? parseInt(ratingMatch[1], 10) : 5;

    const timeEl = card.querySelector('.rsqaWe');
    const relativeTime = timeEl ? timeEl.textContent.trim() : '';

    const imgEl = card.querySelector('img.NBa7we, img[src*="googleusercontent"]');
    const profilePhoto = imgEl ? imgEl.src : '';

    const linkEl = card.querySelector('a[href*="/maps/contrib/"], button[data-href*="/maps/contrib/"]');
    const authorUrl = linkEl ? (linkEl.href || linkEl.getAttribute('data-href') || '') : '';

    // Only 5-star reviews with text
    if (rating === 5 && text) {
      reviews.push({
        authorName,
        profilePhoto,
        rating: 5,
        text,
        relativeTime,
        authorUrl
      });
    }
  });

  const jsonStr = JSON.stringify(reviews, null, 2);
  console.log(`✅ Extracted ${reviews.length} 5-star reviews!`);

  // Copy to clipboard
  if (typeof copy === 'function') {
    copy(jsonStr);
    console.log('📋 Reviews JSON copied to clipboard!');
  }

  // Download as file
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'extracted-reviews.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  return reviews;
})();
