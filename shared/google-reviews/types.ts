export interface GoogleReview {
  id: string;
  author: string;
  rating: number;
  comment: string;
  createTime: string;
  updateTime: string;
}

export interface GoogleReviewsData {
  source: 'Google';
  googleUrl: string;
  fetchedAt: string;
  averageRating: number | null;
  totalReviewCount: number;
  reviews: GoogleReview[];
}
