USE hotel_booking;

-- Get admin user ID
SET @admin_id = (SELECT id FROM users WHERE email = 'admin@example.com' LIMIT 1);

-- Insert sample regular user
INSERT INTO users (name, email, password, role)
VALUES ('John Doe', 'john@example.com', '$2b$10$mLEI4YcZ3jQF9HVJ1bKL5.Xe7/gKUYXPXgSuX3Qz.gqP4/iQXU4Iq', 'user');

-- Get regular user ID
SET @user_id = (SELECT id FROM users WHERE email = 'john@example.com' LIMIT 1);

-- Insert sample bookings for admin
INSERT INTO bookings (user_id, room_id, check_in, check_out, guests, total_price, status, first_name, last_name, email, phone)
VALUES 
(@admin_id, 1, DATE_SUB(CURDATE(), INTERVAL 30 DAY), DATE_SUB(CURDATE(), INTERVAL 25 DAY), 2, 750.00, 'completed', 'Admin', 'User', 'admin@example.com', '123-456-7890'),
(@admin_id, 2, DATE_ADD(CURDATE(), INTERVAL 10 DAY), DATE_ADD(CURDATE(), INTERVAL 15 DAY), 3, 1250.00, 'confirmed', 'Admin', 'User', 'admin@example.com', '123-456-7890'),
(@admin_id, 3, DATE_SUB(CURDATE(), INTERVAL 15 DAY), DATE_SUB(CURDATE(), INTERVAL 10 DAY), 2, 1750.00, 'cancelled', 'Admin', 'User', 'admin@example.com', '123-456-7890');

-- Insert sample bookings for regular user
INSERT INTO bookings (user_id, room_id, check_in, check_out, guests, total_price, status, first_name, last_name, email, phone)
VALUES 
(@user_id, 4, DATE_SUB(CURDATE(), INTERVAL 20 DAY), DATE_SUB(CURDATE(), INTERVAL 18 DAY), 2, 200.00, 'completed', 'John', 'Doe', 'john@example.com', '987-654-3210'),
(@user_id, 5, DATE_ADD(CURDATE(), INTERVAL 5 DAY), DATE_ADD(CURDATE(), INTERVAL 10 DAY), 4, 2500.00, 'confirmed', 'John', 'Doe', 'john@example.com', '987-654-3210');

-- Insert sample reviews
INSERT INTO reviews (user_id, room_id, rating, comment, status)
VALUES 
(@admin_id, 1, 5, 'Phòng rất tuyệt vời, sạch sẽ và thoải mái. Nhân viên rất thân thiện và hữu ích. Tôi đặc biệt thích tầm nhìn từ cửa sổ và giường rất thoải mái. Sẽ quay lại lần sau!', 'approved'),
(@admin_id, 2, 4, 'Phòng rộng rãi và thoải mái cho gia đình. Tuy nhiên, Wi-Fi hơi chậm. Bếp được trang bị đầy đủ và khu vực sinh hoạt chung rất rộng rãi. Trẻ em thích không gian chơi.', 'approved'),
(@admin_id, 3, 5, 'Phòng sang trọng với tầm nhìn tuyệt vời. Dịch vụ phòng nhanh chóng và hiệu quả. Bồn tắm jacuzzi là một điểm cộng tuyệt vời. Sẽ đề xuất cho bạn bè!', 'pending'),
(@user_id, 4, 3, 'Phòng sạch sẽ nhưng hơi nhỏ. Vị trí tốt, gần các điểm tham quan. Giá cả hợp lý cho những gì bạn nhận được. Nhân viên thân thiện và hữu ích.', 'approved'),
(@user_id, 5, 5, 'Trải nghiệm tuyệt vời! Phòng rộng rãi và sang trọng. Dịch vụ quản gia rất chu đáo. Hồ bơi riêng là điểm nhấn tuyệt vời. Đáng giá với từng đồng tiền bỏ ra!', 'pending');

