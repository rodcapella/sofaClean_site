'use client';
import { useId } from 'react';
import { useGoogleReviews } from './useGoogleReviews';

export interface GoogleReviewsProps {
  endpoint?: string;
  enabled?: boolean;
  title?: string;
  locale?: string;
}

/** A small self-contained widget; use the hook to retain a site's existing layout. */
export function GoogleReviews({ endpoint, enabled, title, locale = 'pt-PT' }: GoogleReviewsProps) {
  const headingId = useId();
  const { data, status } = useGoogleReviews({ endpoint, enabled });
  if (status !== 'ready' || !data) return null;
  const english = locale.startsWith('en');
  const date = (value: string) => new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeZone: 'Europe/Lisbon' }).format(new Date(value));
  return <section className="google-reviews" aria-labelledby={headingId}>
    <header><h2 id={headingId}>{title ?? (english ? 'What our clients say' : 'A opinião dos nossos clientes')}</h2><a href={data.googleUrl} target="_blank" rel="noopener noreferrer">{english ? 'Reviews on Google' : 'Avaliações no Google'}</a>
      {data.averageRating !== null && <p><strong>{data.averageRating.toLocaleString(locale)}/5</strong> · {data.totalReviewCount} {english ? 'reviews' : 'avaliações'}</p>}
    </header>
    {data.totalReviewCount === 0 ? <p>{english ? 'No reviews have been published yet.' : 'Ainda não existem avaliações publicadas.'}</p> :
      <div className="google-reviews__grid">{data.reviews.map(review => <figure key={review.id}>
        <p aria-label={english ? `${review.rating} out of 5 stars` : `${review.rating} em 5 estrelas`}><span aria-hidden="true">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span></p>
        {review.comment && <blockquote>{review.comment}</blockquote>}
        <figcaption><strong>{review.author}</strong><time dateTime={review.updateTime}>{date(review.updateTime)}</time></figcaption>
      </figure>)}</div>}
    <p className="google-reviews__source">{english ? 'Reviews published on Google. Retrieved on' : 'Avaliações publicadas no Google. Consulta em'} {date(data.fetchedAt)}. <a href={data.googleUrl} target="_blank" rel="noopener noreferrer">{english ? 'View all on Google' : 'Ver todas no Google'}</a></p>
  </section>;
}
