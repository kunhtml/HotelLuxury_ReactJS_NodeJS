-- Create database
CREATE DATABASE IF NOT EXISTS hotel_booking;
USE hotel_booking;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  capacity INT NOT NULL,
  size INT NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create room_amenities table
CREATE TABLE IF NOT EXISTS room_amenities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  room_id INT NOT NULL,
  amenity VARCHAR(100) NOT NULL,
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);

-- Create room_images table
CREATE TABLE IF NOT EXISTS room_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  room_id INT NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  room_id INT NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests INT NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  room_id INT NOT NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT NOT NULL,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);

-- Insert admin user
INSERT INTO users (name, email, password, role)
VALUES ('Admin User', 'admin@example.com', '$2b$10$mLEI4YcZ3jQF9HVJ1bKL5.Xe7/gKUYXPXgSuX3Qz.gqP4/iQXU4Iq', 'admin');
-- Password: admin123

-- Insert sample rooms
INSERT INTO rooms (name, description, price, capacity, size, image_url)
VALUES 
('Deluxe Room', 'A spacious room with a king-size bed, perfect for couples.', 150.00, 2, 30, 'https://example.com/deluxe-room.jpg'),
('Family Suite', 'A large suite with two bedrooms, ideal for families.', 250.00, 4, 50, 'https://example.com/family-suite.jpg'),
('Executive Suite', 'A luxurious suite with a separate living area and stunning views.', 350.00, 2, 45, 'https://example.com/executive-suite.jpg'),
('Standard Room', 'A comfortable room with a queen-size bed.', 100.00, 2, 25, 'https://example.com/standard-room.jpg'),
('Presidential Suite', 'Our most luxurious suite with premium amenities and services.', 500.00, 4, 80, 'https://example.com/presidential-suite.jpg');

-- Insert room amenities
INSERT INTO room_amenities (room_id, amenity)
VALUES 
(1, 'Free Wi-Fi'),
(1, 'Air Conditioning'),
(1, 'Flat-screen TV'),
(1, 'Mini Bar'),
(2, 'Free Wi-Fi'),
(2, 'Air Conditioning'),
(2, 'Flat-screen TV'),
(2, 'Kitchen'),
(2, 'Balcony'),
(3, 'Free Wi-Fi'),
(3, 'Air Conditioning'),
(3, 'Flat-screen TV'),
(3, 'Mini Bar'),
(3, 'Jacuzzi'),
(4, 'Free Wi-Fi'),
(4, 'Air Conditioning'),
(4, 'Flat-screen TV'),
(5, 'Free Wi-Fi'),
(5, 'Air Conditioning'),
(5, 'Flat-screen TV'),
(5, 'Mini Bar'),
(5, 'Jacuzzi'),
(5, 'Private Pool'),
(5, 'Butler Service');

-- Insert room images
INSERT INTO room_images (room_id, image_url)
VALUES 
(1, 'https://example.com/deluxe-room-1.jpg'),
(1, 'https://example.com/deluxe-room-2.jpg'),
(1, 'https://example.com/deluxe-room-3.jpg'),
(2, 'https://example.com/family-suite-1.jpg'),
(2, 'https://example.com/family-suite-2.jpg'),
(2, 'https://example.com/family-suite-3.jpg'),
(3, 'https://example.com/executive-suite-1.jpg'),
(3, 'https://example.com/executive-suite-2.jpg'),
(3, 'https://example.com/executive-suite-3.jpg'),
(4, 'https://example.com/standard-room-1.jpg'),
(4, 'https://example.com/standard-room-2.jpg'),
(5, 'https://example.com/presidential-suite-1.jpg'),
(5, 'https://example.com/presidential-suite-2.jpg'),
(5, 'https://example.com/presidential-suite-3.jpg');
