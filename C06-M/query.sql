SELECT
  m.title AS movie_title,
  ROUND(SUM(b.seats * s.price_per_seat), 2) AS total_revenue
FROM bookings b
JOIN screenings s ON s.id = b.screening_id
JOIN movies m      ON m.id = s.movie_id
WHERE b.status = 'completed'
  AND s.starts_at >= '2026-03-01'
  AND s.starts_at <  '2026-04-01'
GROUP BY m.id, m.title
HAVING SUM(b.seats * s.price_per_seat) > 500
ORDER BY total_revenue DESC, movie_title ASC;
