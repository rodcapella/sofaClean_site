import type { GoogleReviewsData } from '../types';

interface ReviewsContent {
  googleReviews: { url: string; rating: number | null; count: number | null; checkedOn: string };
  testimonials: { quote: string; author: string; rating?: number; date?: string; url?: string }[];
}

/** Preserves the original CustomerReviews layout and all application copy. */
export function withGoogleReviews<T extends ReviewsContent>(content: T, data: GoogleReviewsData, locale = 'pt-PT'): T {
  const formatDate = (value: string) => new Intl.DateTimeFormat(locale, { timeZone: 'Europe/Lisbon' }).format(new Date(value));
  return { ...content,
    googleReviews: { url: data.googleUrl, rating: data.averageRating, count: data.totalReviewCount, checkedOn: formatDate(data.fetchedAt) },
    testimonials: data.reviews.map(review => ({ author: review.author, quote: review.comment, rating: review.rating,
      date: formatDate(review.updateTime), url: data.googleUrl })),
  };
}
