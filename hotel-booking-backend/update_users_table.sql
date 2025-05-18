USE hotel_booking;

-- Modify users table to support first name, last name, and phone
ALTER TABLE users 
DROP COLUMN name,
ADD COLUMN first_name VARCHAR(50) NOT NULL AFTER id,
ADD COLUMN last_name VARCHAR(50) NOT NULL AFTER first_name,
ADD COLUMN phone VARCHAR(20) NULL AFTER email;

-- Update existing admin user
UPDATE users 
SET first_name = 'Admin', 
    last_name = 'User', 
    phone = '123-456-7890' 
WHERE email = 'admin@example.com';

-- Update any other existing users
UPDATE users 
SET first_name = 'John', 
    last_name = 'Doe', 
    phone = '987-654-3210' 
WHERE email = 'john@example.com';