-- Insert more reviews for better statistics
INSERT INTO reviews (user_id, room_id, rating, comment, status)
VALUES 
(@admin_id, 1, 4, 'Phòng rất thoải mái và sạch sẽ. Nhân viên thân thiện và hữu ích. Vị trí thuận tiện để khám phá thành phố.', 'approved'),
(@user_id, 1, 5, 'Tôi rất thích phòng này! Giường thoải mái, phòng tắm sang trọng, và dịch vụ xuất sắc.', 'approved'),
(@admin_id, 2, 5, 'Phòng suite gia đình tuyệt vời cho kỳ nghỉ của chúng tôi. Rất nhiều không gian và tiện nghi tuyệt vời.', 'approved'),
(@user_id, 2, 4, 'Không gian tuyệt vời cho gia đình. Bếp được trang bị tốt và phòng ngủ rất thoải mái.', 'approved'),
(@admin_id, 3, 4, 'Phòng suite rất sang trọng với tầm nhìn tuyệt vời. Dịch vụ phòng nhanh chóng.', 'approved'),
(@user_id, 3, 5, 'Một trong những phòng khách sạn tốt nhất mà tôi từng ở! Rất sang trọng và thoải mái.', 'approved'),
(@admin_id, 4, 4, 'Phòng tiêu chuẩn tốt với giá cả phải chăng. Sạch sẽ và thoải mái.', 'approved'),
(@user_id, 4, 4, 'Giá trị tốt cho tiền. Phòng nhỏ nhưng có mọi thứ bạn cần.', 'approved'),
(@admin_id, 5, 5, 'Phòng suite tổng thống thực sự xứng đáng với tên gọi. Sang trọng và đẳng cấp.', 'approved'),
(@user_id, 5, 5, 'Trải nghiệm khó quên! Dịch vụ quản gia, hồ bơi riêng, và tiện nghi cao cấp.', 'approved');

-- Create a stored procedure to calculate revenue statistics
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS CalculateRevenueStats()
BEGIN
    -- Calculate total revenue
    SELECT SUM(total_price) INTO @total_revenue FROM bookings WHERE status IN ('completed', 'confirmed');
    
    -- Calculate weekly revenue (last 7 days)
    SELECT SUM(total_price) INTO @weekly_revenue FROM bookings 
    WHERE status IN ('completed', 'confirmed') 
    AND (check_in BETWEEN DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND CURDATE() 
         OR check_out BETWEEN DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND CURDATE());
    
    -- Calculate monthly revenue (last 30 days)
    SELECT SUM(total_price) INTO @monthly_revenue FROM bookings 
    WHERE status IN ('completed', 'confirmed') 
    AND (check_in BETWEEN DATE_SUB(CURDATE(), INTERVAL 30 DAY) AND CURDATE() 
         OR check_out BETWEEN DATE_SUB(CURDATE(), INTERVAL 30 DAY) AND CURDATE());
    
    -- Output the results
    SELECT 
        COALESCE(@total_revenue, 0) AS total_revenue,
        COALESCE(@weekly_revenue, 0) AS weekly_revenue,
        COALESCE(@monthly_revenue, 0) AS monthly_revenue;
END //
DELIMITER ;

-- Create a stored procedure to get room occupancy statistics
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS GetRoomOccupancyStats()
BEGIN
    -- Get total number of rooms
    SELECT COUNT(*) INTO @total_rooms FROM rooms;
    
    -- Get number of occupied rooms (rooms with active bookings today)
    SELECT COUNT(DISTINCT room_id) INTO @occupied_rooms FROM bookings 
    WHERE status = 'confirmed' 
    AND check_in <= CURDATE() AND check_out >= CURDATE();
    
    -- Calculate available rooms
    SET @available_rooms = @total_rooms - @occupied_rooms;
    
    -- Calculate occupancy rate
    SET @occupancy_rate = (@occupied_rooms / @total_rooms) * 100;
    
    -- Output the results
    SELECT 
        @total_rooms AS total_rooms,
        @occupied_rooms AS occupied_rooms,
        @available_rooms AS available_rooms,
        @occupancy_rate AS occupancy_rate;
END //
DELIMITER ;

-- Example of how to call these procedures
-- CALL CalculateRevenueStats();
-- CALL GetRoomOccupancyStats();
