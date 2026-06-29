import express from 'express';
import { query } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/analytics/dashboard - Admin dashboard stats
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    // Get total users
    const usersResult = await query('SELECT COUNT(*) as count FROM users');
    const totalUsers = usersResult.rows[0]?.count || 0;

    // Get total content
    const contentResult = await query('SELECT COUNT(*) as count FROM content');
    const totalContent = contentResult.rows[0]?.count || 0;

    // Get total views
    const viewsResult = await query('SELECT SUM(view_count) as total FROM content_history');
    const totalViews = viewsResult.rows[0]?.total || 0;

    // Get content by type
    const typeResult = await query(`
      SELECT type, COUNT(*) as count FROM content GROUP BY type
    `);
    const contentByType = {};
    typeResult.rows.forEach(row => {
      contentByType[row.type] = row.count;
    });

    // Get popular content
    const popularResult = await query(`
      SELECT c.id, c.title, ch.view_count
      FROM content c
      LEFT JOIN content_history ch ON c.id = ch.content_id
      ORDER BY ch.view_count DESC NULLS LAST
      LIMIT 10
    `);
    const popularContent = popularResult.rows || [];

    // Get user engagement
    const engagementResult = await query(`
      SELECT
        COUNT(DISTINCT sc.user_id) as users_with_saves,
        COUNT(DISTINCT ch.user_id) as users_with_views
      FROM saved_content sc
      FULL OUTER JOIN content_history ch ON 1=1
    `);
    const engagement = engagementResult.rows[0] || {};

    res.json({
      success: true,
      data: {
        totalUsers,
        totalContent,
        totalViews,
        contentByType,
        popularContent,
        engagement: {
          usersWithSaves: engagement.users_with_saves || 0,
          usersWithViews: engagement.users_with_views || 0,
        },
      },
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// GET /api/analytics/content/:id - Content-specific analytics
router.get('/content/:id', authenticateToken, async (req, res) => {
  try {
    const result = await query(`
      SELECT
        c.id,
        c.title,
        c.type,
        COUNT(DISTINCT ch.user_id) as unique_viewers,
        SUM(ch.view_count) as total_views,
        COUNT(DISTINCT sc.user_id) as times_saved,
        MAX(ch.last_viewed) as last_viewed
      FROM content c
      LEFT JOIN content_history ch ON c.id = ch.content_id
      LEFT JOIN saved_content sc ON c.id = sc.content_id
      WHERE c.id = $1
      GROUP BY c.id, c.title, c.type
    `, [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Content not found' });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Content analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch content analytics' });
  }
});

// GET /api/analytics/users - User engagement analytics
router.get('/users', authenticateToken, async (req, res) => {
  try {
    const result = await query(`
      SELECT
        u.id,
        u.email,
        up.role,
        up.industry,
        COUNT(DISTINCT ch.content_id) as contents_viewed,
        COUNT(DISTINCT sc.content_id) as contents_saved,
        MAX(ch.last_viewed) as last_active
      FROM users u
      LEFT JOIN user_profiles up ON u.id = up.user_id
      LEFT JOIN content_history ch ON u.id = ch.user_id
      LEFT JOIN saved_content sc ON u.id = sc.user_id
      GROUP BY u.id, u.email, up.role, up.industry
      ORDER BY MAX(ch.last_viewed) DESC NULLS LAST
      LIMIT 100
    `);

    res.json({
      success: true,
      data: result.rows || [],
    });
  } catch (error) {
    console.error('User analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch user analytics' });
  }
});

// POST /api/analytics/event - Track custom events
router.post('/event', authenticateToken, async (req, res) => {
  try {
    const { eventType, contentId, metadata } = req.body;

    if (!eventType) {
      return res.status(400).json({ error: 'Event type is required' });
    }

    // Could store events in a separate table for detailed tracking
    console.log(`[ANALYTICS] ${eventType}`, {
      userId: req.userId,
      contentId,
      metadata,
      timestamp: new Date(),
    });

    res.json({
      success: true,
      message: 'Event tracked',
    });
  } catch (error) {
    console.error('Event tracking error:', error);
    res.status(500).json({ error: 'Failed to track event' });
  }
});

export default router;
