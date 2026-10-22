import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, Quote, ExternalLink } from 'lucide-react';
import cachedReviews from '../data/reviews.json';
import './GoogleReviewsCarousel.css';

// Google Colored "G" Icon
const GoogleIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Google">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
  </svg>
);

// 5 Gold Stars Component
const FiveStars = () => (
  <div className="review-stars" aria-label="5 out of 5 stars">
    {[...Array(5)].map((_, i) => (
      <svg
        key={i}
        className="star-icon"
        viewBox="0 0 20 20"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

// Direct link to Glowsmetics Reviews tab on Google Maps
const GOOGLE_MAPS_PLACE_URL = 'https://www.google.com/maps/place/Glowsmetics/@50.0777994,14.4266736,17z/data=!4m8!3m7!1s0x470b9532fbe640c7:0x374423533b5360c!8m2!3d50.0777994!4d14.4266736!9m1!1b1';

const GoogleReviewsCarousel = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language?.startsWith('cs') ? 'cs' : 'en';

  // 1. On page load, select 5 random 5-star reviews with non-empty text.
  // Storing indices ensures the SAME 5 reviews stay selected when toggling between CS and EN!
  const [selectedIndices] = useState(() => {
    const pool = cachedReviews.cs || [];
    const validIndices = [];

    for (let i = 0; i < pool.length; i++) {
      const r = pool[i];
      if (r && r.rating === 5 && r.text && r.text.trim().length > 0) {
        validIndices.push(i);
      }
    }

    // Shuffle using Fisher-Yates
    for (let i = validIndices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [validIndices[i], validIndices[j]] = [validIndices[j], validIndices[i]];
    }

    return validIndices.slice(0, 5);
  });

  const allReviewsForLang = cachedReviews[currentLang] || cachedReviews.cs || [];
  const reviews = selectedIndices
    .map((idx) => allReviewsForLang[idx])
    .filter((r) => r && r.rating === 5 && r.text && r.text.trim().length > 0);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

  // Reset index if out of bounds
  useEffect(() => {
    if (currentIndex >= reviews.length) {
      setCurrentIndex(0);
    }
  }, [reviews.length, currentIndex]);

  const nextSlide = useCallback(() => {
    if (reviews.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  }, [reviews.length]);

  const prevSlide = useCallback(() => {
    if (reviews.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  }, [reviews.length]);

  // Auto-advance rotation every 6.5s (pauses on hover)
  useEffect(() => {
    if (isPaused || reviews.length <= 1) return;
    const timer = setInterval(nextSlide, 6500);
    return () => clearInterval(timer);
  }, [isPaused, reviews.length, nextSlide]);

  // Touch Swipe Handlers for mobile
  const handleTouchStart = (e) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (diff > 45) {
      nextSlide();
    } else if (diff < -45) {
      prevSlide();
    }
    setTouchStartX(null);
  };

  const handleImageError = (key) => {
    setImageErrors((prev) => ({ ...prev, [key]: true }));
  };

  const currentReview = reviews[currentIndex] || reviews[0];

  const getInitials = (name) => {
    if (!name) return 'G';
    return name
      .split(' ')
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  if (!reviews || reviews.length === 0) return null;

  // Link strictly to the review on the salon profile or to the salon reviews page (never to reviewer profile)
  const reviewLink =
    (currentReview?.googleMapsUri && currentReview.googleMapsUri.trim()) ||
    GOOGLE_MAPS_PLACE_URL;

  return (
    <section className="reviews-carousel-section" aria-label="Customer Reviews">
      <div className="reviews-header">
        <h2 className="reviews-heading">{t('reviews.heading')}</h2>
        <div className="reviews-badge">
          <GoogleIcon size={18} />
          <span className="reviews-badge-text">
            5.0 ★ ({totalReviewsCount} {currentLang === 'cs' ? 'recenzí na Google' : 'Google reviews'})
          </span>
        </div>
      </div>

      <div
        className="carousel-container"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <button
          className="carousel-nav-btn prev-btn"
          onClick={prevSlide}
          aria-label="Previous review"
        >
          <ChevronLeft size={22} />
        </button>

        <div className="review-card-wrapper">
          <div className="review-card glass" key={`${currentLang}-${currentIndex}`}>
            <div className="review-card-top">
              <div className="reviewer-info">
                {currentReview.profilePhoto && !imageErrors[`${currentLang}-${currentIndex}`] ? (
                  <img
                    src={currentReview.profilePhoto}
                    alt={currentReview.authorName}
                    className="reviewer-avatar"
                    onError={() => handleImageError(`${currentLang}-${currentIndex}`)}
                    loading="lazy"
                  />
                ) : (
                  <div className="reviewer-avatar-placeholder">
                    {getInitials(currentReview.authorName)}
                  </div>
                )}
                <div className="reviewer-meta">
                  <div className="reviewer-name-row">
                    <h3 className="reviewer-name">{currentReview.authorName}</h3>
                    <div className="google-icon-pill" title={t('reviews.verified_review')}>
                      <GoogleIcon size={14} />
                    </div>
                  </div>
                  {currentReview.relativeTime && (
                    <span className="review-time">{currentReview.relativeTime}</span>
                  )}
                </div>
              </div>

              <div className="review-rating-box">
                <FiveStars />
              </div>
            </div>

            <div className="review-body">
              <Quote className="review-quote-icon" size={28} />
              <p className="review-text">"{currentReview.text}"</p>
            </div>
          </div>
        </div>

        <button
          className="carousel-nav-btn next-btn"
          onClick={nextSlide}
          aria-label="Next review"
        >
          <ChevronRight size={22} />
        </button>
      </div>

      {/* Pagination dots & Google Maps link */}
      <div className="carousel-footer">
        <div className="carousel-dots">
          {reviews.map((_, index) => (
            <button
              key={index}
              className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to review ${index + 1}`}
            />
          ))}
        </div>

        <a
          href={reviewLink}
          target="_blank"
          rel="noopener noreferrer"
          className="google-maps-link"
        >
          <GoogleIcon size={16} />
          <span>{t('reviews.view_on_google')}</span>
          <ExternalLink size={13} className="external-icon" />
        </a>
      </div>
    </section>
  );
};

export default GoogleReviewsCarousel;
