const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Get all reviews (admin only)
router.get('/all', verifyToken, isAdmin, async (req, res) => {
  try {
    const [reviews] = await pool.query(`
      SELECT r.*, rm.name as room_name, u.name as user_name, u.email as user_email
      FROM reviews r
      JOIN rooms rm ON r.room_id = rm.id
      JOIN users u ON r.user_id = u.id
      ORDER BY r.created_at DESC
    `);
    
    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get reviews by room ID
router.get('/room/:roomId', async (req, res) => {
  try {
    const { roomId } = req.params;
    
    // Check if room exists
    const [rooms] = await pool.query('SELECT * FROM rooms WHERE id = ?', [roomId]);
    
    if (rooms.length === 0) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    // Get approved reviews for the room
    const [reviews] = await pool.query(`
      SELECT r.*, u.name as user_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.room_id = ? AND r.status = 'approved'
      ORDER BY r.created_at DESC
    `, [roomId]);
    
    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's reviews
router.get('/user', verifyToken, async (req, res) => {
  try {
    const [reviews] = await pool.query(`
      SELECT r.*, rm.name as room_name
      FROM reviews r
      JOIN rooms rm ON r.room_id = rm.id
      WHERE r.user_id = ?
      ORDER BY r.created_at DESC
    `, [req.user.id]);
    
    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new review
router.post('/', verifyToken, async (req, res) => {
  try {
    const { roomId, rating, comment } = req.body;
    
    // Check if room exists
    const [rooms] = await pool.query('SELECT * FROM rooms WHERE id = ?', [roomId]);
    
    if (rooms.length === 0) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    // Check if user has already reviewed this room
    const [existingReviews] = await pool.query(
      'SELECT * FROM reviews WHERE user_id = ? AND room_id = ?',
      [req.user.id, roomId]
    );
    
    if (existingReviews.length > 0) {
      return res.status(400).json({ message: 'You have already reviewed this room' });
    }
    
    // Check if user has booked this room
    const [bookings] = await pool.query(
      'SELECT * FROM bookings WHERE user_id = ? AND room_id = ? AND status = "completed"',
      [req.user.id, roomId]
    );
    
    if (bookings.length === 0 && req.user.role !== 'admin') {
      return res.status(400).json({ message: 'You can only review rooms you have stayed in' });
    }
    
    // Create review
    const [result] = await pool.query(
      'INSERT INTO reviews (user_id, room_id, rating, comment, status) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, roomId, rating, comment, req.user.role === 'admin' ? 'approved' : 'pending']
    );
    
    // Get the created review
    const [reviews] = await pool.query(`
      SELECT r.*, u.name as user_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.id = ?
    `, [result.insertId]);
    
    res.status(201).json(reviews[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update review status (admin only)
router.patch('/:id/status', verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Check if review exists
    const [reviews] = await pool.query('SELECT * FROM reviews WHERE id = ?', [id]);
    
    if (reviews.length === 0) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    // Update review status
    await pool.query('UPDATE reviews SET status = ? WHERE id = ?', [status, id]);
    
    // Get the updated review
    const [updatedReviews] = await pool.query(`
      SELECT r.*, u.name as user_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.id = ?
    `, [id]);
    
    res.json(updatedReviews[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a review
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if review exists
    const [reviews] = await pool.query('SELECT * FROM reviews WHERE id = ?', [id]);
    
    if (reviews.length === 0) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    const review = reviews[0];
    
    // Check if the user is authorized to delete this review
    if (review.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Delete review
    await pool.query('DELETE FROM reviews WHERE id = ?', [id]);
    
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Seed sample reviews (for demo purposes)
router.post('/seed-data', verifyToken, isAdmin, async (req, res) => {
  try {
    // Check if reviews already exist
    const [existingReviews] = await pool.query('SELECT * FROM reviews');
    
    if (existingReviews.length > 0) {
      return res.json({ 
        success: true, 
        message: 'Sample reviews already exist' 
      });
    }
    
    // Get admin user ID
    const adminId = req.user.id;
    
    // Insert sample reviews
    await pool.query(`
      INSERT INTO reviews (user_id, room_id, rating, comment, status)
      VALUES 
        (?, 1, 5, 'Phòng rất tuyệt vời, sạch sẽ và thoải mái. Nhân viên rất thân thiện và hữu ích.', 'approved'),
        (?, 2, 4, 'Phòng rộng rãi và thoải mái cho gia đình. Tuy nhiên, Wi-Fi hơi chậm.', 'approved'),
        (?, 3, 5, 'Phòng sang trọng với tầm nhìn tuyệt vời. Dịch vụ phòng nhanh chóng và hiệu quả.', 'pending')
    `, [adminId, adminId, adminId]);
    
    res.json({ 
      success: true, 
      message: 'Sample reviews created successfully' 
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
