-- Create database
CREATE DATABASE IF NOT EXISTS hotel_luxury;
USE hotel_luxury;

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
  is_occupied BOOLEAN DEFAULT FALSE,
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
('Deluxe Room', 'Phòng rộng rãi với giường cỡ king, hoàn hảo cho các cặp đôi.', 150.00, 2, 30, 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1000&auto=format&fit=crop'),
('Family Suite', 'Phòng suite lớn với hai phòng ngủ, lý tưởng cho gia đình.', 250.00, 4, 50, 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1000&auto=format&fit=crop'),
('Executive Suite', 'Phòng suite sang trọng với khu vực sinh hoạt riêng biệt và tầm nhìn tuyệt đẹp.', 350.00, 2, 45, 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1000&auto=format&fit=crop'),
('Standard Room', 'Phòng thoải mái với giường cỡ queen.', 100.00, 2, 25, 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1000&auto=format&fit=crop'),
('Presidential Suite', 'Phòng suite sang trọng nhất của chúng tôi với tiện nghi và dịch vụ cao cấp.', 500.00, 4, 80, 'https://images.unsplash.com/photo-1591088398332-8a7791972843?q=80&w=1000&auto=format&fit=crop');

-- Insert room amenities
INSERT INTO room_amenities (room_id, amenity)
VALUES 
(1, 'Wi-Fi miễn phí'),
(1, 'Điều hòa'),
(1, 'TV màn hình phẳng'),
(1, 'Mini Bar'),
(2, 'Wi-Fi miễn phí'),
(2, 'Điều hòa'),
(2, 'TV màn hình phẳng'),
(2, 'Bếp'),
(2, 'Ban công'),
(3, 'Wi-Fi miễn phí'),
(3, 'Điều hòa'),
(3, 'TV màn hình phẳng'),
(3, 'Mini Bar'),
(3, 'Bồn tắm sục'),
(4, 'Wi-Fi miễn phí'),
(4, 'Điều hòa'),
(4, 'TV màn hình phẳng'),
(5, 'Wi-Fi miễn phí'),
(5, 'Điều hòa'),
(5, 'TV màn hình phẳng'),
(5, 'Mini Bar'),
(5, 'Bồn tắm sục'),
(5, 'Hồ bơi riêng'),
(5, 'Dịch vụ quản gia');

-- Insert room images
INSERT INTO room_images (room_id, image_url)
VALUES 
(1, 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1000&auto=format&fit=crop'),
(1, 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1000&auto=format&fit=crop'),
(1, 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1000&auto=format&fit=crop'),
(2, 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1000&auto=format&fit=crop'),
(2, 'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=1000&auto=format&fit=crop'),
(2, 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?q=80&w=1000&auto=format&fit=crop'),
(3, 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1000&auto=format&fit=crop'),
(3, 'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?q=80&w=1000&auto=format&fit=crop'),
(3, 'https://images.unsplash.com/photo-1560448075-bb485b067938?q=80&w=1000&auto=format&fit=crop'),
(4, 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1000&auto=format&fit=crop'),
(4, 'https://images.unsplash.com/photo-1505693314120-0d443867891c?q=80&w=1000&auto=format&fit=crop'),
(5, 'https://images.unsplash.com/photo-1591088398332-8a7791972843?q=80&w=1000&auto=format&fit=crop'),
(5, 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1000&auto=format&fit=crop'),
(5, 'https://images.unsplash.com/photo-1590490359683-658d3d23f972?q=80&w=1000&auto=format&fit=crop');

-- Insert sample bookings
INSERT INTO bookings (user_id, room_id, check_in, check_out, guests, total_price, status, first_name, last_name, email, phone)
VALUES
(1, 1, DATE_ADD(CURDATE(), INTERVAL 5 DAY), DATE_ADD(CURDATE(), INTERVAL 10 DAY), 2, 750.00, 'confirmed', 'Nguyễn', 'Văn A', 'nguyenvana@example.com', '0901234567'),
(1, 3, DATE_ADD(CURDATE(), INTERVAL 15 DAY), DATE_ADD(CURDATE(), INTERVAL 20 DAY), 2, 1750.00, 'pending', 'Nguyễn', 'Văn A', 'nguyenvana@example.com', '0901234567');

-- Insert sample reviews
INSERT INTO reviews (user_id, room_id, rating, comment, status)
VALUES
(1, 1, 5, 'Phòng rất tuyệt vời, sạch sẽ và thoải mái. Nhân viên rất thân thiện và hữu ích.', 'approved'),
(1, 2, 4, 'Phòng rộng rãi và thoải mái cho gia đình. Tuy nhiên, Wi-Fi hơi chậm.', 'approved'),
(1, 3, 5, 'Phòng sang trọng với tầm nhìn tuyệt vời. Dịch vụ phòng nhanh chóng và hiệu quả.', 'pending');
