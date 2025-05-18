const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Update users table structure
router.post('/update-users-table', async (req, res) => {
  try {
    // Check if first_name column already exists
    const [columns] = await pool.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'users' 
      AND COLUMN_NAME = 'first_name'
    `);
    
    if (columns.length > 0) {
      return res.json({ 
        success: true, 
        message: 'Table structure already updated' 
      });
    }
    
    // Start a transaction
    await pool.query('START TRANSACTION');
    
    try {
      // Add new columns
      await pool.query(`
        ALTER TABLE users 
        ADD COLUMN first_name VARCHAR(50) NULL AFTER id,
        ADD COLUMN last_name VARCHAR(50) NULL AFTER first_name,
        ADD COLUMN phone VARCHAR(20) NULL AFTER email
      `);
      
      // Update existing users
      await pool.query(`
        UPDATE users 
        SET first_name = SUBSTRING_INDEX(name, ' ', 1),
            last_name = SUBSTRING_INDEX(name, ' ', -1)
      `);
      
      // Make first_name and last_name NOT NULL
      await pool.query(`
        ALTER TABLE users 
        MODIFY COLUMN first_name VARCHAR(50) NOT NULL,
        MODIFY COLUMN last_name VARCHAR(50) NOT NULL
      `);
      
      // Drop name column
      await pool.query(`
        ALTER TABLE users 
        DROP COLUMN name
      `);
      
      // Commit the transaction
      await pool.query('COMMIT');
      
      res.json({ 
        success: true, 
        message: 'Users table structure updated successfully' 
      });
    } catch (error) {
      // Rollback in case of error
      await pool.query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Error updating users table structure:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating users table structure', 
      error: error.message 
    });
  }
});

module.exports = router;
