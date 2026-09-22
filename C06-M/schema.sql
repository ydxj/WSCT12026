-- Reconstructed schema matching the task description (6 tables).
-- Replace with the ACTUAL schema/data provided by the competition's media/index.html
-- if it differs — the SELECT below only depends on column names, which follow the
-- task text (movie_title, seats, price_per_seat, screening date, booking status).

CREATE TABLE ratings (
  id INT PRIMARY KEY,
  code VARCHAR(10)
);

CREATE TABLE movies (
  id INT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  rating_id INT,
  FOREIGN KEY (rating_id) REFERENCES ratings(id)
);

CREATE TABLE screens (
  id INT PRIMARY KEY,
  name VARCHAR(50)
);

CREATE TABLE customers (
  id INT PRIMARY KEY,
  name VARCHAR(255)
);

CREATE TABLE screenings (
  id INT PRIMARY KEY,
  movie_id INT,
  screen_id INT,
  starts_at DATETIME,
  price_per_seat DECIMAL(6,2),
  FOREIGN KEY (movie_id) REFERENCES movies(id),
  FOREIGN KEY (screen_id) REFERENCES screens(id)
);

CREATE TABLE bookings (
  id INT PRIMARY KEY,
  screening_id INT,
  customer_id INT,
  seats INT,
  status ENUM('completed','cancelled') NOT NULL,
  FOREIGN KEY (screening_id) REFERENCES screenings(id),
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);
