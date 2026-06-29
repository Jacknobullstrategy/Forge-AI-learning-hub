import express from 'express';
import {
  getContentById,
  listContent,
  searchContent,
  createContent,
  updateContent,
  deleteContent,
  addToSaved,
  removeFromSaved,
  getSavedContent,
  isSaved,
  trackContentView,
} from '../models/Content.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/content - List content with filters
router.get('/', async (req, res) => {
  try {
    const { type, role, industry, difficulty } = req.query;
    const filters = {};

    if (type) filters.type = type;
    if (role) filters.role = role;
    if (industry) filters.industry = industry;
    if (difficulty) filters.difficulty = difficulty;

    const content = await listContent(filters);
    res.json({ success: true, data: content });
  } catch (error) {
    console.error('List content error:', error);
    res.status(500).json({ error: 'Failed to fetch content' });
  }
});

// GET /api/content/search - Search content
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters' });
    }

    const results = await searchContent(q);
    res.json({ success: true, data: results });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Failed to search content' });
  }
});

// GET /api/content/:id - Get single content
router.get('/:id', async (req, res) => {
  try {
    const content = await getContentById(req.params.id);
    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }

    // Track view if user is authenticated
    if (req.userId) {
      await trackContentView(req.userId, req.params.id);
    }

    res.json({ success: true, data: content });
  } catch (error) {
    console.error('Get content error:', error);
    res.status(500).json({ error: 'Failed to fetch content' });
  }
});

// POST /api/content - Create content (admin only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    // TODO: Add role-based authorization to check if user is admin
    const { type, title, description, roles, industries, difficulty, estimatedTime, content, tags } = req.body;

    if (!type || !title || !content) {
      return res.status(400).json({ error: 'Type, title, and content are required' });
    }

    const newContent = await createContent(
      type,
      title,
      description,
      roles || [],
      industries || [],
      difficulty,
      estimatedTime,
      content,
      tags || []
    );

    res.status(201).json({
      success: true,
      message: 'Content created successfully',
      data: newContent,
    });
  } catch (error) {
    console.error('Create content error:', error);
    res.status(500).json({ error: 'Failed to create content' });
  }
});

// PUT /api/content/:id - Update content (admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { title, description, roles, industries, difficulty, estimatedTime, content, tags } = req.body;

    const updated = await updateContent(
      req.params.id,
      title,
      description,
      roles,
      industries,
      difficulty,
      estimatedTime,
      content,
      tags
    );

    if (!updated) {
      return res.status(404).json({ error: 'Content not found' });
    }

    res.json({
      success: true,
      message: 'Content updated successfully',
      data: updated,
    });
  } catch (error) {
    console.error('Update content error:', error);
    res.status(500).json({ error: 'Failed to update content' });
  }
});

// DELETE /api/content/:id - Delete content (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const deleted = await deleteContent(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: 'Content not found' });
    }

    res.json({
      success: true,
      message: 'Content deleted successfully',
    });
  } catch (error) {
    console.error('Delete content error:', error);
    res.status(500).json({ error: 'Failed to delete content' });
  }
});

// POST /api/content/:id/save - Save content to favorites
router.post('/:id/save', authenticateToken, async (req, res) => {
  try {
    const saved = await addToSaved(req.userId, req.params.id);

    if (!saved) {
      return res.status(409).json({ error: 'Content already saved' });
    }

    res.status(201).json({
      success: true,
      message: 'Content saved successfully',
      data: saved,
    });
  } catch (error) {
    console.error('Save content error:', error);
    res.status(500).json({ error: 'Failed to save content' });
  }
});

// DELETE /api/content/:id/save - Remove from favorites
router.delete('/:id/save', authenticateToken, async (req, res) => {
  try {
    const removed = await removeFromSaved(req.userId, req.params.id);

    if (!removed) {
      return res.status(404).json({ error: 'Content not in saved list' });
    }

    res.json({
      success: true,
      message: 'Content removed from saved',
    });
  } catch (error) {
    console.error('Remove saved content error:', error);
    res.status(500).json({ error: 'Failed to remove from saved' });
  }
});

// GET /api/content/:id/saved - Check if content is saved
router.get('/:id/saved', authenticateToken, async (req, res) => {
  try {
    const saved = await isSaved(req.userId, req.params.id);
    res.json({ success: true, data: { saved } });
  } catch (error) {
    console.error('Check saved error:', error);
    res.status(500).json({ error: 'Failed to check saved status' });
  }
});

export default router;
