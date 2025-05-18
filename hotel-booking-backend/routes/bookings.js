const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Get all bookings (admin only)
router.get('/all', verifyToken, isAdmin, async (req, res) => {
  try {
    const [bookings] = await pool.query(`
      SELECT b.*, r.name as room_name, u.name as user_name, u.email as user_email
      FROM bookings b
      JOIN rooms r ON b.room_id = r.id
      JOIN users u ON b.user_id = u.id
      ORDER BY b.created_at DESC
    `);
    
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's bookings
router.get('/', verifyToken, async (req, res) => {
  try {
    const [bookings] = await pool.query(`
      SELECT b.*, r.name as room_name
      FROM bookings b
      JOIN rooms r ON b.room_id = r.id
      WHERE b.user_id = ?
      ORDER BY b.created_at DESC
    `, [req.user.id]);
    
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get booking by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const [bookings] = await pool.query(`
      SELECT b.*, r.name as room_name, r.price as room_price, r.image_url
      FROM bookings b
      JOIN rooms r ON b.room_id = r.id
      WHERE b.id = ?
    `, [id]);
    
    if (bookings.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    const booking = bookings[0];
    
    // Check if the user is authorized to view this booking
    if (booking.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    res.json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new booking
router.post('/', verifyToken, async (req, res) => {
  try {
    const { 
      roomId, 
      checkIn, 
      checkOut, 
      guests, 
      totalPrice,
      firstName,
      lastName,
      email,
      phone
    } = req.body;
    
    // Check if room exists
    const [rooms] = await pool.query('SELECT * FROM rooms WHERE id = ?', [roomId]);
    
    if (rooms.length === 0) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    // Check if room is available for the given dates
    const [existingBookings] = await pool.query(`
      SELECT * FROM bookings 
      WHERE room_id = ? 
      AND status != 'cancelled'
      AND (
        (check_in <= ? AND check_out >= ?) OR
        (check_in <= ? AND check_out >= ?) OR
        (check_in >= ? AND check_out <= ?)
      )
    `, [roomId, checkIn, checkIn, checkOut, checkOut, checkIn, checkOut]);
    
    if (existingBookings.length > 0) {
      return res.status(400).json({ message: 'Room is not available for the selected dates' });
    }
    
    // Create booking
    const [result] = await pool.query(
      `INSERT INTO bookings 
        (user_id, room_id, check_in, check_out, guests, total_price, status, first_name, last_name, email, phone) 
       VALUES (?, ?, ?, ?, ?, ?, 'confirmed', ?, ?, ?, ?)`,
      [req.user.id, roomId, checkIn, checkOut, guests, totalPrice, firstName, lastName, email, phone]
    );
    
    // Get the created booking
    const [bookings] = await pool.query(`
      SELECT b.*, r.name as room_name
      FROM bookings b
      JOIN rooms r ON b.room_id = r.id
      WHERE b.id = ?
    `, [result.insertId]);
    
    res.status(201).json(bookings[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update booking status
router.patch('/:id/status', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Check if booking exists
    const [bookings] = await pool.query('SELECT * FROM bookings WHERE id = ?', [id]);
    
    if (bookings.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    const booking = bookings[0];
    
    // Check if the user is authorized to update this booking
    if (booking.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Users can only cancel their bookings, admins can change to any status
    if (req.user.role !== 'admin' && status !== 'cancelled') {
      return res.status(403).json({ message: 'Not authorized to change to this status' });
    }
    
    // Update booking status
    await pool.query('UPDATE bookings SET status = ? WHERE id = ?', [status, id]);
    
    // Get the updated booking
    const [updatedBookings] = await pool.query(`
      SELECT b.*, r.name as room_name
      FROM bookings b
      JOIN rooms r ON b.room_id = r.id
      WHERE b.id = ?
    `, [id]);
    
    res.json(updatedBookings[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a booking (admin only)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if booking exists
    const [bookings] = await pool.query('SELECT * FROM bookings WHERE id = ?', [id]);
    
    if (bookings.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Delete booking
    await pool.query('DELETE FROM bookings WHERE id = ?', [id]);
    
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Seed sample bookings (for demo purposes)
router.post('/seed-data', verifyToken, isAdmin, async (req, res) => {
  try {
    // Check if bookings already exist
    const [existingBookings] = await pool.query('SELECT * FROM bookings');
    
    if (existingBookings.length > 0) {
      return res.json({ 
        success: true, 
        message: 'Sample bookings already exist' 
      });
    }
    
    // Get admin user ID
    const adminId = req.user.id;
    
    // Insert sample bookings
    await pool.query(`
      INSERT INTO bookings 
        (user_id, room_id, check_in, check_out, guests, total_price, status, first_name, last_name, email, phone) 
      VALUES 
        (?, 1, '2023-06-15', '2023-06-20', 2, 750.00, 'completed', 'John', 'Doe', 'john@example.com', '123-456-7890'),
        (?, 2, '2023-07-10', '2023-07-15', 3, 1250.00, 'confirmed', 'Jane', 'Smith', 'jane@example.com', '987-654-3210'),
        (?, 3, '2023-05-20', '2023-05-25', 2, 1750.00, 'cancelled', 'Robert', 'Johnson', 'robert@example.com', '555-123-4567')
    `, [adminId, adminId, adminId]);
    
    res.json({ 
      success: true, 
      message: 'Sample bookings created successfully' 
    });
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
