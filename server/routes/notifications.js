import express from 'express';
import { query } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/notifications - Get user's notifications
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await query(`
      SELECT * FROM notifications
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 50
    `, [req.userId]);

    res.json({
      success: true,
      data: result.rows || [],
    });
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// POST /api/notifications/mark-read/:id - Mark notification as read
router.post('/mark-read/:id', authenticateToken, async (req, res) => {
  try {
    const result = await query(
      'UPDATE notifications SET read = true WHERE id = $1 AND user_id = $2 RETURNING *',
      [req.params.id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Failed to mark notification as read:', error);
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

// POST /api/notifications/mark-all-read - Mark all as read
router.post('/mark-all-read', authenticateToken, async (req, res) => {
  try {
    await query(
      'UPDATE notifications SET read = true WHERE user_id = $1',
      [req.userId]
    );

    res.json({
      success: true,
      message: 'All notifications marked as read',
    });
  } catch (error) {
    console.error('Failed to mark all as read:', error);
    res.status(500).json({ error: 'Failed to update notifications' });
  }
});

// Internal: Create notification
export const createNotification = async (userId, type, title, message, link = null) => {
  try {
    await query(
      `INSERT INTO notifications (user_id, type, title, message, link, read)
       VALUES ($1, $2, $3, $4, $5, false)`,
      [userId, type, title, message, link]
    );
  } catch (error) {
    console.error('Failed to create notification:', error);
  }
};

export default router;
