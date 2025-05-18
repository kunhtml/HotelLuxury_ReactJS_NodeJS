const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Get all rooms
router.get('/', async (req, res) => {
  try {
    // Get all rooms
    const [rooms] = await pool.query(`
      SELECT r.*, 
        (SELECT AVG(rating) FROM reviews WHERE room_id = r.id AND status = 'approved') as average_rating,
        (SELECT COUNT(*) FROM reviews WHERE room_id = r.id AND status = 'approved') as review_count
      FROM rooms r
    `);
    
    // Get amenities for each room
    for (let room of rooms) {
      const [amenities] = await pool.query('SELECT amenity FROM room_amenities WHERE room_id = ?', [room.id]);
      room.amenities = amenities.map(a => a.amenity);
      
      // Get images for each room
      const [images] = await pool.query('SELECT image_url FROM room_images WHERE room_id = ?', [room.id]);
      room.images = images.map(img => img.image_url);
    }
    
    res.json(rooms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get room by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get room
    const [rooms] = await pool.query(`
      SELECT r.*, 
        (SELECT AVG(rating) FROM reviews WHERE room_id = r.id AND status = 'approved') as average_rating,
        (SELECT COUNT(*) FROM reviews WHERE room_id = r.id AND status = 'approved') as review_count
      FROM rooms r
      WHERE r.id = ?
    `, [id]);
    
    if (rooms.length === 0) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    const room = rooms[0];
    
    // Get amenities
    const [amenities] = await pool.query('SELECT amenity FROM room_amenities WHERE room_id = ?', [id]);
    room.amenities = amenities.map(a => a.amenity);
    
    // Get images
    const [images] = await pool.query('SELECT image_url FROM room_images WHERE room_id = ?', [id]);
    room.images = images.map(img => img.image_url);
    
    res.json(room);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new room (admin only)
router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const { name, description, price, capacity, size, image_url, amenities, images } = req.body;
    
    // Start a transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
      // Insert room
      const [result] = await connection.query(
        'INSERT INTO rooms (name, description, price, capacity, size, image_url) VALUES (?, ?, ?, ?, ?, ?)',
        [name, description, price, capacity, size, image_url]
      );
      
      const roomId = result.insertId;
      
      // Insert amenities
      if (amenities && amenities.length > 0) {
        for (const amenity of amenities) {
          await connection.query(
            'INSERT INTO room_amenities (room_id, amenity) VALUES (?, ?)',
            [roomId, amenity]
          );
        }
      }
      
      // Insert images
      if (images && images.length > 0) {
        for (const img of images) {
          await connection.query(
            'INSERT INTO room_images (room_id, image_url) VALUES (?, ?)',
            [roomId, img]
          );
        }
      }
      
      // Commit the transaction
      await connection.commit();
      
      // Get the created room
      const [rooms] = await pool.query('SELECT * FROM rooms WHERE id = ?', [roomId]);
      const room = rooms[0];
      
      // Get amenities
      const [roomAmenities] = await pool.query('SELECT amenity FROM room_amenities WHERE room_id = ?', [roomId]);
      room.amenities = roomAmenities.map(a => a.amenity);
      
      // Get images
      const [roomImages] = await pool.query('SELECT image_url FROM room_images WHERE room_id = ?', [roomId]);
      room.images = roomImages.map(img => img.image_url);
      
      res.status(201).json(room);
    } catch (error) {
      // Rollback in case of error
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a room (admin only)
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, capacity, size, image_url, amenities, images } = req.body;
    
    // Check if room exists
    const [existingRooms] = await pool.query('SELECT * FROM rooms WHERE id = ?', [id]);
    
    if (existingRooms.length === 0) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    // Start a transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
      // Update room
      await connection.query(
        'UPDATE rooms SET name = ?, description = ?, price = ?, capacity = ?, size = ?, image_url = ? WHERE id = ?',
        [name, description, price, capacity, size, image_url, id]
      );
      
      // Delete existing amenities
      await connection.query('DELETE FROM room_amenities WHERE room_id = ?', [id]);
      
      // Insert new amenities
      if (amenities && amenities.length > 0) {
        for (const amenity of amenities) {
          await connection.query(
            'INSERT INTO room_amenities (room_id, amenity) VALUES (?, ?)',
            [id, amenity]
          );
        }
      }
      
      // Delete existing images
      await connection.query('DELETE FROM room_images WHERE room_id = ?', [id]);
      
      // Insert new images
      if (images && images.length > 0) {
        for (const img of images) {
          await connection.query(
            'INSERT INTO room_images (room_id, image_url) VALUES (?, ?)',
            [id, img]
          );
        }
      }
      
      // Commit the transaction
      await connection.commit();
      
      // Get the updated room
      const [rooms] = await pool.query('SELECT * FROM rooms WHERE id = ?', [id]);
      const room = rooms[0];
      
      // Get amenities
      const [roomAmenities] = await pool.query('SELECT amenity FROM room_amenities WHERE room_id = ?', [id]);
      room.amenities = roomAmenities.map(a => a.amenity);
      
      // Get images
      const [roomImages] = await pool.query('SELECT image_url FROM room_images WHERE room_id = ?', [id]);
      room.images = roomImages.map(img => img.image_url);
      
      res.json(room);
    } catch (error) {
      // Rollback in case of error
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a room (admin only)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if room exists
    const [existingRooms] = await pool.query('SELECT * FROM rooms WHERE id = ?', [id]);
    
    if (existingRooms.length === 0) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    // Delete room (cascade will delete amenities and images)
    await pool.query('DELETE FROM rooms WHERE id = ?', [id]);
    
    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Check room availability
router.post('/check-availability', async (req, res) => {
  try {
    const { roomId, checkIn, checkOut } = req.body;
    
    // Check if room exists
    const [rooms] = await pool.query('SELECT * FROM rooms WHERE id = ?', [roomId]);
    
    if (rooms.length === 0) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    // Check if room is available for the given dates
    const [bookings] = await pool.query(`
      SELECT * FROM bookings 
      WHERE room_id = ? 
      AND status != 'cancelled'
      AND (
        (check_in <= ? AND check_out >= ?) OR
        (check_in <= ? AND check_out >= ?) OR
        (check_in >= ? AND check_out <= ?)
      )
    `, [roomId, checkIn, checkIn, checkOut, checkOut, checkIn, checkOut]);
    
    const isAvailable = bookings.length === 0;
    
    res.json({ available: isAvailable });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Seed sample data (for demo purposes)
router.post('/seed-data', async (req, res) => {
  try {
    // Check if rooms already exist
    const [existingRooms] = await pool.query('SELECT * FROM rooms');
    
    if (existingRooms.length > 0) {
      return res.json({ 
        success: true, 
        message: 'Sample data already exists' 
      });
    }
    
    // Start a transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
      // Insert sample rooms
      await connection.query(`
        INSERT INTO rooms (name, description, price, capacity, size, image_url)
        VALUES 
        ('Deluxe Room', 'A spacious room with a king-size bed, perfect for couples.', 150.00, 2, 30, 'https://example.com/deluxe-room.jpg'),
        ('Family Suite', 'A large suite with two bedrooms, ideal for families.', 250.00, 4, 50, 'https://example.com/family-suite.jpg'),
        ('Executive Suite', 'A luxurious suite with a separate living area and stunning views.', 350.00, 2, 45, 'https://example.com/executive-suite.jpg'),
        ('Standard Room', 'A comfortable room with a queen-size bed.', 100.00, 2, 25, 'https://example.com/standard-room.jpg'),
        ('Presidential Suite', 'Our most luxurious suite with premium amenities and services.', 500.00, 4, 80, 'https://example.com/presidential-suite.jpg')
      `);
      
      // Insert room amenities
      await connection.query(`
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
        (5, 'Butler Service')
      `);
      
      // Insert room images
      await connection.query(`
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
        (5, 'https://example.com/presidential-suite-3.jpg')
      `);
      
      // Commit the transaction
      await connection.commit();
      
      res.json({ 
        success: true, 
        message: 'Sample data created successfully' 
      });
    } catch (error) {
      // Rollback in case of error
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;
